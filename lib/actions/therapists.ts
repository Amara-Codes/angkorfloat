"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "@/i18n/routing";
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

export async function deleteTherapist(id: string) {
  await checkPermission("therapist:delete");
  await prisma.therapist.delete({ where: { id } });
  revalidatePath("/admin/therapists");
}

import { getLocale } from "next-intl/server";

export async function saveTherapist(prevState: any, formData: FormData, id?: string) {
  const session = await auth();
  if (!session?.user) return "Unauthorized";
  
  try {
    if (id) {
      await checkPermission("therapist:update");
    } else {
      await checkPermission("therapist:create");
    }

    const name = formData.get("name") as string;
    const bio = (formData.get("bio") as string) || "";
    const specialties = formData.get("specialties") as string;
    const specialties_kh = formData.get("specialties_kh") as string | null;
    const isActive = formData.get("isActive") === "true";
    const removeImage = formData.get("removeImage") === "true";
    const imageFile = formData.get("image") as File | null;
    const hasNewImage = imageFile && imageFile.size > 0;
    
    let imageUrl: string | null = null;
    let imageBytes: Buffer | null = null;
    let uploadSuccess = false;

    // Fetch existing therapist to check for previous image for clean up
    let existingTherapist: any = null;
    if (id) {
      existingTherapist = await prisma.therapist.findUnique({
        where: { id },
        select: { imageUrl: true },
      });
    }

    if (removeImage) {
      imageUrl = null;
      imageBytes = null;
      if (existingTherapist?.imageUrl) {
        await deleteFileFromR2(existingTherapist.imageUrl);
      }
    } else if (hasNewImage) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const fileExtension = imageFile.name.split('.').pop() || 'png';
      const uniqueFileName = `therapist-${id || 'new'}-${Date.now()}.${fileExtension}`;
      
      const uploadedUrl = await uploadFileToR2(
        buffer,
        "therapists/images",
        uniqueFileName,
        imageFile.type
      );

      if (uploadedUrl) {
        imageUrl = uploadedUrl;
        uploadSuccess = true;
        // Clean up previous image if it exists
        if (existingTherapist?.imageUrl) {
          await deleteFileFromR2(existingTherapist.imageUrl);
        }
      } else {
        // Fallback to storing as DB bytes
        imageBytes = buffer;
      }
    }

    const data: any = {
      name,
      bio,
      specialties,
      specialties_kh: specialties_kh || null,
      isActive,
    };

    if (removeImage) {
      data.imageUrl = null;
      data.image = null;
    } else if (imageUrl !== null || imageBytes !== null) {
      data.imageUrl = imageUrl;
      data.image = imageBytes;
    }

    if (id) {
      await prisma.therapist.update({
        where: { id },
        data,
      });
    } else {
      await prisma.therapist.create({
        data,
      });
    }
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("[Therapist Action] Error saving therapist:", error);
    return error.message || "Failed to save therapist.";
  }

  const locale = await getLocale();
  revalidatePath("/admin/therapists");
  redirect({ href: "/admin/therapists", locale });
}
