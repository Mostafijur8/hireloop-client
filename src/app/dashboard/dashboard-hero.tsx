import { Sparkles } from "lucide-react";
import type { DashboardCopy } from "./dashboard-content";

/** Introduces the current role workspace and its welcome message. */
export function DashboardHero({ content }: { content: DashboardCopy }) {
  const RoleIcon = content.icon;
  return (
    <>
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4"><div><div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-violet-300"><Sparkles className="size-3.5" />{content.eyebrow}</div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{content.dashboardTitle}</h1></div><div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300"><span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />Your workspace</div></header>
      <section className="relative mb-8 overflow-hidden rounded-3xl border border-violet-300/15 bg-gradient-to-br from-[#21143c] via-[#11101d] to-[#0b0b10] p-6 shadow-[0_20px_80px_-40px_rgba(139,92,246,0.45)] sm:p-9">
        <div className="pointer-events-none absolute -right-12 -top-24 size-72 rounded-full border border-violet-300/10 sm:right-12 sm:top-[-9rem] sm:size-[26rem]" /><div className="pointer-events-none absolute -right-2 -top-14 size-52 rounded-full border border-violet-300/10 sm:right-24 sm:top-[-6rem] sm:size-[21rem]" />
        <div className="relative max-w-2xl"><div className="mb-5 flex size-11 items-center justify-center rounded-2xl border border-violet-200/15 bg-violet-300/10 text-violet-200"><RoleIcon className="size-5" /></div><p className="mb-2 text-sm font-medium text-violet-200">Welcome to HireLoop</p><h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{content.title}</h2><p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">{content.description}</p></div>
      </section>
    </>
  );
}
