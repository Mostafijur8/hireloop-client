import Link from 'next/link';
import { ArrowLeft, BriefcaseBusiness, MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { JobRecord } from '@/types/job';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
type JobDetailsData = JobRecord & { description?: string };

export default async function JobDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const response = await fetch(`${API_URL}/jobs/${id}`);
  if (!response.ok) notFound();

  const data = await response.json();
  const job = (data.job ?? data) as JobDetailsData;
  if (!job.title) notFound();

  const company = job.companyName || job.company || 'Company details coming soon';
  const salary = job.salary || (job.salaryRange
    ? `${job.salaryRange.currency || 'BDT'} ${job.salaryRange.min || ''}${job.salaryRange.max ? ` - ${job.salaryRange.max}` : ''}`
    : 'Not specified');

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link href="/brows-jobs" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
          <ArrowLeft className="size-4" /> Back to jobs
        </Link>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111113]">
            <div className="border-b border-white/[0.07] bg-gradient-to-br from-violet-500/10 via-[#111113] to-[#111113] p-6 sm:p-9">
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-violet-300/15 bg-violet-400/10 text-xl font-semibold text-violet-200">
                  {company.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-violet-300">{company}</p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">{job.title}</h1>
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-400">
                    {job.location && <span className="inline-flex items-center gap-1.5"><MapPin className="size-4" />{job.location}</span>}
                    {job.type && <span className="inline-flex items-center gap-1.5"><BriefcaseBusiness className="size-4" />{job.type}</span>}
                    {job.remote && <span className="text-emerald-300">Remote</span>}
                  </div>
                </div>
              </div>
            </div>

            <section className="p-6 sm:p-9">
              <h2 className="text-lg font-semibold">About this role</h2>
              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-400">
                {job.description || 'No description provided.'}
              </p>
            </section>
          </article>

          <aside className="h-fit rounded-2xl border border-white/[0.08] bg-[#111113] p-6 lg:sticky lg:top-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Job overview</p>
            <div className="mt-5 space-y-5">
              <div>
                <p className="text-xs text-zinc-500">Salary</p>
                <p className="mt-1 font-medium text-violet-200">{salary}</p>
              </div>
              {job.department && <div><p className="text-xs text-zinc-500">Department</p><p className="mt-1 text-sm text-zinc-200">{job.department}</p></div>}
              {job.deadline && <div><p className="text-xs text-zinc-500">Application deadline</p><p className="mt-1 text-sm text-zinc-200">{job.deadline}</p></div>}
              {job.applicants !== undefined && <div><p className="text-xs text-zinc-500">Applicants</p><p className="mt-1 text-sm text-zinc-200">{job.applicants}</p></div>}
            </div>
            <Link href="/sign-in" className="mt-7 block rounded-xl bg-violet-500 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-violet-400">
              Sign in to apply
            </Link>
            <p className="mt-3 text-center text-xs text-zinc-500">Create an account to continue your application.</p>
          </aside>
        </div>
      </div>
    </main>
  );
}
