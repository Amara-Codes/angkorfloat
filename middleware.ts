import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // 1. ANTILOOP PRONTISSIMO: Se siamo già sul 404, non toccare nulla
  if (pathname.includes('/404')) {
    return intlMiddleware(req);
  }

  const isLoggedIn = !!req.auth?.user;
  const salt = process.env.ADMIN_LOGIN_ROUTE_SALT;

  const isSecretLoginRoute = salt ? pathname.includes(`/admin/${salt}`) : false;
  const isAdminRoute = pathname.includes("/admin");
  const isDirectLoginRoute = pathname.includes("/login");

  // Gestione del Locale
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  const hasLocale = routing.locales.includes(firstSegment as any);
  const locale = hasLocale ? firstSegment : routing.defaultLocale;

  const hasBypass = salt ? req.nextUrl.searchParams.get('bypass') === salt : false;

  // SCENARIO A: UTENTE NON LOGGATO
  if (!isLoggedIn) {
    
    // Se prova ad andare su /admin pulito o direttamente su /login senza bypass, cacciamolo sul 404
    if (((isAdminRoute && !isSecretLoginRoute) || isDirectLoginRoute) && !hasBypass) {
      const url = req.nextUrl.clone();
      url.pathname = hasLocale ? `/${locale}/404` : `/${routing.defaultLocale}/404`;
      return NextResponse.redirect(url); // Redirect esplicito per non confondere Cloudflare
    }
    
    // Se usa l'URL SEGRETO con il salt corretto
    if (isSecretLoginRoute) {
      const newPath = routing.localePrefix === 'always'
        ? `/${locale}/login`
        : (locale === routing.defaultLocale ? '/login' : `/${locale}/login`);
      
      const rewriteUrl = req.nextUrl.clone();
      rewriteUrl.pathname = newPath;
      
      // Iniettiamo il bypass per permettere a NextAuth e a next-intl di leggerlo internamente
      if (salt) {
        rewriteUrl.searchParams.set('bypass', salt);
      }
      return NextResponse.rewrite(rewriteUrl); // Rewrite: l'URL nella barra rimane quello con il salt!
    }

  // SCENARIO B: UTENTE GIÀ LOGGATO
  } else {
    // Se è loggato e prova a tornare sulla rotta segreta o su /login, mandalo alla dashboard pulita
    if (isSecretLoginRoute || isDirectLoginRoute) {
      const redirectUrl = req.nextUrl.clone();
      const cleanAdminPath = `/admin`;
      
      redirectUrl.pathname = hasLocale ? `/${firstSegment}${cleanAdminPath}` : `/${locale}${cleanAdminPath}`;
      redirectUrl.searchParams.delete('bypass');
      
      return NextResponse.redirect(redirectUrl);
    }
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!api|_next|_vercel|images|svg|fonts|.*\\..*).*)']
};