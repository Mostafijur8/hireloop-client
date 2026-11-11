"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bookmark,
  BriefcaseBusiness,
  Building2,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { authClient, useSession } from "@/lib/auth-client";
import { useToast } from "@/components/toast-provider";

type UserRole = "admin" | "recruiter" | "seeker";

type MenuItem = {
  label: string;
  icon: LucideIcon;
  href?: string;
};

// প্রতিটি role-এর জন্য profile card, sidebar menu এবং নিচের action label নির্ধারণ করে।
// প্রতিটি user role-এর sidebar title, menu item ও primary action নির্ধারণ করে।
const dashboardByRole: Record<
  UserRole,
  { title: string; subtitle: string; url: string; icon: LucideIcon; items: MenuItem[]; action: string }
> = {
  seeker: {
    title: "Seeker Portal",
    subtitle: "Seeker account",
    url: "/dashboard/seeker",
    icon: UserRound,
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/seeker" },
      { label: "Jobs", icon: BriefcaseBusiness },
      { label: "Saved Jobs", icon: Bookmark },
      { label: "Applications", icon: FileText },
      { label: "Billing", icon: CreditCard },
      { label: "Settings", icon: Settings },
    ],
    action: "Post Resume",
  },
  recruiter: {
    title: "Recruiter Portal",
    subtitle: "Recruiter account",
    url: "/dashboard/recruiter",
    icon: BriefcaseBusiness,
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/recruiter" },
      { label: "Manage Jobs", icon: BriefcaseBusiness, href: "/dashboard/recruiter/jobs" },
      { label: "Add Jobs", icon: BriefcaseBusiness, href: "/dashboard/recruiter/jobs/new" },
      { label: "Applications", icon: FileText },
      { label: "Settings", icon: Settings },
    ],
    action: "Post a Job",
  },
  admin: {
    title: "Admin Portal",
    subtitle: "Administrator account",
    url: "/dashboard/admin",
    icon: ShieldCheck,
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard/admin" },
      { label: "People", icon: Users },
      { label: "Jobs", icon: BriefcaseBusiness },
      { label: "Organizations", icon: Building2 },
      { label: "Settings", icon: Settings },
    ],
    action: "Invite Member",
  },
};

// Session থেকে পাওয়া role অনুমোদিত role কি না যাচাই করে।
function isUserRole(role: unknown): role is UserRole {
  return role === "admin" || role === "recruiter" || role === "seeker";
}

// Session role দেখে active navigation, profile এবং sign-out action দেখায়।
export function AppSidebar() {
  const { toast } = useToast();
  // লগইন করা user, বর্তমান route এবং sign-out-এর পর redirect করার router নেয়।
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const role = isUserRole(session?.user?.role) ? session.user.role : "seeker";
  const workspace = dashboardByRole[role];
  const activeHref = workspace.items
    .map((item) => item.href)
    .filter(
      (href): href is string =>
        Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`)),
    )
    .sort((a, b) => b.length - a.length)[0];

  // Better Auth session বন্ধ করে sign-in page-এ পাঠায়।
  async function handleSignOut() {
    try {
      const { error } = await authClient.signOut();
      if (error) {
        toast(error.message ?? "Could not sign out.", "error");
        return;
      }
      toast("Signed out successfully.", "success");
      router.replace("/sign-in");
    } catch {
      toast("Could not sign out. Please try again.", "error");
    }
  }

  return (
    <Sidebar
      style={
        {
          "--sidebar": "#08080a",
          "--sidebar-foreground": "#e4e4e7",
          "--sidebar-accent": "#222226",
          "--sidebar-accent-foreground": "#ffffff",
          "--sidebar-border": "rgba(255,255,255,0.08)",
        } as React.CSSProperties
      }
      className="border-r border-white/[0.08] bg-[#08080a] text-zinc-200 [&_[data-sidebar=menu-button]]:text-zinc-400 [&_[data-sidebar=menu-button]:hover]:bg-white/[0.06] [&_[data-sidebar=menu-button]:hover]:text-white"
    >
      {/* HireLoop wordmark এবং role অনুযায়ী user পরিচিতির card। */}
      <SidebarHeader className="px-4 pb-4 pt-5">
        <div className="px-1 text-[21px] font-extrabold leading-none tracking-[-0.07em]">
          <span className="text-sky-400">hire</span>
          <span className="text-cyan-300">l</span>
          <span className="text-orange-500">oop</span>
        </div>

        <div className="mt-4 flex min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#111114] px-2.5 py-2.5">
          <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-200 to-amber-700 text-xs font-semibold text-[#17120b]">
            {session?.user?.name?.trim().charAt(0).toUpperCase() || <UserRound className="size-4" />}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold leading-4 text-zinc-100">
              {role === "seeker" ? workspace.title : session?.user?.name || workspace.title}
            </p>
            <p className="truncate text-[10px] leading-4 text-zinc-500">{workspace.subtitle}</p>
          </div>
        </div>
        
      </SidebarHeader>

      {/* Role-এর menu item দেখায়; href না থাকা item এখন disabled। */}
      <SidebarContent className="px-2 py-0">
        <SidebarGroup className="p-0">
          <SidebarMenu className="gap-0.5">
            {workspace.items.map((item) => {
              const Icon = item.icon;
              const active = item.href === activeHref;

              return (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    render={item.href ? <Link href={item.href} /> : undefined}
                    disabled={!item.href}
                    isActive={active}
                    tooltip={item.label}
                    className={`relative h-[30px] rounded-md px-2 text-[11px] [&_svg]:size-4 ${
                      active
                        ? "bg-[#222226]! font-medium! text-zinc-100! before:absolute before:bottom-1 before:left-0 before:top-1 before:w-[2px] before:rounded-r before:bg-violet-500"
                        : "disabled:opacity-55"
                    }`}
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Sidebar-এর নিচে role-specific primary action এবং sign-out button। */}
      <SidebarFooter className="mt-auto gap-1 px-2 pb-3 pt-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={role === "recruiter" ? <Link href="/dashboard/recruiter/jobs/new" /> : undefined}
              disabled={role !== "recruiter"}
              title={role === "recruiter" ? workspace.action : `${workspace.action} will be available soon`}
              className="h-[30px] justify-center rounded-md bg-white text-[11px] font-semibold text-[#111]! opacity-100! hover:bg-zinc-200! hover:text-[#111]! disabled:opacity-100"
            >
              <span>{workspace.action}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              className="h-[30px] rounded-md px-2 text-[11px] text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
