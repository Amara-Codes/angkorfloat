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

  if (!isLoggedIn) {
    if ((isAdminRoute && !isSecretLoginRoute) || isDirectLoginRoute) {
      // Return 404 for unauthorized access to admin or direct login
      return NextResponse.rewrite(new URL('/404', req.url));
    }
    if (isSecretLoginRoute) {
      // Modify the request pathname so next-intl processes it as the login page
      const segments = pathname.split('/');
      const firstSegment = segments[1];
      const hasLocale = routing.locales.includes(firstSegment as any);
      const locale = hasLocale ? firstSegment : routing.defaultLocale;
      
      let newPath = '/login';
      if (locale !== routing.defaultLocale) {
        newPath = `/${locale}/login`;
      }
      
      req.nextUrl.pathname = newPath;
      // Then let next-intl handle the rest
      return intlMiddleware(req);
    }
  } else {
    // Logged in users trying to access login routes should be redirected to dashboard
    if (isSecretLoginRoute || isDirectLoginRoute) {
      const redirectUrl = new URL(req.url);
      redirectUrl.pathname = pathname.replace(`/admin/${salt}`, '/admin').replace('/login', '/admin');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // Normal processing for all other routes
  return intlMiddleware(req);
});

export const config = {
  // Match only internationalized pathnames
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
