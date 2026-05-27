import BlogForm from "@/components/admin/blog/BlogForm";
import { auth } from "@/auth";
import { hasPermission, protectPage } from "@/lib/rbac";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function NewBlogPage() {
  const session = await auth();
  await protectPage(session, 'blog');
  
  if (!hasPermission(session, 'blog', 'create')) {
    redirect('/admin/blog');
  }

  const canPublish = hasPermission(session, 'blog', 'publish');

  const categories = await prisma.postCategory.findMany({
    where: { applicableTo: { in: ["POST", "BOTH"] } },
    orderBy: { name: 'asc' },
  });

  return (
      <BlogForm
        categories={categories}
        initialCategoryIds={[]}
        canPublish={canPublish}
      />
  );
}
