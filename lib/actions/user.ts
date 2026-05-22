"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/routing";
import { getLocale } from "next-intl/server";
import bcrypt from "bcryptjs";
import { uploadFileToR2, deleteFileFromR2 } from "@/lib/r2";

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

export async function getUsers() {
  await checkPermission("user:read");
  return prisma.user.findMany({
    include: {
      roles: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteUser(id: string) {
  const session = await checkPermission("user:delete");
  
  if (!session?.user || (session.user as any).id === id) {
    throw new Error("You cannot delete your own account.");
  }

  // Don't allow deleting the last superadmin if we can check that
  const user = await prisma.user.findUnique({
    where: { id },
    include: { roles: true }
  });
  
  if (user?.email === 'admin@angkorfloat.com') {
    throw new Error("Cannot delete the primary super admin.");
  }

  // Clean up R2 profile image if it exists
  if (user?.imageUrl) {
    await deleteFileFromR2(user.imageUrl);
  }

  await prisma.user.delete({ where: { id } });
  revalidatePath("/admin/users");
}

export async function saveUser(prevState: any, formData: FormData, id?: string) {
  const session = await auth();
  if (!session?.user) return "Unauthorized";
  
  try {
    if (id) {
      await checkPermission("user:update");
    } else {
      await checkPermission("user:create");
    }

    const email = formData.get("email") as string;
    const name = formData.get("name") as string | null;
    const surname = formData.get("surname") as string | null;
    const biography = formData.get("biography") as string | null;
    const password = formData.get("password") as string | null;
    const passwordConfirm = formData.get("passwordConfirm") as string | null;
    const roleId = formData.get("roleId") as string;
    const removeImage = formData.get("removeImage") === "true";
    const imageFile = formData.get("image") as File | null;
    const hasNewImage = imageFile && imageFile.size > 0;

    if (!id && (!password || password.length < 6)) {
      return "Password must be at least 6 characters long.";
    }

    if (password && password !== passwordConfirm) {
      return "Passwords do not match.";
    }

    let imageUrl: string | null = null;
    let imageBytes: Buffer | null = null;
    let uploadSuccess = false;

    // Fetch existing user to check for previous image for clean up
    let existingUser: any = null;
    if (id) {
      existingUser = await prisma.user.findUnique({
        where: { id },
        select: { imageUrl: true },
      });
    }

    if (removeImage) {
      imageUrl = null;
      imageBytes = null;
      if (existingUser?.imageUrl) {
        await deleteFileFromR2(existingUser.imageUrl);
      }
    } else if (hasNewImage) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileExtension = imageFile.name.split('.').pop() || 'png';
      const uniqueFileName = `user-${id || 'new'}-${Date.now()}.${fileExtension}`;
      
      const uploadedUrl = await uploadFileToR2(
        buffer,
        "users/images",
        uniqueFileName,
        imageFile.type
      );

      if (uploadedUrl) {
        imageUrl = uploadedUrl;
        uploadSuccess = true;
        // Clean up previous image if it exists
        if (existingUser?.imageUrl) {
          await deleteFileFromR2(existingUser.imageUrl);
        }
      } else {
        imageBytes = buffer;
      }
    }

    const data: any = {
      email,
      name,
      surname,
      biography,
      roles: {
        [id ? 'set' : 'connect']: [{ id: roleId }]
      }
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }

    if (removeImage) {
      data.imageUrl = null;
      data.image = null;
    } else if (imageUrl !== null || imageBytes !== null) {
      data.imageUrl = imageUrl;
      data.image = imageBytes;
    }

    if (id) {
      await prisma.user.update({
        where: { id },
        data,
      });
    } else {
      // Check if user already exists
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) return "User with this email already exists.";

      await prisma.user.create({
        data,
      });
    }
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("[User Action] Error saving user:", error);
    return error.message || "Failed to save user.";
  }

  const locale = await getLocale();
  revalidatePath("/admin/users");
  redirect({ href: "/admin/users", locale });
}
