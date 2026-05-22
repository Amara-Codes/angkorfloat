import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: `/admin/${process.env.ADMIN_LOGIN_ROUTE_SALT}`,
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Let middleware.ts handle the route protection and redirection
      return true;
    },
  },
  providers: [], 
  secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
