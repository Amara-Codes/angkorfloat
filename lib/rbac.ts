import { Session } from "next-auth";

export type Action = 'create' | 'read' | 'update' | 'delete' | 'publish';
export type Resource = 'blog' | 'therapist' | 'session' | 'package' | 'user' | 'role' | 'faq' | 'category';

export function hasPermission(session: Session | null, resource: Resource, action: Action): boolean {
  if (!session?.user) return false;
  
  const user = session.user as any;
  const permissions = user.permissions || [];
  const roles = user.roles || [];
  
  if (roles.includes("SUPERADMIN")) return true;
  
  return permissions.includes(`${resource}:${action}`);
}

export function hasAnyPermission(session: Session | null, checks: { resource: Resource, action: Action }[]): boolean {
  if (!session?.user) return false;
  
  const user = session.user as any;
  const permissions = user.permissions || [];
  const roles = user.roles || [];
  
  if (roles.includes("SUPERADMIN")) return true;
  
  return checks.some(check => permissions.includes(`${check.resource}:${check.action}`));
}

import { redirect } from "next/navigation";

export function canAccessResource(session: Session | null, resource: Resource): boolean {
  if (!session?.user) return false;
  
  const user = session.user as any;
  const permissions = user.permissions || [];
  const roles = user.roles || [];
  
  if (roles.includes("SUPERADMIN")) return true;
  
  // If user has ANY permission for the resource, they can access it (usually 'read')
  return permissions.some((p: string) => p.startsWith(`${resource}:`));
}

/**
 * Server-side protection for pages.
 * Redirects to /admin if the user doesn't have access to the resource.
 */
export async function protectPage(session: Session | null, resource: Resource) {
  if (!session) redirect("/login");
  if (!canAccessResource(session, resource)) {
    redirect("/admin");
  }
}
