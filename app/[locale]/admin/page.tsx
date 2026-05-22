import { auth } from "@/auth";
import {
  Feather,
  Users,
  Calendar,
  TrendingUp,
  Globe,
  UserCog,
  HelpCircle,
  Tags
} from "lucide-react";
import { Link } from "@/i18n/routing";
import prisma from "@/lib/prisma";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Card, CardHeader, CardBody } from "@/components/common/Card";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { hasPermission } from "@/lib/rbac";

export default async function AdminDashboard() {
  const session = await auth();

  // Fetch some stats
  const [postCount, therapistCount, faqCount, categoryCount] = await Promise.all([
    prisma.blogPost.count(),
    prisma.therapist.count(),
    prisma.faq.count(),
    prisma.postCategory.count(),
  ]);

  const ACTIVITY_DAYS = 7;
  const activityStartDate = new Date();
  activityStartDate.setDate(activityStartDate.getDate() - ACTIVITY_DAYS);

  const [
    publishedBlogsWeek,
    createdBlogsWeek,
    addedTherapistsWeek,
    addedUsersWeek,
    createdFaqsWeek,
    addedCategoriesWeek
  ] = await Promise.all([
    prisma.blogPost.count({
      where: {
        published: true,
        updatedAt: { gte: activityStartDate }
      }
    }),
    prisma.blogPost.count({
      where: {
        createdAt: { gte: activityStartDate }
      }
    }),
    prisma.therapist.count({
      where: {
        createdAt: { gte: activityStartDate }
      }
    }),
    prisma.user.count({
      where: {
        createdAt: { gte: activityStartDate }
      }
    }),
    prisma.faq.count({
      where: {
        createdAt: { gte: activityStartDate }
      }
    }),
    prisma.postCategory.count({
      where: {
        createdAt: { gte: activityStartDate }
      }
    })
  ]);

  const canCreateBlog = hasPermission(session, 'blog', 'create');
  const canReadBlog = hasPermission(session, 'blog', 'read');
  const canCreateTherapist = hasPermission(session, 'therapist', 'create');
  const canReadTherapist = hasPermission(session, 'therapist', 'read');
  const canCreateUser = hasPermission(session, 'user', 'create');
  const canReadUser = hasPermission(session, 'user', 'read');
  const canCreateRole = hasPermission(session, 'role', 'create');
  const canReadSessions = hasPermission(session, 'session', 'read');
  const canReadFaqs = hasPermission(session, 'faq', 'read');
  const canCreateFaq = hasPermission(session, 'faq', 'create');
  const canReadCategories = hasPermission(session, 'category', 'read');

  const stats = [
    ...(canReadBlog ? [
      { 
        label: "Blog Posts", 
        value: postCount, 
        icon: Feather,
        iconColor: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
        description: "Published articles" 
      }
    ] : []),
    ...(canReadFaqs ? [
      { 
        label: "FAQs", 
        value: faqCount, 
        icon: HelpCircle,
        iconColor: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10",
        description: "Bilingual Q&As" 
      }
    ] : []),
    ...(canReadTherapist ? [
      { 
        label: "Therapists", 
        value: therapistCount, 
        icon: Users,
        iconColor: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10",
        description: "Active team members" 
      }
    ] : []),
    ...(canReadCategories ? [
      { 
        label: "Categories", 
        value: categoryCount, 
        icon: Tags,
        iconColor: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
        description: "Blog Post Categories" 
      }
    ] : []),
  ];

  const weeklySummary = [
    ...(canReadBlog ? [
      {
        label: "Articles Published",
        value: publishedBlogsWeek,
        description: "Live on website",
        icon: Globe,
        color: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
      }
    ] : []),
    ...(canReadFaqs ? [
      {
        label: "FAQs Created",
        value: createdFaqsWeek,
        description: "New Q&As added",
        icon: HelpCircle,
        color: "text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20"
      }
    ] : []),
    ...(canReadBlog ? [
      {
        label: "Articles Created",
        value: createdBlogsWeek,
        description: "Drafts and posts",
        icon: Feather,
        color: "text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/20"
      }
    ] : []),
    ...(canReadCategories ? [
      {
        label: "Categories Added",
        value: addedCategoriesWeek,
        description: "Blog organization",
        icon: Tags,
        color: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20"
      }
    ] : []),
    ...(canReadTherapist ? [
      {
        label: "Therapists Added",
        value: addedTherapistsWeek,
        description: "Team onboarding",
        icon: Users,
        color: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20"
      }
    ] : []),
    ...(canReadUser ? [
      {
        label: "Users Registered",
        value: addedUsersWeek,
        description: "Admin & team profiles",
        icon: UserCog,
        color: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/20"
      }
    ] : [])
  ];

  return (
    <div className="space-y-10">

      <div className={cn(
        "grid grid-cols-1 md:grid-cols-2 gap-6",
        canReadCategories ? "xl:grid-cols-4" : "xl:grid-cols-3"
      )}>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.label} 
              visualHover={true}
              roundness="4xl"
              className="p-6 justify-between min-h-[170px]"
            >
              <div className="flex items-start justify-between w-full gap-4">
                <div className="space-y-1 text-left min-w-0">
                  <p className="text-[10px] font-black text-custom-blue/40 dark:text-custom-celadon/50 uppercase tracking-[0.2em] truncate">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-kugile font-black text-custom-blue dark:text-custom-celadon tracking-tight leading-none pt-3">
                    {stat.value}
                  </p>
                </div>
                <div className={cn("p-4 rounded-2xl shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-500", stat.iconColor)}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <div className="pt-5 mt-5 border-t border-custom-blue/5 dark:border-custom-coconut/5">
                <span className="text-[10px] text-custom-blue/40 dark:text-custom-celadon/40 font-bold uppercase tracking-wider">
                  {stat.description}
                </span>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card roundness="4xl" className="xl:col-span-2">
          <CardHeader 
            title="Recent Activities" 
            subtitle={`Summary of the last ${ACTIVITY_DAYS} days`}
            hasBorder={true}
          />
          <CardBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {weeklySummary.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-5 p-5 rounded-2xl 
                  bg-custom-coconut/20 dark:bg-custom-blue/20 
                  border border-custom-blue/5 dark:border-custom-coconut/5 
                  hover:bg-custom-coconut/60 dark:hover:bg-custom-blue/40 
                  hover:scale-105 hover:shadow-2xl hover:shadow-custom-blue/50
                  transition-all duration-500 group">
                    <div className={cn("p-3.5 rounded-2xl shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-500", item.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-[10px] font-black text-custom-blue/40 dark:text-custom-celadon/40 uppercase tracking-widest truncate">{item.label}</p>
                      <p className="text-2xl font-kugile font-black text-custom-blue dark:text-custom-celadon mt-1">
                        {item.value > 0 ? `+${item.value}` : item.value}
                      </p>
                      <p className="text-[9px] text-custom-blue/40 dark:text-custom-celadon/30 mt-0.5 truncate">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card roundness="4xl" className="bg-linear-to-bl from-custom-green/30 to-custom-blue/20 dark:from-custom-celadon/15 dark:to-custom-green/20">
          <CardHeader title="Quick Actions" />
          <CardBody className="pt-0">
            <div className="grid grid-cols-1 gap-4">
              {canCreateBlog && (
                <Link 
                  href="/admin/blog/new" 
                  className="w-full text-left p-4 block rounded-xl border border-custom-blue/5 dark:border-custom-coconut/5 bg-custom-coconut/40 dark:bg-custom-blue/40 shadow-xl hover:shadow-2xl hover:scale-105 hover:shadow-custom-blue/50 dark:hover:shadow-custom-celadon/20 transition-all duration-500"
                >
                  <p className="font-bold text-sm text-custom-blue dark:text-custom-celadon">Create Post</p>
                  <p className="text-xs text-custom-blue/60 dark:text-custom-celadon/60 mt-0.5">Write a new article for the blog</p>
                </Link>
              )}
              {canCreateFaq && (
                <Link 
                  href="/admin/faq/new" 
                  className="w-full text-left p-4 block rounded-xl border border-custom-blue/5 dark:border-custom-coconut/5 bg-custom-coconut/40 dark:bg-custom-blue/40 shadow-xl hover:shadow-2xl hover:scale-105 hover:shadow-custom-blue/50 dark:hover:shadow-custom-celadon/20 transition-all duration-500"
                >
                  <p className="font-bold text-sm text-custom-blue dark:text-custom-celadon">Create FAQ</p>
                  <p className="text-xs text-custom-blue/60 dark:text-custom-celadon/60 mt-0.5">Add a new question & answer pair</p>
                </Link>
              )}
              {canCreateTherapist && (
                <Link 
                  href="/admin/therapists/new" 
                  className="w-full text-left p-4 block rounded-xl border border-custom-blue/5 dark:border-custom-coconut/5 bg-custom-coconut/40 dark:bg-custom-blue/40 shadow-xl hover:shadow-2xl hover:scale-105 hover:shadow-custom-blue/50 dark:hover:shadow-custom-celadon/20 transition-all duration-500"
                >
                  <p className="font-bold text-sm text-custom-blue dark:text-custom-celadon">Add Therapist</p>
                  <p className="text-xs text-custom-blue/60 dark:text-custom-celadon/60 mt-0.5">Onboard a new team member</p>
                </Link>
              )}
              {canCreateUser && (
                <Link 
                  href="/admin/users/new" 
                  className="w-full text-left p-4 block rounded-xl border border-custom-blue/5 dark:border-custom-coconut/5 bg-custom-coconut/40 dark:bg-custom-blue/40 shadow-xl hover:shadow-2xl hover:scale-105 hover:shadow-custom-blue/50 dark:hover:shadow-custom-celadon/20 transition-all duration-500"
                >
                  <p className="font-bold text-sm text-custom-blue dark:text-custom-celadon">Add User</p>
                  <p className="text-xs text-custom-blue/60 dark:text-custom-celadon/60 mt-0.5">Authorized admin access</p>
                </Link>
              )}
              {canCreateRole && (
                <Link 
                  href="/admin/roles/new" 
                  className="w-full text-left p-4 block rounded-xl border border-custom-blue/5 dark:border-custom-coconut/5 bg-custom-coconut/40 dark:bg-custom-blue/40 shadow-xl hover:shadow-2xl hover:scale-105 hover:shadow-custom-blue/50 dark:hover:shadow-custom-celadon/20 transition-all duration-500"
                >
                  <p className="font-bold text-sm text-custom-blue dark:text-custom-celadon">Create Role</p>
                  <p className="text-xs text-custom-blue/60 dark:text-custom-celadon/60 mt-0.5">Define new permission sets</p>
                </Link>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
