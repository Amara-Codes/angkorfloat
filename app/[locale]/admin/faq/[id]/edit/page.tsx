import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { protectPage, hasPermission } from "@/lib/rbac";
import FaqForm from "@/components/admin/faq/FaqForm";

export default async function EditFaqPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const session = await auth();
  await protectPage(session, 'faq');

  const faq = await prisma.faq.findUnique({
    where: { id },
    include: { categories: true },
  });

  if (!faq) {
    notFound();
  }

  const canPublish = hasPermission(session, 'faq', 'publish');

  const categories = await prisma.postCategory.findMany({
    where: { applicableTo: { in: ["FAQ", "BOTH"] } },
    orderBy: { name: 'asc' },
  });

  const initialCategoryIds = faq.categories.map((c) => c.id);

  return (
    <FaqForm
      faq={faq}
      canPublish={canPublish}
      categories={categories}
      initialCategoryIds={initialCategoryIds}
    />
  );
}
