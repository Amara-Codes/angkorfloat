import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { Edit, HelpCircle, Globe, Lock, Search } from "lucide-react";
import DeleteFaqButton from "@/components/admin/faq/DeleteFaqButton";
import { hasPermission, protectPage } from "@/lib/rbac";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/common/Card";
import TabHeading from "@/components/admin/common/TabHeading";

export default async function FaqListPage() {
  const session = await auth();
  await protectPage(session, 'faq');

  const faqs = await prisma.faq.findMany({
    orderBy: { createdAt: "desc" },
  });

  const canCreate = hasPermission(session, 'faq', 'create');
  const canUpdate = hasPermission(session, 'faq', 'update');
  const canDelete = hasPermission(session, 'faq', 'delete');

  return (
    <div className="space-y-8 transition-colors duration-300">
      <TabHeading
        title="FAQs"
        buttonHref="/admin/faq/new"
        buttonLabel="Add FAQ"
        showButton={canCreate}
      />

      <div className="grid grid-cols-1 gap-6">
        {faqs.map((faq) => (
          <Card key={faq.id} roundness="4xl" className="p-6 transition-all">
            <CardHeader className="mb-0 pb-0">
              <div className="flex items-start justify-between w-full relative">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-custom-blue/5 dark:bg-custom-celadon/10 rounded-xl">
                    <HelpCircle className="h-6 w-6 text-custom-blue dark:text-custom-celadon" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-kugile text-custom-blue dark:text-custom-celadon leading-snug">
                      {faq.question}
                    </h3>
                    <p className="text-sm font-semibold text-custom-blue/60 dark:text-custom-celadon/60 italic mt-1 font-josefin">
                      {faq.question_kh}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {faq.published ? (
                    <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Published</span>
                    </div>
                  ) : (
                    <div className="px-3 py-1.5 rounded-xl bg-custom-rosewood/10 text-custom-rosewood flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Draft</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1 border-l border-custom-blue/10 dark:border-white/10 ps-2 ms-2">
                    {canUpdate && (
                      <Link 
                        href={`/admin/faq/${faq.id}/edit` as any}
                        className="p-2.5 text-custom-blue/40 dark:text-custom-celadon/50 hover:text-custom-blue dark:hover:text-custom-celadon hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all shadow-sm"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                    )}
                    {canDelete && <DeleteFaqButton id={faq.id} />}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardBody className="pt-6 pb-2 space-y-4">
              <div className="bg-custom-coconut/20 dark:bg-custom-blue/20 rounded-2xl p-5 border border-custom-blue/5 dark:border-white/5 space-y-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-custom-blue/40 dark:text-custom-celadon/50 mb-1">Answer (EN)</p>
                  <p className="text-sm font-medium text-custom-blue/80 dark:text-custom-almond/80 leading-relaxed whitespace-pre-wrap">
                    {faq.answer}
                  </p>
                </div>
                <div className="pt-4 border-t border-custom-blue/5 dark:border-white/5">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-custom-blue/40 dark:text-custom-celadon/50 mb-1">Answer (KH)</p>
                  <p className="text-sm font-medium text-custom-blue/80 dark:text-custom-almond/80 leading-relaxed whitespace-pre-wrap">
                    {faq.answer_kh}
                  </p>
                </div>
              </div>
            </CardBody>

            <CardFooter hasBorder={true} className="pt-4 pb-2 border-t border-custom-blue/10 dark:border-white/10 flex items-center justify-between">
              <span className="text-[9px] text-custom-blue/30 dark:text-custom-celadon/30 font-mono font-bold tracking-wider">
                ID: {faq.id}
              </span>
              <span className="text-[9px] text-custom-blue/30 dark:text-custom-celadon/30 font-mono font-bold tracking-wider">
                Created: {new Date(faq.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </CardFooter>
          </Card>
        ))}

        {faqs.length === 0 && (
          <Card roundness="4xl" className="py-24 border border-dashed border-custom-blue/10 dark:border-white/10 flex flex-col items-center justify-center gap-5">
            <div className="h-20 w-20 rounded-full bg-white/50 dark:bg-white/5 flex items-center justify-center shadow-inner">
              <HelpCircle className="h-10 w-10 text-custom-blue/30 dark:text-custom-celadon/30" />
            </div>
            <p className="text-custom-blue/40 dark:text-custom-celadon/50 text-xs font-bold uppercase tracking-widest">No FAQs saved yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
