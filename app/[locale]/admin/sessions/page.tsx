import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { Edit, Clock, Tag, Sparkles } from "lucide-react";
import DeleteSessionButton from "@/components/admin/sessions/DeleteSessionButton";
import { hasPermission, protectPage } from "@/lib/rbac";
import TabHeading from "@/components/admin/common/TabHeading";
import ComingSoonPlaceholder from "@/components/admin/common/ComingSoonPlaceholder";

export default async function SessionListPage() {
  const session = await auth();
  await protectPage(session, 'session');
  
  /*
  const healingSessions = await prisma.healingSession.findMany({
    include: { therapist: true },
    orderBy: { createdAt: "desc" },
  });

  const canCreate = hasPermission(session, 'session', 'create');
  const canUpdate = hasPermission(session, 'session', 'update');
  const canDelete = hasPermission(session, 'session', 'delete');
  */

  return (
    <div className="space-y-8 font-josefin transition-colors duration-300">
      <ComingSoonPlaceholder 
        title="Healing Sessions" 
        description="The healing sessions management panel is currently under development."
      />
    {/*
      <TabHeading
        title="Healing Sessions"
        buttonHref="/admin/sessions/new"
        buttonLabel="New Session"
        showButton={canCreate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {healingSessions.map((item) => (
          <div key={item.id} className="bg-white/50 dark:bg-custom-blue border border-custom-blue/5 dark:border-white/5 rounded-3xl p-6 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <div className="h-14 w-14 rounded-2xl bg-custom-blue/5 dark:bg-white/5 flex items-center justify-center text-custom-blue/30 dark:text-custom-celadon/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                {canUpdate && (
                  <Link 
                    href={`/admin/sessions/${item.id}/edit` as any}
                    className="p-2 text-custom-blue/40 dark:text-custom-celadon/50 hover:text-custom-blue dark:hover:text-custom-celadon hover:bg-custom-blue/5 dark:hover:bg-white/10 rounded-xl transition-all"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                )}
                {canDelete && <DeleteSessionButton id={item.id} />}
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <h3 className="text-xl font-kugile text-custom-blue dark:text-custom-celadon line-clamp-1">{item.name}</h3>
              <p className="text-sm text-custom-blue/60 dark:text-custom-celadon/60 line-clamp-2">{item.description}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-custom-blue/5 dark:border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-custom-blue/30 dark:text-custom-celadon/30" />
                  <span className="text-xs font-bold text-custom-blue/50 dark:text-custom-celadon/50">{item.duration} mins</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-emerald-500/50" />
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">${item.price}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-custom-blue/5 dark:bg-white/5 rounded-2xl border border-custom-blue/5 dark:border-white/5">
                <div className="h-8 w-8 rounded-full bg-custom-blue/10 dark:bg-custom-celadon/10 overflow-hidden flex items-center justify-center">
                  {item.therapist.imageUrl ? (
                    <img src={item.therapist.imageUrl} alt={item.therapist.name} className="h-full w-full object-cover" />
                  ) : item.therapist.image ? (
                    <img src={`data:image/jpeg;base64,${Buffer.from(item.therapist.image as any).toString('base64')}`} alt={item.therapist.name} className="h-full w-full object-cover" />
                  ) : (
                    <span className="text-[10px] font-bold text-custom-blue/40 dark:text-custom-celadon/40">{item.therapist.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                   <p className="text-[10px] text-custom-blue/30 dark:text-custom-celadon/30 font-bold uppercase tracking-widest leading-none mb-1">Therapist</p>
                   <p className="text-xs font-bold text-custom-blue dark:text-custom-almond">{item.therapist.name}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        {healingSessions.length === 0 && (
          <div className="col-span-full py-24 bg-white/30 dark:bg-custom-blue/30 border border-dashed border-custom-blue/10 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 transition-colors">
             <div className="h-16 w-16 rounded-full bg-custom-blue/5 dark:bg-white/5 flex items-center justify-center">
               <Sparkles className="h-8 w-8 text-custom-blue/20 dark:text-custom-celadon/20" />
             </div>
             <p className="text-custom-blue/40 dark:text-custom-celadon/50 text-sm font-bold uppercase tracking-widest">No sessions defined yet.</p>
          </div>
        )}
      </div>
      */}
    </div>
  );
}
