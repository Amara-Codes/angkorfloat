import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { Edit, Wind, Calendar, Layers, DollarSign } from "lucide-react";
import DeletePackageButton from "@/components/admin/float/DeletePackageButton";
import { hasPermission, protectPage } from "@/lib/rbac";
import TabHeading from "@/components/admin/common/TabHeading";
import ComingSoonPlaceholder from "@/components/admin/common/ComingSoonPlaceholder";

export default async function FloatPackageListPage() {
  const session = await auth();
  await protectPage(session, 'package');
  
  /*
  const packages = await prisma.floatPackage.findMany({
    orderBy: { price: "asc" },
  });

  const canCreate = hasPermission(session, 'package', 'create');
  const canUpdate = hasPermission(session, 'package', 'update');
  const canDelete = hasPermission(session, 'package', 'delete');
  */

  return (
    <div className="space-y-8 font-josefin transition-colors duration-300">
      <ComingSoonPlaceholder 
        title="Float Packages" 
        description="The float packages sessions management panel is currently under development."
      />
    {/*
      <TabHeading
        title="Float Packages"
        subtitle="Manage your membership plans and float bundles."
        buttonHref="/admin/float-packages/new"
        buttonLabel="New Package"
        showButton={canCreate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((item) => (
          <div key={item.id} className="bg-white/50 dark:bg-custom-blue border border-custom-blue/5 dark:border-white/5 rounded-3xl p-8 hover:shadow-xl transition-all group relative overflow-hidden flex flex-col">
            <div className="flex items-start justify-between mb-8">
              <div className="h-16 w-16 rounded-2xl bg-custom-blue/5 dark:bg-white/5 flex items-center justify-center text-custom-blue/30 dark:text-custom-celadon/30">
                <Wind className="h-8 w-8" />
              </div>
              <div className="flex items-center gap-2">
                {canUpdate && (
                  <Link 
                    href={`/admin/float-packages/${item.id}/edit` as any}
                    className="p-2 text-custom-blue/40 dark:text-custom-celadon/50 hover:text-custom-blue dark:hover:text-custom-celadon hover:bg-custom-blue/5 dark:hover:bg-white/10 rounded-xl transition-all"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                )}
                {canDelete && <DeletePackageButton id={item.id} />}
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-kugile text-custom-blue dark:text-custom-celadon">${item.price}</span>
                <span className="text-[10px] font-bold text-custom-blue/30 dark:text-custom-celadon/30 uppercase tracking-widest">/ package</span>
              </div>
              <h3 className="text-xl font-kugile text-custom-blue dark:text-custom-celadon">{item.name}</h3>
              <p className="text-sm text-custom-blue/60 dark:text-custom-celadon/60 line-clamp-2 leading-relaxed">{item.description}</p>
            </div>

            <div className="mt-8 pt-8 border-t border-custom-blue/5 dark:border-white/5 grid grid-cols-2 gap-4">
               <div className="bg-custom-blue/5 dark:bg-white/5 p-4 rounded-2xl border border-custom-blue/5 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="h-3 w-3 text-custom-blue/30 dark:text-custom-celadon/30" />
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-custom-blue/40 dark:text-custom-celadon/40">Sessions</span>
                  </div>
                  <p className="text-lg font-kugile text-custom-blue dark:text-custom-almond">{item.sessionCount}</p>
               </div>
               <div className="bg-custom-blue/5 dark:bg-white/5 p-4 rounded-2xl border border-custom-blue/5 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-3 w-3 text-custom-blue/30 dark:text-custom-celadon/30" />
                    <span className="text-[8px] font-bold uppercase tracking-tighter text-custom-blue/40 dark:text-custom-celadon/40">Validity</span>
                  </div>
                  <p className="text-lg font-kugile text-custom-blue dark:text-custom-almond">{item.validityDays} <span className="text-[10px]">days</span></p>
               </div>
            </div>
          </div>
        ))}
        {packages.length === 0 && (
          <div className="col-span-full py-24 bg-white/30 dark:bg-custom-blue/30 border border-dashed border-custom-blue/10 dark:border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 transition-colors">
             <div className="h-16 w-16 rounded-full bg-custom-blue/5 dark:bg-white/5 flex items-center justify-center">
               <Wind className="h-8 w-8 text-custom-blue/20 dark:text-custom-celadon/20" />
             </div>
             <p className="text-custom-blue/40 dark:text-custom-celadon/50 text-sm font-bold uppercase tracking-widest">No float packages defined yet.</p>
          </div>
        )}
      </div>
      */}
    </div>
  );
}
