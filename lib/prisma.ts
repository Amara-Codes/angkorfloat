import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

// Mock D1 PreparedStatement to serialize queries sent to the local proxy
function formatTimestamps(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'number' && obj > 1000000000000 && obj < 3000000000000) {
    // Converte timestamp UNIX in millisecondi in stringhe ISO 8601,
    // formato atteso nativamente dal NAPI engine di Prisma per le colonne DateTime su SQLite.
    // E.g. 1779086718968 -> '2026-05-22T08:05:18.968Z'
    return new Date(obj).toISOString();
  }
  if (Array.isArray(obj)) {
    return obj.map(formatTimestamps);
  }
  if (typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      newObj[key] = formatTimestamps(obj[key]);
    }
    return newObj;
  }
  return obj;
}

class RemoteD1PreparedStatement {
  public sql: string;
  public params: any[] = [];
  private requestFn: (action: string, payload: any) => Promise<any>;

  constructor(sql: string, requestFn: any) {
    this.sql = sql;
    this.requestFn = requestFn;
  }

  bind(...params: any[]) {
    this.params = params;
    return this;
  }

  async all() {
    const res = await this.requestFn('query', { sql: this.sql, params: this.params });
    return formatTimestamps(res);
  }

  async run() {
    const res = await this.requestFn('execute', { sql: this.sql, params: this.params });
    return formatTimestamps(res);
  }

  async raw(options?: any) {
    const res = await this.requestFn('raw', { sql: this.sql, params: this.params, options });
    return formatTimestamps(res);
  }

  async first(colName?: string) {
    const res = await this.requestFn('first', { sql: this.sql, params: this.params, colName });
    return formatTimestamps(res);
  }
}

// Mock D1 Database that queries wrangler's local proxy worker
class RemoteD1Database {
  private proxyUrl: string;
  private proxySecret: string;

  constructor(proxyUrl: string = 'https://sync.angkorfloat.com', proxySecret: string = process.env.D1_PROXY_SECRET || '') {
    this.proxyUrl = proxyUrl;
    this.proxySecret = proxySecret;
  }

  private async request(action: string, payload: any) {
    try {
      const response = await fetch(this.proxyUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.proxySecret}`
        },
        body: JSON.stringify({ action, ...payload }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`D1 Proxy Error (${response.status}): ${errorText}`);
      }

      return await response.json();
    } catch (err: any) {
      console.error(`[RemoteD1Database] Failed to communicate with proxy at ${this.proxyUrl}:`, err);
      throw err;
    }
  }

  prepare(sql: string) {
    return new RemoteD1PreparedStatement(sql, this.request.bind(this));
  }

  async batch(statements: RemoteD1PreparedStatement[]) {
    const serialized = statements.map(s => ({
      sql: s.sql,
      params: s.params,
    }));
    const res = await this.request('batch', { statements: serialized });
    return formatTimestamps(res);
  }

  async exec(sql: string) {
    const res = await this.request('exec', { sql });
    return formatTimestamps(res);
  }
}

const prismaClientSingleton = () => {
  // 1. Ambiente reale di produzione su Cloudflare Pages Edge
  const d1 = (process.env as any).angkorfloat_db || (globalThis as any).angkorfloat_db
  if (d1) {
    const adapter = new PrismaD1(d1)
    return new PrismaClient({ adapter })
  }

  // 2. Sviluppo locale connesso in tempo reale a D1 tramite il tuo proxy custom
  if (process.env.DEV_REMOTE === 'true') {
    console.log("🔌 [Prisma] Connected in real-time to REMOTE CLOUDFLARE D1 via Wrangler Proxy");
    const mockD1 = new RemoteD1Database() as any;
    const adapter = new PrismaD1(mockD1);
    return new PrismaClient({ adapter });
  }

  // 3. Sviluppo locale standard (SQLite dev.db) - ISOLATO PER L'EDGE
  // Questo controllo impedisce a Cloudflare Pages di includere l'engine Node pesante nella build finale
  if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
    console.log("💾 [Prisma] Connected to local SQLite database (dev.db)");
    return new PrismaClient();
  }

  // Fallback di sicurezza se per qualche motivo il binding non risponde sull'Edge
  return new PrismaClient({
    log: ['error'],
  });
}

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export const getDatabaseSource = () => {
  const d1 = (process.env as any).angkorfloat_db || (globalThis as any).angkorfloat_db
  if (d1) return "Cloudflare D1 (Production Edge)"
  if (process.env.DEV_REMOTE === 'true') return "Cloudflare D1 (Remote via Proxy)"
  return "Local SQLite (dev.db)"
}

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma
