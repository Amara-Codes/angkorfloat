import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { Link } from "@/i18n/routing";
import { Edit, User, Mail, Shield } from "lucide-react";
import DeleteUserButton from "@/components/admin/users/DeleteUserButton";
import { hasPermission, protectPage } from "@/lib/rbac";
import { Card, CardHeader, CardBody, CardFooter } from "@/components/common/Card";
import TabHeading from "@/components/admin/common/TabHeading";

export default async function UserListPage() {
  const session = await auth();
  await protectPage(session, "user");

  const canCreate = hasPermission(session, "user", "create");
  const canUpdate = hasPermission(session, "user", "update");
  const canDelete = hasPermission(session, "user", "delete");

  const users = await prisma.user.findMany({
    include: {
      roles: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-10">
      <TabHeading
        title="System Users"
        subtitle="Manage platform administrators and access control list"
        buttonHref="/admin/users/new"
        buttonLabel="Add User"
        showButton={canCreate}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {users.map((user) => (
          <Card key={user.id} visualHover={true} roundness="4xl">
            <CardHeader className="mb-0 pb-0">
              <div className="flex items-start justify-between w-full relative">
                <div className="h-48 w-48 mt-8 mx-auto rounded-full bg-white/50 dark:bg-white/5 border-[3px] border-white dark:border-custom-celadon/20 shadow-md overflow-hidden flex items-center justify-center shrink-0">
                  {(user as any).imageUrl ? (
                    <img src={(user as any).imageUrl} alt={user.name || ""} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (user as any).image ? (
                    <img src={`data:image/jpeg;base64,${Buffer.from((user as any).image as any).toString('base64')}`} alt={user.name || ""} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-linear-to-br from-custom-celadon/20 via-custom-blue/5 to-custom-rosewood/10 flex items-center justify-center">
                      <User className="h-10 w-10 opacity-30" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300 absolute top-0 right-0">
                  {canUpdate && (
                    <Link
                      href={`/admin/users/${user.id}/edit` as any}
                      className="p-2.5 text-custom-blue/40 dark:text-custom-celadon/50 hover:text-custom-blue dark:hover:text-custom-celadon hover:bg-white dark:hover:bg-white/10 rounded-xl transition-all shadow-sm"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                  )}
                  {canDelete && <DeleteUserButton id={user.id} email={user.email} />}
                </div>
              </div>
            </CardHeader>

            <CardBody className="pt-6 pb-6 space-y-5">
              <div>
                <h3 className="text-3xl font-kugile text-custom-blue dark:text-custom-celadon leading-tight truncate">
                  {user.name} {(user as any).surname}
                </h3>
                <div className="flex items-center gap-2 text-[10px] text-custom-blue/40 dark:text-custom-celadon/50 font-bold uppercase tracking-widest mt-1.5 truncate">
                  <Mail className="h-3 w-3 shrink-0" />
                  {user.email}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {user.roles.map((role: any) => (
                  <div key={role.id} className="px-3 py-1.5 rounded-xl bg-custom-celadon/10 dark:bg-custom-celadon/10 text-custom-blue/60 dark:text-custom-celadon flex items-center gap-2 border border-custom-celadon/20 shadow-sm">
                    <Shield className="h-3 w-3 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{role.name.replace(/_/g, " ")}</span>
                  </div>
                ))}
              </div>
            </CardBody>

            <CardFooter hasBorder={true} className="pt-6 pb-8 border-t border-custom-blue/10 dark:border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-custom-blue/30 dark:text-custom-celadon/30 font-mono font-bold tracking-wider">ID: {user.id.substring(0, 8)}</span>
              <span className="text-[10px] text-custom-blue/30 dark:text-custom-celadon/30 font-bold uppercase">Created {new Date(user.createdAt).toLocaleDateString()}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
