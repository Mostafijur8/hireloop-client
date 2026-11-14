import type { DashboardCopy } from "./dashboard-content";

/** Displays summary cards and the recommended next steps for a role. */
export function DashboardPanels({ content }: { content: DashboardCopy }) {
  return (
    <>
      <section aria-label="Workspace summary" className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {content.stats.map((stat) => { const Icon = stat.icon; return <article key={stat.label} className="rounded-2xl border border-white/[0.09] bg-white/[0.035] p-5 transition-colors hover:border-violet-300/25 hover:bg-white/[0.055]"><div className="mb-5 flex items-center justify-between"><span className="text-sm text-zinc-300">{stat.label}</span><span className="flex size-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-200"><Icon className="size-[18px]" /></span></div><p className="text-3xl font-semibold tracking-tight text-white">--</p><p className="mt-2 text-xs text-zinc-500">{stat.detail}</p></article>; })}
      </section>
      <section><div className="mb-5"><h2 className="text-lg font-semibold tracking-tight">{content.sectionTitle}</h2><p className="mt-1 text-sm text-zinc-400">{content.sectionDescription}</p></div><div className="grid gap-4 lg:grid-cols-3">
        {content.tips.map((tip, index) => { const Icon = tip.icon; return <article key={tip.title} className="group rounded-2xl border border-white/[0.09] bg-[#0b0b10]/90 p-5 transition-all hover:-translate-y-0.5 hover:border-violet-300/25 hover:bg-[#100e18]"><div className="mb-5 flex items-center justify-between"><span className="text-xs font-medium tracking-wider text-zinc-600">0{index + 1}</span><span className="flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-violet-200 transition-colors group-hover:bg-violet-400/10"><Icon className="size-[18px]" /></span></div><h3 className="font-medium text-zinc-100">{tip.title}</h3><p className="mt-2 text-sm leading-6 text-zinc-400">{tip.description}</p></article>; })}
      </div></section>
    </>
  );
}
