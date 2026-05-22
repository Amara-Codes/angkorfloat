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

export async function saveFloatPackage(prevState: any, formData: FormData, id?: string) {
  try {
    await checkPermission(id ? "package:update" : "package:create");

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const sessionCount = parseInt(formData.get("sessionCount") as string);
    const validityDays = parseInt(formData.get("validityDays") as string);

    if (id) {
      await prisma.floatPackage.update({
        where: { id },
        data: { name, description, price, sessionCount, validityDays },
      });
    } else {
      await prisma.floatPackage.create({
        data: { name, description, price, sessionCount, validityDays },
      });
    }
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    return error.message || "Failed to save package.";
  }

  const locale = await getLocale();
  revalidatePath("/admin/float-packages");
  redirect({ href: "/admin/float-packages", locale });
}

export async function deleteFloatPackage(id: string) {
  await checkPermission("package:delete");

  await prisma.floatPackage.delete({
    where: { id },
  });

  revalidatePath("/admin/float-packages");
}
