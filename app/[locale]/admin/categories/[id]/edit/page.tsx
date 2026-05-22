import CategoryForm from "@/components/admin/category/CategoryForm";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, protectPage } from "@/lib/rbac";

export default async function EditCategoryPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const session = await auth();
  await protectPage(session, 'category');
  
  if (!hasPermission(session, 'category', 'update')) {
    redirect('/admin/categories');
  }
  
  const category = await prisma.postCategory.findUnique({
    where: { id },
  });

  if (!category) {
    notFound();
  }

  return (
    <CategoryForm category={category} />
  );
}
