"use client";

import { Bell, LogOut, User, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/common/Button";
import DarkModeToggle from "@/components/layout/DarkModeToggle";

export default function AdminHeader({ session, dbSource }: { session: any; dbSource?: string }) {
  return (
    <header className="h-20 border-b border-custom-blue/5 dark:border-white/5 bg-custom-coconut/50 dark:bg-custom-blue/50 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-10 transition-colors duration-300">


      <div className="flex w-full justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 rounded-xl bg-custom-celadon dark:bg-custom-blue flex items-center justify-center text-custom-blue dark:text-custom-celadon border border-custom-blue/40 dark:border-custom-celadon/40">
            <User className="h-5 w-5" />
          </div>
          <div className="text-left hidden sm:flex flex-col justify-center self-stretch gap-1">
            <div className="flex items-center">
              <p className="text-2xl font-kugile text-custom-blue dark:text-custom-celadon leading-none">{session.user.name}</p>

            </div>
            
            <div className="flex flex-wrap gap-1">
              {session.user.roles?.map((role: string) => (
                <span key={role} className="px-2 py-1 rounded-md bg-custom-blue/5 dark:bg-custom-celadon/10 text-custom-blue/70 dark:text-custom-celadon flex items-center gap-1 border border-custom-blue/10 dark:border-custom-celadon/20 shadow-xs">
                  <Shield className="h-2.5 w-2.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest leading-none">{role.replace(/_/g, " ")}</span>
                </span>
              ))}
            </div>
          </div>
        </div>


        {/* Glowing Database Status Badge */}
        {process.env.NODE_ENV === 'development' && dbSource && (
          <div className="hidden md:flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/40 dark:bg-custom-blue/30 border border-custom-blue/10 dark:border-white/10 shadow-sm backdrop-blur-md transition-all duration-300">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dbSource === "Cloudflare D1" ? "bg-emerald-400 dark:bg-emerald-500" : "bg-amber-400 dark:bg-amber-500"}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${dbSource === "Cloudflare D1" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
            </span>
            <span className="text-xs font-semibold tracking-wide text-custom-blue/80 dark:text-custom-almond/80">
              Database: <span className={dbSource === "Cloudflare D1" ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-amber-600 dark:text-amber-400 font-bold"}>{dbSource}</span>
            </span>
          </div>
        )}


        <div className="flex items-center gap-3">
          <div className="h-8 w-px bg-custom-blue/20 dark:bg-white/20 mx-2"></div>
          <DarkModeToggle />
          <button className="p-2 text-custom-blue/60 dark:text-custom-celadon/60 hover:text-custom-blue dark:hover:text-custom-celadon transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-custom-rosewood rounded-full"></span>
          </button>
          <Button
            variant="rosewood"
            size="sm"
            roundness="lg"
            onClick={() => signOut({ callbackUrl: "/" })}
            icon={<LogOut className="h-4 w-4" />}
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
