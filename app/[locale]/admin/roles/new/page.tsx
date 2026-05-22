import RoleForm from "@/components/admin/roles/RoleForm";
import prisma from "@/lib/prisma";

export default async function NewRolePage() {
  const permissions = await prisma.permission.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-6xl font-kugile text-custom-blue dark:text-custom-celadon mb-10">Define New Role</h2>
      <RoleForm allPermissions={permissions} />
    </div>
  );
}
