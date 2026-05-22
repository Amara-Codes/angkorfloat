"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function adminPreCheck(formData: any) {
  const { email, password } = formData;
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    include: {
      roles: true,
    },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const passwordsMatch = await bcrypt.compare(password, user.password);
  if (!passwordsMatch) {
    throw new Error("Invalid credentials");
  }

  // The user requested: "allow access to ALL user roles".
  // So we just check if the user exists and has a valid password.
  // We can return a generic object to let the frontend proceed.
  return {
    isValid: true,
    roles: user.roles.map(r => r.name),
    isSuperAdmin: user.roles.some(r => r.name === "SUPERADMIN")
  };
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    const email = formData.get("email");
    console.log('[Action] Authenticating:', email);
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      mfaCode: formData.get("mfaCode"),
      redirectTo: "/admin",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      console.log('[Action] Auth error type:', error.type);
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    // NEXT_REDIRECT is thrown by signIn on success, we need to let it bubble up
    if ((error as any).message === "NEXT_REDIRECT") {
       console.log('[Action] Success! Redirecting...');
       throw error;
    }
    console.error('[Action] Unexpected error:', error);
    throw error;
  }
}
