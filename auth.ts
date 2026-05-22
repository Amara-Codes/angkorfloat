import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { TOTP } from 'otpauth';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ 
            email: z.string().email(), 
            password: z.string().min(6),
            mfaCode: z.string().length(6)
          })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password, mfaCode } = parsedCredentials.data;
          
          const adminLoginSecret = process.env.ADMIN_LOGIN_SECRET;
          if (!adminLoginSecret) {
            console.error('[Auth] ADMIN_LOGIN_SECRET is not set');
            return null;
          }

          const totp = new TOTP({ secret: adminLoginSecret });
          const isValidMFA = totp.validate({ token: mfaCode, window: 1 }) !== null;
          if (!isValidMFA) {
             console.log('[Auth] MFA mismatch');
             return null;
          }
          
          // Use absolute path or alias for prisma if needed, but @/lib/prisma should work
          console.log('[Auth] Attempting login for:', email);
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              roles: {
                include: {
                  permissions: true,
                },
              },
            },
          });

          if (!user) {
            console.log('[Auth] User not found');
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log('[Auth] Password match:', passwordsMatch);

          if (passwordsMatch) {
            const permissions = user.roles.flatMap((role) =>
              role.permissions.map((p) => p.name)
            );
            
            console.log('[Auth] Login successful for:', email);
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              roles: user.roles.map(r => r.name),
              permissions: Array.from(new Set(permissions)),
            } as any;
          }
          console.log('[Auth] Password mismatch');
        }

        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.roles = (user as any).roles;
        token.permissions = (user as any).permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).roles = token.roles;
        (session.user as any).permissions = token.permissions;
      }
      return session;
    },
  },
});
