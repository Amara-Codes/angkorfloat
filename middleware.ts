import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

const { auth } = NextAuth(authConfig);


export const runtime = 'experimental-edge';

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

  if (!isLoggedIn) {
    if ((isAdminRoute && !isSecretLoginRoute) || isDirectLoginRoute) {
      // CORREZIONE REDIRECT 404: Reindirizziamo al 404 internazionalizzato corretto per l'App Router
      const url = req.nextUrl.clone();
      url.pathname = hasLocale ? `/${locale}/404` : `/${routing.defaultLocale}/404`;
      return NextResponse.rewrite(url);
    }
    
    if (isSecretLoginRoute) {
      let newPath = '/login';
      if (locale !== routing.defaultLocale) {
        newPath = `/${locale}/login`;
      }
      
      req.nextUrl.pathname = newPath;
      return intlMiddleware(req);
    }
  } else {
    if (isSecretLoginRoute || isDirectLoginRoute) {
      const redirectUrl = new URL(req.url);
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