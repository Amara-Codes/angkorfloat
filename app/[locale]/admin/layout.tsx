import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar"
import AdminHeader from "@/components/admin/AdminHeader";
import { Metadata } from "next";
import { getDatabaseSource } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Angkor Float - Admin Panel",
  description: "Angkor Float - Admin Panel - Floating in Siem Reap | Float Therapy for body and mind",
  icons: {
    icon: [
      {
        url: "/images/icon-admin.png",
      }
    ],
  },
};


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const dbSource = getDatabaseSource();

  return (
    <div className="flex h-[100dvh] bg-custom-celadon dark:bg-custom-green text-custom-blue dark:text-custom-almond transition-colors duration-300 overflow-hidden">
      <AdminSidebar session={session} />
      <div className="flex-1 flex flex-col relative">
        {/* Complex Background Layers */}
        <div className="absolute inset-0 z-0 bg-linear-to-bl from-custom-celadon/40 via-custom-green/20 to-custom-rosewood/20 dark:from-custom-rosewood/40 dark:via-custom-green/40 dark:to-custom-blue/40" />
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--color-custom-green),transparent_60%),transparent)] dark:bg-[radial-gradient(circle_at_50%_0%,color-mix(in_srgb,var(--color-custom-blue),transparent_70%),transparent)]" />
        
        <AdminHeader session={session} dbSource={dbSource} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
