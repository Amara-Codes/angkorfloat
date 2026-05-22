import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { Edit, Search, UserCheck, UserX, Users } from "lucide-react";
import DeleteTherapistButton from "@/components/admin/therapists/DeleteTherapistButton";
import { hasPermission, protectPage } from "@/lib/rbac";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/common/Card";
import TabHeading from "@/components/admin/common/TabHeading";

export default async function TherapistListPage() {
  const session = await auth();
  await protectPage(session, 'therapist');
  
  const therapists = await prisma.therapist.findMany({
    orderBy: { name: "asc" },
  });

  const canCreate = hasPermission(session, 'therapist', 'create');
  const canUpdate = hasPermission(session, 'therapist', 'update');
  const canDelete = hasPermission(session, 'therapist', 'delete');

  return (
    <div className="space-y-8 transition-colors duration-300">
      <TabHeading
        title="Therapists"
        buttonHref="/admin/therapists/new"
        buttonLabel="Add Therapist"
        showButton={canCreate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {therapists.map((therapist) => (
          <Card key={therapist.id} visualHover={true} roundness="4xl">
            <CardHeader className="mb-0 pb-0">
              <div className="flex items-start justify-between w-full relative">
                <div className="h-48 w-48 mt-8 mx-auto rounded-full bg-white/50 dark:bg-white/5 border-[3px] border-white dark:border-custom-celadon/20 shadow-md overflow-hidden flex items-center justify-center shrink-0">
                  {(therapist as any).imageUrl ? (
                    <img src={(therapist as any).imageUrl} alt={therapist.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : therapist.image ? (
                    <img src={`data:image/jpeg;base64,${Buffer.from(therapist.image as any).toString('base64')}`} alt={therapist.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-custom-celadon/20 via-custom-blue/5 to-custom-rosewood/10 flex items-center justify-center">
                      <Users className="h-10 w-10 opacity-30" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 absolute top-0 right-0">
                  {canUpdate && (
                    <Link 
                      href={`/admin/therapists/${therapist.id}/edit` as any}
                      className="p-2.5 text-custom-blue/40 dark:text-custom-celadon/50 hover:text-custom-blue dark:hover:text-custom-celadon hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all shadow-sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  )}
                  {canDelete && <DeleteTherapistButton id={therapist.id} />}
                </div>
              </div>
            </CardHeader>

            <CardBody className="pt-6 pb-6 space-y-2">
              <h3 className="text-4xl font-kugile text-custom-blue dark:text-custom-celadon leading-tight truncate">{therapist.name}</h3>
              <p className="text-[10px] text-custom-blue/50 dark:text-custom-celadon/60 font-bold uppercase tracking-widest line-clamp-2 min-h-[30px]">{therapist.specialties}</p>
            </CardBody>

            <CardFooter hasBorder={true} className="pt-6 pb-8 border-t border-custom-blue/10 dark:border-white/10 flex items-center justify-between">
              <div className={`px-3 py-1.5 rounded-xl flex items-center gap-2 transition-colors ${
                therapist.isActive 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                  : "bg-custom-rosewood/10 text-custom-rosewood"
              }`}>
                {therapist.isActive ? <UserCheck className="h-3.5 w-3.5" /> : <UserX className="h-3.5 w-3.5" />}
                <span className="text-[10px] font-bold uppercase tracking-widest">{therapist.isActive ? "Active" : "Inactive"}</span>
              </div>
              <span className="text-[10px] text-custom-blue/30 dark:text-custom-celadon/30 font-mono font-bold tracking-wider">ID: {therapist.id.substring(0, 6)}</span>
            </CardFooter>
          </Card>
        ))}
        {therapists.length === 0 && (
          <Card roundness="4xl" className="col-span-full py-24 border border-dashed border-custom-blue/10 dark:border-white/10 flex flex-col items-center justify-center gap-5">
            <div className="h-20 w-20 rounded-full bg-white/50 dark:bg-white/5 flex items-center justify-center shadow-inner">
              <Users className="h-10 w-10 text-custom-blue/30 dark:text-custom-celadon/30" />
            </div>
            <p className="text-custom-blue/40 dark:text-custom-celadon/50 text-xs font-bold uppercase tracking-widest">No therapists onboarded yet.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
