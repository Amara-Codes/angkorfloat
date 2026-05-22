import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import BlogPostsTable from "@/components/admin/blog/BlogPostsTable";
import { hasPermission, protectPage } from "@/lib/rbac";
import TabHeading from "@/components/admin/common/TabHeading";

export default async function BlogListPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await auth();
  await protectPage(session, 'blog');
  
  const searchParams = await props.searchParams;
  const page = Number(searchParams?.page) || 1;
  const perPage = Number(searchParams?.perPage) || 10;
  const sort = searchParams?.sort === 'asc' ? 'asc' : 'desc';

  const totalCount = await prisma.blogPost.count();
  
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: sort },
    include: { author: true },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  const serializedPosts = posts.map((post: any) => ({
    ...post,
    thumbnailImage: !post.thumbnailUrl && post.thumbnailImage 
      ? `data:image/png;base64,${Buffer.from(post.thumbnailImage).toString('base64')}` 
      : null,
  }));

  const canCreate = hasPermission(session, 'blog', 'create');
  const canUpdate = hasPermission(session, 'blog', 'update');
  const canDelete = hasPermission(session, 'blog', 'delete');
  // Assume publish and unpublish share the same permission or 'publish' overrides it
  const roles = (session?.user as any)?.roles || [];
  const permissions = (session?.user as any)?.permissions || [];
  const isSuperAdmin = roles.includes("SUPERADMIN") || roles.includes("ADMIN");
  const canPublish = isSuperAdmin || permissions.includes("blog:publish");

  return (
    <div className="space-y-8 transition-colors duration-300">
      <TabHeading
        title="Blog Posts"
        buttonHref="/admin/blog/new"
        buttonLabel="Create Post"
        showButton={canCreate}
      />

      <BlogPostsTable 
        posts={serializedPosts as any} 
        canDelete={canDelete} 
        canUpdate={canUpdate}
        canPublish={canPublish}
        page={page}
        perPage={perPage}
        totalCount={totalCount}
        sort={sort}
      />
    </div>
  );
}
