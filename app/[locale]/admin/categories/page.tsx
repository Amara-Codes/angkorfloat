import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { Edit, Tag, BookOpen, Calendar, HelpCircle } from "lucide-react";
import DeleteCategoryButton from "@/components/admin/category/DeleteCategoryButton";
import { hasPermission, protectPage } from "@/lib/rbac";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/common/Card";
import TabHeading from "@/components/admin/common/TabHeading";

export default async function CategoryListPage() {
  const session = await auth();
  await protectPage(session, 'category');

  const categories = await prisma.postCategory.findMany({
    include: {
      _count: {
        select: { posts: true, faqs: true }
      }
    },
    orderBy: { name: "asc" },
  });

  const canCreate = hasPermission(session, 'category', 'create');
  const canUpdate = hasPermission(session, 'category', 'update');
  const canDelete = hasPermission(session, 'category', 'delete');

  return (
    <div className="space-y-8 transition-colors duration-300">
      <TabHeading
        title="Categories"
        buttonHref="/admin/categories/new"
        buttonLabel="Add Category"
        showButton={canCreate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat) => (
          <Card key={cat.id} roundness="4xl" className="transition-all hover:translate-y-[-4px] hover:shadow-2xl">
            <CardHeader className="mb-0 pb-0 flex justify-end">
              <div className="flex items-center gap-1">
                {canUpdate && (
                  <Link 
                    href={`/admin/categories/${cat.id}/edit` as any}
                    className="p-2.5 text-custom-blue/40 dark:text-custom-celadon/50 hover:text-custom-blue dark:hover:text-custom-celadon hover:bg-custom-blue/5 dark:hover:bg-white/10 rounded-xl transition-all shadow-sm"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                )}
                {canDelete && <DeleteCategoryButton id={cat.id} />}
              </div>
            </CardHeader>

            <CardBody className="pt-2 pb-2 space-y-6">
              <div className="flex flex-col items-start gap-4 min-w-0">
                <div className="min-w-0 w-full">
                  <h3 className="text-3xl font-kugile text-custom-blue dark:text-custom-celadon leading-snug truncate" title={cat.name}>
                    {cat.name}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 py-2">
                <div className="flex items-center gap-2 text-custom-blue/80 dark:text-custom-almond/80">
                  <BookOpen className="h-4 w-4 text-custom-blue/50 dark:text-custom-celadon/50 shrink-0" />
                  <span className="text-sm font-semibold font-josefin truncate">
                    {cat._count.posts} {cat._count.posts === 1 ? 'Post' : 'Posts'} associated
                  </span>
                </div>
                <div className="flex items-center gap-2 text-custom-blue/80 dark:text-custom-almond/80">
                  <HelpCircle className="h-4 w-4 text-custom-blue/50 dark:text-custom-celadon/50 shrink-0" />
                  <span className="text-sm font-semibold font-josefin truncate">
                    {cat._count.faqs} {cat._count.faqs === 1 ? 'FAQ' : 'FAQs'} associated
                  </span>
                </div>
              </div>
            </CardBody>

            <CardFooter hasBorder={true} className="pt-4 pb-2 border-t border-custom-blue/10 dark:border-white/10 flex items-center justify-end">
              <span className="text-[9px] text-custom-blue/30 dark:text-custom-celadon/30 font-mono font-bold tracking-wider flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(cat.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </CardFooter>
          </Card>
        ))}

        {categories.length === 0 && (
          <div className="col-span-full">
            <Card roundness="4xl" className="py-24 border border-dashed border-custom-blue/10 dark:border-white/10 flex flex-col items-center justify-center gap-5">
              <div className="h-20 w-20 rounded-full bg-white/50 dark:bg-white/5 flex items-center justify-center shadow-inner">
                <Tag className="h-10 w-10 text-custom-blue/30 dark:text-custom-celadon/30" />
              </div>
              <p className="text-custom-blue/40 dark:text-custom-celadon/50 text-xs font-bold uppercase tracking-widest">No categories saved yet.</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
