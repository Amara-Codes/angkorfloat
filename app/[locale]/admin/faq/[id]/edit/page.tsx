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
  });

  if (!faq) {
    notFound();
  }

  const canPublish = hasPermission(session, 'faq', 'publish');

  return (
    <FaqForm faq={faq} canPublish={canPublish} />
  );
}
