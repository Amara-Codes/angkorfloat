import LoginForm from "@/components/admin/LoginForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Angkor Float - Admin Login",
  icons: {
    icon: [
      {
        url: "/images/icon-admin.png",
      }
    ]
  }
};
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden font-josefin">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
      />
      <div className="absolute inset-0 z-10 bg-custom-coconut/30 dark:bg-custom-blue/50" />

      {/* Login Card Container */}
      <div className="w-full max-w-2xl relative z-20 animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-custom-almond/10 dark:bg-custom-coconut/5 border border-custom-coconut/20 dark:border-custom-coconut/10 rounded-4xl p-2 sm:p-4 shadow-2xl backdrop-blur-sm">
          <div className="rounded-4xl overflow-hidden">
            <LoginForm />
          </div>
        </div>
        
        <p className="mt-8 text-center text-custom-blue/60 dark:text-custom-coconut/60 text-[10px] uppercase tracking-[0.2em] font-bold">
          &copy; {new Date().getFullYear()} Angkor Float &bull; All rights reserved.
        </p>
      </div>
    </div>
  );
}
