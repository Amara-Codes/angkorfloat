import RoleForm from "@/components/admin/roles/RoleForm";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditRolePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [role, permissions] = await Promise.all([
    prisma.role.findUnique({
      where: { id },
      include: { permissions: true }
    }),
    prisma.permission.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  if (!role) notFound();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-6xl font-kugile text-custom-blue dark:text-custom-celadon mb-10">Configure Role</h2>
      <RoleForm role={role} allPermissions={permissions} />
    </div>
  );
}
