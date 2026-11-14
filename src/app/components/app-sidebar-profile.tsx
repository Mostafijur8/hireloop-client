import { UserRound } from "lucide-react";
import { SidebarHeader } from "@/components/ui/sidebar";
import type { UserRole } from "./app-sidebar-config";

/** Shows the product mark and the current account identity. */
export function AppSidebarProfile({ role, name, title, subtitle }: { role: UserRole; name?: string; title: string; subtitle: string }) {
  return (
    <SidebarHeader className="px-4 pb-4 pt-5">
      <div className="px-1 text-[21px] font-extrabold leading-none tracking-[-0.07em]"><span className="text-sky-400">hire</span><span className="text-cyan-300">l</span><span className="text-orange-500">oop</span></div>
      <div className="mt-4 flex min-w-0 items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#111114] px-2.5 py-2.5">
        <div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-200 to-amber-700 text-xs font-semibold text-[#17120b]">{name?.trim().charAt(0).toUpperCase() || <UserRound className="size-4" />}</div>
        <div className="min-w-0 flex-1"><p className="truncate text-[11px] font-semibold leading-4 text-zinc-100">{role === "seeker" ? title : name || title}</p><p className="truncate text-[10px] leading-4 text-zinc-500">{subtitle}</p></div>
      </div>
    </SidebarHeader>
  );
}
