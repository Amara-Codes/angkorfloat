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

export async function deleteFaq(id: string) {
  await checkPermission("faq:delete");
  await prisma.faq.delete({ where: { id } });
  revalidatePath("/admin/faq");
}

export async function saveFaq(prevState: any, formData: FormData, id?: string) {
  const session = await auth();
  if (!session?.user) return "Unauthorized";

  try {
    const permissions = (session?.user as any)?.permissions || [];
    const roles = (session?.user as any)?.roles || [];
    const isSuperAdmin = roles.includes("SUPERADMIN") || roles.includes("ADMIN");

    if (id) {
      await checkPermission("faq:update");
    } else {
      await checkPermission("faq:create");
    }

    const question = (formData.get("question") as string) || "";
    const question_kh = (formData.get("question_kh") as string) || null;
    const answer = (formData.get("answer") as string) || "";
    const answer_kh = (formData.get("answer_kh") as string) || null;
    const published = formData.get("published") === "true";

    if (!question || !answer) {
      return "Missing required fields";
    }

    // Enforce publish permission
    const canPublish = isSuperAdmin || permissions.includes("faq:publish");
    let isChangingPublished = false;

    if (id) {
      const existingFaq = await prisma.faq.findUnique({
        where: { id },
        select: { published: true }
      });
      if (existingFaq && existingFaq.published !== published) {
        isChangingPublished = true;
      }
    } else {
      if (published) {
        isChangingPublished = true;
      }
    }

    if (isChangingPublished && !canPublish) {
      return "You do not have permission to publish or unpublish this FAQ.";
    }

    const data = {
      question,
      question_kh,
      answer,
      answer_kh,
      published,
    };

    if (id) {
      await prisma.faq.update({
        where: { id },
        data,
      });
    } else {
      await prisma.faq.create({
        data,
      });
    }
  } catch (error: any) {
    if (error.message === "NEXT_REDIRECT") throw error;
    console.error("[FAQ Action] Error saving FAQ:", error);
    return error.message || "Failed to save FAQ.";
  }

  const locale = await getLocale();
  revalidatePath("/admin/faq");
  redirect({ href: "/admin/faq", locale });
}
