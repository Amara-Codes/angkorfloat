import BlogForm from "@/components/admin/blog/BlogForm";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { hasPermission, protectPage } from "@/lib/rbac";

export default async function EditBlogPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const session = await auth();
  await protectPage(session, 'blog');
  
  if (!hasPermission(session, 'blog', 'update')) {
    redirect('/admin/blog');
  }
  
  const post = await prisma.blogPost.findUnique({
    where: { id },
    include: {
      categories: true,
    }
  });

  if (!post) {
    notFound();
  }

  const categories = await prisma.postCategory.findMany({
    orderBy: { name: 'asc' },
  });

  const serializedPost = post ? {
    ...post,
    thumbnailImage: !post.thumbnailUrl && post.thumbnailImage 
      ? `data:image/png;base64,${Buffer.from(post.thumbnailImage).toString('base64')}` 
      : null,
    ogImage: !post.ogImageUrl && post.ogImage 
      ? `data:image/png;base64,${Buffer.from(post.ogImage).toString('base64')}` 
      : null,
  } : null;

  const canPublish = hasPermission(session, 'blog', 'publish');

  return (
      <BlogForm
        post={serializedPost as any}
        categories={categories}
        initialCategoryIds={post?.categories.map((c: any) => c.id) || []}
        canPublish={canPublish}
      />
  );
}
