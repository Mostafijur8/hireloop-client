import { Bookmark, BriefcaseBusiness, Building2, CreditCard, FileText, LayoutDashboard, Settings, ShieldCheck, Users, UserRound, type LucideIcon } from "lucide-react";

/** Sidebar destinations and labels for each supported account role. */
export type UserRole = "admin" | "recruiter" | "seeker";
export type MenuItem = { label: string; icon: LucideIcon; href?: string };
export const dashboardByRole: Record<UserRole, { title: string; subtitle: string; url: string; icon: LucideIcon; items: MenuItem[]; action: string }> = {
  seeker: { title: "Seeker Portal", subtitle: "Seeker account", url: "/dashboard/seeker", icon: UserRound, action: "Post Resume", items: [{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/seeker" }, { label: "Jobs", icon: BriefcaseBusiness }, { label: "Saved Jobs", icon: Bookmark }, { label: "Applications", icon: FileText }, { label: "Billing", icon: CreditCard }, { label: "Settings", icon: Settings }] },
  recruiter: { title: "Recruiter Portal", subtitle: "Recruiter account", url: "/dashboard/recruiter", icon: BriefcaseBusiness, action: "Post a Job", items: [{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/recruiter" }, { label: "Manage Jobs", icon: BriefcaseBusiness, href: "/dashboard/recruiter/jobs" }, { label: "Add Jobs", icon: BriefcaseBusiness, href: "/dashboard/recruiter/jobs/new" }, { label: "Applications", icon: FileText }, { label: "Settings", icon: Settings }] },
  admin: { title: "Admin Portal", subtitle: "Administrator account", url: "/dashboard/admin", icon: ShieldCheck, action: "Invite Member", items: [{ label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/admin" }, { label: "People", icon: Users }, { label: "Jobs", icon: BriefcaseBusiness }, { label: "Organizations", icon: Building2 }, { label: "Settings", icon: Settings }] },
};

/** Narrows session data to a known sidebar role. */
export function isUserRole(role: unknown): role is UserRole {
  return role === "admin" || role === "recruiter" || role === "seeker";
}
