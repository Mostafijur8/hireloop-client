import {
  Activity,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  FileText,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type DashboardRole = "admin" | "recruiter" | "seeker";

// প্রতিটি role-এর dashboard-এ দেখানোর শিরোনাম, পরিসংখ্যান ও করণীয়।
const dashboardContent: Record<
  DashboardRole,
  {
    eyebrow: string;
    dashboardTitle: string;
    title: string;
    description: string;
    icon: LucideIcon;
    stats: { label: string; detail: string; icon: LucideIcon }[];
    sectionTitle: string;
    sectionDescription: string;
    tips: { title: string; description: string; icon: LucideIcon }[];
  }
> = {
  seeker: {
    eyebrow: "CANDIDATE SPACE",
    dashboardTitle: "Seeker Dashboard",
    title: "Your next chapter starts here.",
    description:
      "Keep your career journey moving. Your applications, saved roles, and profile updates will live here.",
    icon: UserRound,
    stats: [
      { label: "Applications", detail: "Track the roles you apply to", icon: FileText },
      { label: "Saved jobs", detail: "Keep interesting roles close", icon: BriefcaseBusiness },
      { label: "Profile", detail: "Build a stronger first impression", icon: UserRound },
    ],
    sectionTitle: "Make your next move",
    sectionDescription: "A few ways to get started with your HireLoop space.",
    tips: [
      { title: "Shape your profile", description: "Add your experience and the work you want to do next.", icon: UserRound },
      { title: "Explore opportunities", description: "Find roles that match your skills and goals.", icon: Search },
      { title: "Stay organized", description: "Keep your job search progress in one place.", icon: ClipboardCheck },
    ],
  },
  recruiter: {
    eyebrow: "RECRUITER SPACE",
    dashboardTitle: "Recruiter Dashboard",
    title: "Build a team that moves you forward.",
    description:
      "Your hiring workspace keeps roles, candidates, and team activity together as you grow.",
    icon: BriefcaseBusiness,
    stats: [
      { label: "Open positions", detail: "Keep your hiring needs organized", icon: BriefcaseBusiness },
      { label: "Candidates", detail: "Stay close to promising talent", icon: Users },
      { label: "Hiring activity", detail: "Follow progress across your team", icon: Activity },
    ],
    sectionTitle: "Your hiring workflow",
    sectionDescription: "Set up a clear path from a new role to the right hire.",
    tips: [
      { title: "Define the role", description: "Make the responsibilities and requirements clear.", icon: FileText },
      { title: "Find your people", description: "Bring promising candidates into one workspace.", icon: Search },
      { title: "Keep your team aligned", description: "Give everyone a shared view of hiring progress.", icon: Users },
    ],
  },
  admin: {
    eyebrow: "ADMIN SPACE",
    dashboardTitle: "Admin Dashboard",
    title: "A clearer view of your platform.",
    description:
      "Your admin workspace brings platform health, account activity, and hiring operations into view.",
    icon: ShieldCheck,
    stats: [
      { label: "People", detail: "Review platform accounts", icon: Users },
      { label: "Organizations", detail: "Keep employer spaces in view", icon: Building2 },
      { label: "Platform activity", detail: "Monitor what is happening", icon: Activity },
    ],
    sectionTitle: "Platform overview",
    sectionDescription: "Keep the important parts of HireLoop easy to find.",
    tips: [
      { title: "People and access", description: "Keep account roles and access organized.", icon: Users },
      { title: "Employer spaces", description: "Review the organizations using HireLoop.", icon: Building2 },
      { title: "Platform operations", description: "Stay aware of activity across the platform.", icon: ClipboardCheck },
    ],
  },
};

export function DashboardHome({ role }: { role: DashboardRole }) {
  // নির্বাচিত role-এর কনফিগারেশন নিয়ে একই layout-এ dashboard তৈরি করে।
  const content = dashboardContent[role];
  const RoleIcon = content.icon;

  return (
    <div className="relative isolate min-h-[calc(100svh-4rem)] overflow-hidden bg-[#050507] px-5 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
      <div className="pointer-events-none absolute -top-48 right-[-8rem] -z-10 size-[30rem] rounded-full bg-violet-700/15 blur-[120px]" />
      <div className="pointer-events-none absolute left-[25%] top-[25rem] -z-10 size-[22rem] rounded-full bg-indigo-700/10 blur-[110px]" />

      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.2em] text-violet-300">
              <Sparkles className="size-3.5" />
              {content.eyebrow}
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{content.dashboardTitle}</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300">
            <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            Your workspace
          </div>
        </header>

        <section className="relative mb-8 overflow-hidden rounded-3xl border border-violet-300/15 bg-gradient-to-br from-[#21143c] via-[#11101d] to-[#0b0b10] p-6 shadow-[0_20px_80px_-40px_rgba(139,92,246,0.45)] sm:p-9">
          <div className="pointer-events-none absolute -right-12 -top-24 size-72 rounded-full border border-violet-300/10 sm:right-12 sm:top-[-9rem] sm:size-[26rem]" />
          <div className="pointer-events-none absolute -right-2 -top-14 size-52 rounded-full border border-violet-300/10 sm:right-24 sm:top-[-6rem] sm:size-[21rem]" />
          <div className="relative max-w-2xl">
            <div className="mb-5 flex size-11 items-center justify-center rounded-2xl border border-violet-200/15 bg-violet-300/10 text-violet-200">
              <RoleIcon className="size-5" />
            </div>
            <p className="mb-2 text-sm font-medium text-violet-200">Welcome to HireLoop</p>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {content.title}
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-300 sm:text-base">
              {content.description}
            </p>
          </div>
        </section>

        <section aria-label="Workspace summary" className="mb-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {content.stats.map((stat) => {
            const StatIcon = stat.icon;
            return (
              <article
                key={stat.label}
                className="rounded-2xl border border-white/[0.09] bg-white/[0.035] p-5 transition-colors hover:border-violet-300/25 hover:bg-white/[0.055]"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm text-zinc-300">{stat.label}</span>
                  <span className="flex size-9 items-center justify-center rounded-xl bg-violet-400/10 text-violet-200">
                    <StatIcon className="size-[18px]" />
                  </span>
                </div>
                <p className="text-3xl font-semibold tracking-tight text-white">--</p>
                <p className="mt-2 text-xs text-zinc-500">{stat.detail}</p>
              </article>
            );
          })}
        </section>

        <section>
          <div className="mb-5">
            <h2 className="text-lg font-semibold tracking-tight">{content.sectionTitle}</h2>
            <p className="mt-1 text-sm text-zinc-400">{content.sectionDescription}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {content.tips.map((tip, index) => {
              const TipIcon = tip.icon;
              return (
                <article
                  key={tip.title}
                  className="group rounded-2xl border border-white/[0.09] bg-[#0b0b10]/90 p-5 transition-all hover:-translate-y-0.5 hover:border-violet-300/25 hover:bg-[#100e18]"
                >
                  <div className="mb-5 flex items-center justify-between">
                    <span className="text-xs font-medium tracking-wider text-zinc-600">0{index + 1}</span>
                    <span className="flex size-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-violet-200 transition-colors group-hover:bg-violet-400/10">
                      <TipIcon className="size-[18px]" />
                    </span>
                  </div>
                  <h3 className="font-medium text-zinc-100">{tip.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">{tip.description}</p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
