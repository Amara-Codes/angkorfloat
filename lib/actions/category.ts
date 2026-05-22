"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";

async function checkPermission(permission: string) {
  const session = await auth();
  const permissions = (session?.user as any)?.permissions || [];
  const roles = (session?.user as any)?.roles || [];
  const isSuperAdmin = roles.includes("SUPERADMIN") || roles.includes("ADMIN");

  if (!isSuperAdmin && !permissions.includes(permission)) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function deleteCategory(id: string) {
  await checkPermission("category:delete");
  await prisma.postCategory.delete({ where: { id } });
  
  revalidatePath("/admin/categories");
  revalidatePath("/admin/blog");
}

export async function saveCategory(prevState: any, formData: FormData, id?: string) {
  const session = await auth();
  if (!session?.user) return "Unauthorized";

  try {
    if (id) {
      await checkPermission("category:update");
    } else {
      await checkPermission("category:create");
    }

    const name = (formData.get("name") as string) || "";

    if (!name.trim()) {
      return "Category name is required";
    }

    const data = {
      name: name.trim(),
    };

    if (id) {
      await prisma.postCategory.update({
        where: { id },
        data,
      });
    } else {
      // Check for duplicate name manually to give a clean error message
      const existing = await prisma.postCategory.findUnique({
        where: { name: data.name },
      });
      if (existing) {
        return `A category named "${data.name}" already exists.`;
      }

      await prisma.postCategory.create({
        data,
      });
    }
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    
    // Check for Prisma unique constraint error
    if (error.code === 'P2002') {
      return "A category with this name already exists.";
    }
    
    console.error("[Category Action] Error saving category:", error);
    return error.message || "Failed to save category.";
  }

  const locale = await getLocale();
  revalidatePath("/admin/categories");
  revalidatePath("/admin/blog");
  redirect({ href: "/admin/categories", locale });
}
