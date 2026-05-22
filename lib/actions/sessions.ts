"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/routing";
import { auth } from "@/auth";

async function checkPermission(permission: string) {
  const session = await auth();
  const permissions = (session?.user as any)?.permissions || [];
  const roles = (session?.user as any)?.roles || [];
  const isSuperAdmin = roles.includes("SUPERADMIN") || roles.includes("ADMIN");

  if (!isSuperAdmin && !permissions.includes(permission)) {
    throw new Error("Unauthorized");
  }
}

import { getLocale } from "next-intl/server";

export async function saveHealingSession(prevState: any, formData: FormData, id?: string) {
  try {
    await checkPermission(id ? "session:update" : "session:create");

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const duration = parseInt(formData.get("duration") as string);
    const price = parseFloat(formData.get("price") as string);
    const therapistId = formData.get("therapistId") as string;

    if (id) {
      await prisma.healingSession.update({
        where: { id },
        data: { name, description, duration, price, therapistId },
      });
    } else {
      await prisma.healingSession.create({
        data: { name, description, duration, price, therapistId },
      });
    }
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    return error.message || "Failed to save session.";
  }

  const locale = await getLocale();
  revalidatePath("/admin/sessions");
  redirect({ href: "/admin/sessions", locale });
}

export async function deleteHealingSession(id: string) {
  await checkPermission("session:delete");

  await prisma.healingSession.delete({
    where: { id },
  });

  revalidatePath("/admin/sessions");
}
