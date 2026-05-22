"use client";

import { Link, usePathname } from "@/i18n/routing";
import { 
  Tent, 
  Feather, 
  Users, 
  Settings, 
  RollerCoaster,
  Shield,
  UserCog,
  Webhook,
  HelpCircle,
  Tag
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import DynamicLogo from "@/components/layout/DynamicLogo";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { canAccessResource, Resource } from "@/lib/rbac";

const menuItems: { name: string; href: string; icon: any; resource?: Resource }[] = [
  { name: "Dashboard", href: "/admin", icon: Tent },
  { name: "Blog Posts", href: "/admin/blog", icon: Feather, resource: 'blog' },
  { name: "Post Categories", href: "/admin/categories", icon: Tag, resource: 'category' },
  { name: "FAQs", href: "/admin/faq", icon: HelpCircle, resource: 'faq' },
  { name: "Therapists", href: "/admin/therapists", icon: Users, resource: 'therapist' },
  { name: "Healing Sessions", href: "/admin/sessions", icon: Webhook, resource: 'session' },
  { name: "Float Packages", href: "/admin/float-packages", icon: RollerCoaster, resource: 'package' },
  { name: "Users", href: "/admin/users", icon: UserCog, resource: 'user' },
  { name: "User Roles", href: "/admin/roles", icon: Shield, resource: 'role' },
  { name: "Settings", href: "/admin/settings", icon: Settings, resource: 'user' },
];

export default function AdminSidebar({ session }: { session: any }) {
  const pathname = usePathname();

  const filteredMenuItems = menuItems.filter(item => 
    !item.resource || canAccessResource(session, item.resource)
  );

  return (
    <aside className="w-72 border-r border-custom-blue/5 dark:border-white/5 flex-col hidden lg:flex bg-custom-celadon/50 dark:bg-custom-blue transition-colors duration-300">
      <div className="p-8 border-b border-custom-blue/5 dark:border-white/5 flex items-center gap-3">
        <DynamicLogo className="text-custom-blue dark:text-custom-celadon"/>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {filteredMenuItems.map((item) => {
          // Dashboard is active only on exact match to avoid highlighting it for every admin page
          const isActive = item.href === "/admin" 
            ? pathname === "/admin" 
            : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href as any}
              className={cn(
                "flex items-center justify-between px-4 py-4 rounded-xl transition-all group",
                isActive 
                  ? "bg-custom-blue/20 dark:bg-custom-celadon/20 text-custom-blue dark:text-custom-celadon" 
                  : "text-custom-blue/80 dark:text-custom-celadon hover:text-custom-blue dark:hover:text-custom-celadon hover:bg-custom-blue/5 dark:hover:bg-custom-celadon/5"
              )}
            >
              <div className="flex items-center gap-4">
                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-custom-blue dark:text-custom-celadon" : "text-custom-blue/80 dark:text-custom-celadon group-hover:text-custom-blue dark:group-hover:text-custom-celadon")} />
                <span className="font-josefin font-extrabold uppercase tracking-tighter text-xl leading-none">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-custom-blue/5 dark:border-white/5 space-y-4 hidden">
        <div className="bg-custom-blue/5 dark:bg-white/5 border border-custom-blue/5 dark:border-white/5 rounded-2xl p-4">
          <p className="text-[10px] text-custom-blue/40 dark:text-custom-celadon/50 uppercase tracking-widest mb-1">Logged in as</p>
          <p className="text-sm font-bold truncate text-custom-blue dark:text-custom-celadon">{session.user.name || session.user.email}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {((session.user as any).roles || []).map((role: string) => (
              <span key={role} className="px-1.5 py-0.5 rounded bg-custom-rosewood/10 dark:bg-custom-rosewood/20 text-custom-rosewood text-[8px] font-bold uppercase tracking-tighter">
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
