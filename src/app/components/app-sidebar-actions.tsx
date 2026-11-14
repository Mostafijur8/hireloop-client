import Link from "next/link";
import { LogOut } from "lucide-react";
import { SidebarFooter, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { UserRole } from "./app-sidebar-config";

/** Provides the role's primary action and the shared sign-out button. */
export function AppSidebarActions({ role, action, onSignOut }: { role: UserRole; action: string; onSignOut: () => void }) {
  return (
    <SidebarFooter className="mt-auto gap-1 px-2 pb-3 pt-2"><SidebarMenu>
      <SidebarMenuItem><SidebarMenuButton render={role === "recruiter" ? <Link href="/dashboard/recruiter/jobs/new" /> : undefined} disabled={role !== "recruiter"} title={role === "recruiter" ? action : `${action} will be available soon`} className="h-[30px] justify-center rounded-md bg-white text-[11px] font-semibold text-[#111]! opacity-100! hover:bg-zinc-200! hover:text-[#111]! disabled:opacity-100"><span>{action}</span></SidebarMenuButton></SidebarMenuItem>
      <SidebarMenuItem><SidebarMenuButton onClick={onSignOut} className="h-[30px] rounded-md px-2 text-[11px] text-zinc-500 hover:bg-white/[0.06] hover:text-zinc-200"><LogOut className="size-4" /><span>Logout</span></SidebarMenuButton></SidebarMenuItem>
    </SidebarMenu></SidebarFooter>
  );
}
