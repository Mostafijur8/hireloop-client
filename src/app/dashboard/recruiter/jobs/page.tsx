import Link from "next/link";
import { ArrowUpRight, BriefcaseBusiness, CirclePlus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const overview = [
  { label: "Total jobs", value: "0", note: "All your job posts", icon: BriefcaseBusiness },
  { label: "Active jobs", value: "0", note: "Currently accepting applicants", icon: ArrowUpRight },
  { label: "Applicants", value: "0", note: "Across all your jobs", icon: Search },
];

export default function ManageJobsPage() {
  return (
    <div className="min-h-[calc(100svh-3rem)] bg-[#050507] px-5 py-8 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-violet-300">
              RECRUITER WORKSPACE
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">Manage jobs</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Create job posts and keep track of your hiring pipeline.
            </p>
          </div>
          <Button
            render={<Link href="/dashboard/recruiter/jobs/new" />}
            className="h-10 rounded-xl bg-violet-500 px-4 text-white hover:bg-violet-400"
          >
            <CirclePlus />
            Add a job
          </Button>
        </div>

        <section aria-label="Jobs overview" className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {overview.map(({ label, value, note, icon: Icon }) => (
            <article key={label} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-zinc-400">{label}</p>
                <span className="flex size-9 items-center justify-center rounded-xl border border-violet-300/10 bg-violet-300/[0.08] text-violet-200">
                  <Icon className="size-4" />
                </span>
              </div>
              <p className="mt-5 text-3xl font-semibold tracking-tight">{value}</p>
              <p className="mt-1 text-xs text-zinc-500">{note}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] p-5 sm:px-6">
            <div>
              <h2 className="font-medium">Your job posts</h2>
              <p className="mt-1 text-xs text-zinc-500">Review and manage roles you publish.</p>
            </div>
            <label className="relative block w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
              <Input
                aria-label="Search jobs"
                placeholder="Search job posts..."
                disabled
                className="h-9 rounded-lg border-white/10 bg-white/[0.03] pl-9 text-sm text-white placeholder:text-zinc-600"
              />
            </label>
          </div>

          <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-zinc-400">
              <BriefcaseBusiness className="size-5" />
            </span>
            <h3 className="mt-4 font-medium">No job posts yet</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
              Your published roles will show up here. Create your first job post to get started.
            </p>
            <Button
              render={<Link href="/dashboard/recruiter/jobs/new" />}
              variant="outline"
              className="mt-5 h-9 rounded-lg border-white/10 bg-white/[0.03] text-zinc-200 hover:bg-white/[0.07] hover:text-white"
            >
              <CirclePlus />
              Create a job
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
