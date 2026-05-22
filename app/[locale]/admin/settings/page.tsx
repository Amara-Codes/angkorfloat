import { auth } from "@/auth";
import ComingSoonPlaceholder from "@/components/admin/common/ComingSoonPlaceholder";

export default async function SettingsPage() {
  const session = await auth();
  
  return (
    <div className="font-josefin">
      <ComingSoonPlaceholder 
        title="Settings" 
        description="The Settings panel is currently under development."
      />
    </div>
  );
}
