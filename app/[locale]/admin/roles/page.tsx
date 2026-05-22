import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { Edit, Shield, Fingerprint } from "lucide-react";
import DeleteRoleButton from "@/components/admin/roles/DeleteRoleButton";
import { hasPermission, protectPage } from "@/lib/rbac";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/common/Card";
import TabHeading from "@/components/admin/common/TabHeading";

export default async function RoleListPage() {
  const session = await auth();
  await protectPage(session, 'role');
  
  const roles = await prisma.role.findMany({
    include: { 
      _count: { select: { permissions: true, users: true } }
    },
    orderBy: { name: "asc" },
  });

  const canDelete = hasPermission(session, 'role', 'delete');
  const canCreate = hasPermission(session, 'role', 'create');
  const canUpdate = hasPermission(session, 'role', 'update');

  return (
    <div className="space-y-8 transition-colors duration-300">
      <TabHeading
        title="User Roles"
        buttonHref="/admin/roles/new"
        buttonLabel="Create Role"
        showButton={canCreate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {roles.map((role) => (
          <Card key={role.id} visualHover={true} roundness="4xl" className="h-full justify-between">
            <CardHeader className="mb-0 pb-4">
              <div className="flex items-start justify-between w-full relative">
                <div className="p-4 bg-custom-celadon/10 rounded-2xl border border-custom-blue/60 dark:border-custom-celadon/20 shadow-inner">
                  <Shield className="h-10 w-10 text-custom-blue/60 dark:text-custom-celadon" />
                </div>
                <div className="flex items-center gap-2 transition-opacity duration-300">
                  {canUpdate && (
                    <Link 
                      href={`/admin/roles/${role.id}/edit` as any}
                      className="p-2.5 text-custom-blue/40 dark:text-custom-celadon/50 hover:text-custom-blue dark:hover:text-custom-celadon hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all shadow-sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  )}
                  {canDelete && <DeleteRoleButton id={role.id} name={role.name} />}
                </div>
              </div>
            </CardHeader>

            <CardBody className="pt-2 pb-6 flex-1 flex flex-col justify-between">
              <div className="pb-6">
                <h3 className="text-4xl font-kugile text-custom-blue dark:text-custom-celadon leading-tight line-clamp-2 h-24 overflow-hidden flex items-start">
                  {role.name.replace(/_/g, " ")}
                </h3>
              </div>

              <div className="space-y-4 mt-auto">
                <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-4 border border-custom-blue/5 dark:border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-custom-blue/40 dark:text-custom-celadon/50 mb-1">Permissions</p>
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-custom-blue dark:text-custom-celadon" />
                    <span className="text-2xl font-josefin font-bold text-custom-blue dark:text-custom-celadon">{role._count.permissions}</span>
                  </div>
                </div>
                <div className="bg-white/50 dark:bg-white/5 rounded-2xl p-4 border border-custom-blue/5 dark:border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-tighter text-custom-blue/40 dark:text-custom-celadon/50 mb-1">Active Users</p>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-custom-rosewood" />
                    <span className="text-2xl font-josefin font-bold text-custom-blue dark:text-custom-almond">{role._count.users}</span>
                  </div>
                </div>
              </div>
            </CardBody>

            <CardFooter hasBorder={true} className="pt-6 pb-8 border-t border-custom-blue/10 dark:border-white/10">
              <span className="text-[10px] text-custom-blue/30 dark:text-custom-celadon/30 font-mono font-bold tracking-wider">ROLE ID: {role.id}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
