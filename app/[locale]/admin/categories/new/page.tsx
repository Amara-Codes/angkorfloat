import CategoryForm from "@/components/admin/category/CategoryForm";
import { auth } from "@/auth";
import { hasPermission, protectPage } from "@/lib/rbac";
import { redirect } from "next/navigation";

export default async function NewCategoryPage() {
  const session = await auth();
  await protectPage(session, 'category');
  
  if (!hasPermission(session, 'category', 'create')) {
    redirect('/admin/categories');
  }

  return (
    <CategoryForm />
  );
}
