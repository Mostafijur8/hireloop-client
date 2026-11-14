"use client";

import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/ui/sidebar";
import { authClient, useSession } from "@/lib/auth-client";
import { useToast } from "@/components/toast-provider";
import { AppSidebarActions } from "./app-sidebar-actions";
import { AppSidebarNavigation } from "./app-sidebar-navigation";
import { AppSidebarProfile } from "./app-sidebar-profile";
import { dashboardByRole, isUserRole } from "./app-sidebar-config";

/** Resolves session role and composes profile, menu, and footer controls. */
export function AppSidebar() {
  const { toast } = useToast();
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const role = isUserRole(session?.user?.role) ? session.user.role : "seeker";
  const workspace = dashboardByRole[role];
  const activeHref = workspace.items.map((item) => item.href).filter((href): href is string => Boolean(href) && (pathname === href || pathname.startsWith(`${href}/`))).sort((a, b) => b.length - a.length)[0];

  async function handleSignOut() {
    try {
      const { error } = await authClient.signOut();
      if (error) { toast(error.message ?? "Could not sign out.", "error"); return; }
      toast("Signed out successfully.", "success");
      router.replace("/sign-in");
    } catch { toast("Could not sign out. Please try again.", "error"); }
  }

  return (
    <Sidebar style={{ "--sidebar": "#08080a", "--sidebar-foreground": "#e4e4e7", "--sidebar-accent": "#222226", "--sidebar-accent-foreground": "#ffffff", "--sidebar-border": "rgba(255,255,255,0.08)" } as React.CSSProperties} className="border-r border-white/[0.08] bg-[#08080a] text-zinc-200 [&_[data-sidebar=menu-button]]:text-zinc-400 [&_[data-sidebar=menu-button]:hover]:bg-white/[0.06] [&_[data-sidebar=menu-button]:hover]:text-white">
      <AppSidebarProfile role={role} name={session?.user?.name} title={workspace.title} subtitle={workspace.subtitle} />
      <AppSidebarNavigation items={workspace.items} activeHref={activeHref} />
      <AppSidebarActions role={role} action={workspace.action} onSignOut={handleSignOut} />
    </Sidebar>
  );
}
