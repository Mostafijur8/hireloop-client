import { dashboardContent, type DashboardRole } from "./dashboard-content";
import { DashboardHero } from "./dashboard-hero";
import { DashboardPanels } from "./dashboard-panels";

/** Composes the role-specific dashboard from focused presentational sections. */
export function DashboardHome({ role }: { role: DashboardRole }) {
  const content = dashboardContent[role];
  return (
    <main className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[#050507] px-5 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
      <div className="pointer-events-none absolute -top-48 right-[-8rem] -z-10 size-[30rem] rounded-full bg-violet-700/15 blur-[120px]" />
      <div className="pointer-events-none absolute left-[25%] top-[25rem] -z-10 size-[22rem] rounded-full bg-indigo-700/10 blur-[110px]" />
      <div className="mx-auto max-w-6xl"><DashboardHero content={content} /><DashboardPanels content={content} /></div>
    </main>
  );
}
