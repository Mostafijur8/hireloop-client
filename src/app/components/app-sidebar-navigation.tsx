import Link from "next/link";
import { SidebarContent, SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import type { MenuItem } from "./app-sidebar-config";

/** Renders role-appropriate links and marks the current route as active. */
export function AppSidebarNavigation({ items, activeHref }: { items: MenuItem[]; activeHref?: string }) {
  return (
    <SidebarContent className="px-2 py-0"><SidebarGroup className="p-0"><SidebarMenu className="gap-0.5">
      {items.map((item) => { const Icon = item.icon; const active = item.href === activeHref; return <SidebarMenuItem key={item.label}><SidebarMenuButton render={item.href ? <Link href={item.href} /> : undefined} disabled={!item.href} isActive={active} tooltip={item.label} className={`relative h-[30px] rounded-md px-2 text-[11px] [&_svg]:size-4 ${active ? "bg-[#222226]! font-medium! text-zinc-100! before:absolute before:bottom-1 before:left-0 before:top-1 before:w-[2px] before:rounded-r before:bg-violet-500" : "disabled:opacity-55"}`}><Icon /><span>{item.label}</span></SidebarMenuButton></SidebarMenuItem>; })}
    </SidebarMenu></SidebarGroup></SidebarContent>
  );
}
