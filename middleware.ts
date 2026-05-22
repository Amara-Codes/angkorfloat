import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const { auth } = NextAuth(authConfig);


export default auth((req) => {
  const isLoggedIn = !!req.auth?.user;
  const { pathname } = req.nextUrl;
  const salt = process.env.ADMIN_LOGIN_ROUTE_SALT;

  const isSecretLoginRoute = salt ? pathname.includes(`/admin/${salt}`) : false;
  const isAdminRoute = pathname.includes("/admin");
  const isDirectLoginRoute = pathname.includes("/login");

  // Estraiamo il locale corrente dalla richiesta o usiamo quello di default
  const segments = pathname.split('/');
  const firstSegment = segments[1];
  const hasLocale = routing.locales.includes(firstSegment as any);
  const locale = hasLocale ? firstSegment : routing.defaultLocale;

  // Check if we have the secret bypass from an internal rewrite
  const hasBypass = salt ? req.nextUrl.searchParams.get('bypass') === salt : false;

  if (!isLoggedIn) {
    if (((isAdminRoute && !isSecretLoginRoute) || isDirectLoginRoute) && !hasBypass) {
      // CORREZIONE REDIRECT 404: Reindirizziamo al 404 internazionalizzato corretto per l'App Router
      const url = req.nextUrl.clone();
      url.pathname = hasLocale ? `/${locale}/404` : `/${routing.defaultLocale}/404`;
      return NextResponse.rewrite(url);
    }
    
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
  } else {
    if (isSecretLoginRoute || isDirectLoginRoute) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = pathname.replace(`/admin/${salt}`, '/admin').replace('/login', '/admin');
      return NextResponse.redirect(redirectUrl);
    }
  }

  return intlMiddleware(req);
});

export const config = {
  // Configurazione del matcher ottimizzata per saltare i file fisici di sistema di Cloudflare
  matcher: ['/((?!api|_next|_vercel|images|svg|fonts|.*\\..*).*)']
};