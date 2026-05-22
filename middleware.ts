import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 1. ANTILOOP: Se la richiesta è già diretta a una pagina di errore 404, 
  // passiamo il controllo direttamente a next-intl per evitare elaborazioni ridondanti
  if (pathname.includes('/404')) {
    return intlMiddleware(req);
  }

  const isLoggedIn = !!req.auth?.user;
  const salt = process.env.ADMIN_LOGIN_ROUTE_SALT;

  // Analisi dei percorsi (gestisce anche i percorsi prefissati dalla lingua come /en/admin)
  const isSecretLoginRoute = salt ? pathname.includes(`/admin/${salt}`) : false;
  const isAdminRoute = pathname.includes("/admin");
  const isDirectLoginRoute = pathname.includes("/login");

  // Estrazione e gestione del locale corretto
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  const hasLocale = routing.locales.includes(firstSegment as any);
  const locale = hasLocale ? firstSegment : routing.defaultLocale;

  // Controllo del parametro di bypass per i passaggi interni (riscritture)
  const hasBypass = salt ? req.nextUrl.searchParams.get('bypass') === salt : false;

  // 2. LOGICA PER UTENTI NON LOGGATI
  if (!isLoggedIn) {
    
    // Se tenta di accedere a una rotta admin senza il salt segreto, o alla rotta login diretta senza bypass
    if (((isAdminRoute && !isSecretLoginRoute) || isDirectLoginRoute) && !hasBypass) {
      const url = req.nextUrl.clone();
      // Usiamo NextResponse.redirect invece del rewrite: Cloudflare preferisce i redirect espliciti
      // per le rotte protette, azzerando i loop sui proxy inversi.
      url.pathname = hasLocale ? `/${locale}/404` : `/${routing.defaultLocale}/404`;
      return NextResponse.redirect(url);
    }
    
    // Se l'URL corrisponde alla rotta d'accesso segreta con il salt valido
    if (isSecretLoginRoute) {
      const newPath = routing.localePrefix === 'always'
        ? `/${locale}/login`
        : (locale === routing.defaultLocale ? '/login' : `/${locale}/login`);
      
      const rewriteUrl = req.nextUrl.clone();
      rewriteUrl.pathname = newPath;
      if (salt) {
        rewriteUrl.searchParams.set('bypass', salt);
      }
      return NextResponse.rewrite(rewriteUrl);
    }

  // 3. LOGICA PER UTENTI LOGGATI
  } else {
    
    // Se l'utente è già autenticato ma tenta di rientrare dal salt o dal login manuale
    if (isSecretLoginRoute || isDirectLoginRoute) {
      const redirectUrl = req.nextUrl.clone();
      const cleanAdminPath = `/admin`;
      
      // Costruiamo l'URL di destinazione finale includendo il locale per evitare un secondo redirect da next-intl
      redirectUrl.pathname = hasLocale ? `/${firstSegment}${cleanAdminPath}` : `/${locale}${cleanAdminPath}`;
      
      // Eliminiamo il parametro di bypass per ripulire la barra degli indirizzi dell'amministratore
      redirectUrl.searchParams.delete('bypass');
      
      return NextResponse.redirect(redirectUrl);
    }
  }

  // 4. Se la richiesta non soddisfa nessuna delle condizioni precedenti, la affidiamo a next-intl
  return intlMiddleware(req);
});

export const config = {
  // Il matcher esclude i file statici, asset e i nodi interni di sistema di Vercel/Cloudflare
  matcher: ['/((?!api|_next|_vercel|images|svg|fonts|.*\\..*).*)']
};