import UserForm from "@/components/admin/users/UserForm";
import prisma from "@/lib/prisma";

export default async function NewUserPage() {
  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-6xl font-kugile text-custom-blue dark:text-custom-celadon mb-10">New Authorized User</h2>
      <UserForm roles={roles} />
    </div>
  );
}
