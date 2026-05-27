import { auth } from "@/auth";
import { protectPage, hasPermission } from "@/lib/rbac";
import FaqForm from "@/components/admin/faq/FaqForm";
import prisma from "@/lib/prisma";

export default async function NewFaqPage() {
  const session = await auth();
  await protectPage(session, 'faq');

  const canPublish = hasPermission(session, 'faq', 'publish');

  const categories = await prisma.postCategory.findMany({
    where: { applicableTo: { in: ["FAQ", "BOTH"] } },
    orderBy: { name: 'asc' },
  });

  return (
    <FaqForm canPublish={canPublish} categories={categories} initialCategoryIds={[]} />
  );
}
