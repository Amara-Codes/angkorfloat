import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    // Lasciamo che punti a /login. NON farà redirect automatici 
    // perché lo bloccheremo prima nel middleware.
    signIn: '/login', 
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const { pathname } = nextUrl;
      const isLoggedIn = !!auth?.user;
      const salt = process.env.ADMIN_LOGIN_ROUTE_SALT;
      
      const isSecretLoginRoute = salt ? pathname.includes(`/admin/${salt}`) : false;
      const isAdminRoute = pathname.includes("/admin");
      const hasBypass = salt ? nextUrl.searchParams.get('bypass') === salt : false;

      // Se l'utente non è loggato e sta provando a entrare in /admin senza il salt o il bypass,
      // blocchiamo l'accesso qui restituendo false.
      if (!isLoggedIn && isAdminRoute && !isSecretLoginRoute && !hasBypass) {
        return false; 
      }

      return true;
    },
  },
  providers: [], 
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;