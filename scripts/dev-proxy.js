export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    // --- SECURITY CHECK ---
    const authHeader = request.headers.get("Authorization");
    const expectedSecret = env.PROXY_SECRET;
    
    if (!expectedSecret) {
      return new Response(JSON.stringify({ error: "La variabile d'ambiente PROXY_SECRET non è configurata sul Worker" }), { status: 500, headers: corsHeaders });
    }
    
    if (authHeader !== `Bearer ${expectedSecret}`) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }
    // ----------------------

    try {
      const db = env.angkorfloat_db;
      if (!db) {
        return new Response(JSON.stringify({ error: "Binding angkorfloat_db non trovato" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const body = await request.json();
      const { action, sql, params, statements } = body;

      let result;
      if (action === "query") {
        const stmt = db.prepare(sql);
        result = await (params && params.length > 0 ? stmt.bind(...params).all() : stmt.all());
      } else if (action === "execute") {
        const stmt = db.prepare(sql);
        result = await (params && params.length > 0 ? stmt.bind(...params).run() : stmt.run());
      } else if (action === "raw") {
        const stmt = db.prepare(sql);
        const boundStmt = params && params.length > 0 ? stmt.bind(...params) : stmt;
        result = await (body.options ? boundStmt.raw(body.options) : boundStmt.raw());
      } else if (action === "first") {
        const stmt = db.prepare(sql);
        const boundStmt = params && params.length > 0 ? stmt.bind(...params) : stmt;
        result = await (body.colName ? boundStmt.first(body.colName) : boundStmt.first());
      } else if (action === "batch") {
        const dbStatements = statements.map(s => {
          const stmt = db.prepare(s.sql);
          return s.params && s.params.length > 0 ? stmt.bind(...s.params) : stmt;
        });
        result = await db.batch(dbStatements);
      } else if (action === "exec") {
        result = await db.exec(sql);
      } else {
        return new Response(JSON.stringify({ error: `Azione sconosciuta: ${action}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
