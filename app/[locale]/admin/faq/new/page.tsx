import { auth } from "@/auth";
import { protectPage, hasPermission } from "@/lib/rbac";
import FaqForm from "@/components/admin/faq/FaqForm";

export default async function NewFaqPage() {
  const session = await auth();
  await protectPage(session, 'faq');

  const canPublish = hasPermission(session, 'faq', 'publish');

  return (
    <FaqForm canPublish={canPublish} />
  );
}
