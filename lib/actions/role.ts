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

export async function getRoles() {
  await checkPermission("role:read");
  return prisma.role.findMany({
    include: {
      permissions: true,
      _count: {
        select: { users: true }
      }
    },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getPermissions() {
  await checkPermission("role:read");
  return prisma.permission.findMany({
    orderBy: {
      name: "asc",
    },
  });
}

export async function deleteRole(id: string) {
  await checkPermission("role:delete");
  
  const role = await prisma.role.findUnique({
    where: { id },
    include: { _count: { select: { users: true } } }
  });

  if (role?._count.users && role._count.users > 0) {
    throw new Error("Cannot delete a role that has assigned users.");
  }

  if (role?.name === 'SUPERADMIN') {
    throw new Error("Cannot delete the SUPERADMIN role.");
  }

  await prisma.role.delete({ where: { id } });
  revalidatePath("/admin/roles");
}

export async function saveRole(prevState: any, formData: FormData, id?: string) {
  const session = await auth();
  if (!session?.user) return "Unauthorized";
  
  try {
    if (id) {
      await checkPermission("role:update");
    } else {
      await checkPermission("role:create");
    }

    const name = (formData.get("name") as string).trim().replace(/\s+/g, "_");
    const permissionIds = formData.getAll("permissions") as string[];

    const data: any = {
      name,
      permissions: {
        set: permissionIds.map(pid => ({ id: pid }))
      }
    };

    if (id) {
      await prisma.role.update({
        where: { id },
        data,
      });
    } else {
      const existing = await prisma.role.findUnique({ where: { name } });
      if (existing) return "Role with this name already exists.";

      await prisma.role.create({
        data,
      });
    }
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("[Role Action] Error saving role:", error);
    return error.message || "Failed to save role.";
  }

  const locale = await getLocale();
  revalidatePath("/admin/roles");
  redirect({ href: "/admin/roles", locale });
}
