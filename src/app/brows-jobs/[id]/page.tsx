import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { ArrowLeft, Bookmark, BriefcaseBusiness, Building2, Clock3, MapPin } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { JobRecord } from '@/types/job';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';
type JobDetailsData = JobRecord & {
  description?: string;
  experience?: string;
  companySize?: string;
  industry?: string;
  website?: string;
  responsibilities?: unknown;
  requirements?: unknown;
  benefits?: unknown;
};

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
  const summaryItems = [
    { label: 'Salary range', value: salary, icon: <BriefcaseBusiness className="size-4" /> },
    { label: 'Location', value: job.location || 'Not specified', icon: <MapPin className="size-4" /> },
    { label: 'Job type', value: job.type || 'Not specified', icon: <Clock3 className="size-4" /> },
    { label: 'Experience', value: job.experience || 'Not specified', icon: <Building2 className="size-4" /> },
  ];
  const toList = (value: unknown): string[] => {
    if (Array.isArray(value)) {
      return value.filter(
        (item): item is string => typeof item === 'string' && item.trim().length > 0,
      );
    }
    if (typeof value === 'string' && value.trim()) {
      return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
    }
    return [];
  };
  const detailSections = [
    { title: 'Responsibilities', items: toList(job.responsibilities) },
    { title: 'Requirements', items: toList(job.requirements) },
    { title: 'Benefits', items: toList(job.benefits) },
  ].filter((section) => section.items.length > 0);
  const companyInfo = [
    { label: 'Company size', value: job.companySize },
    { label: 'Industry', value: job.industry },
    { label: 'Department', value: job.department },
    { label: 'Applicants', value: job.applicants === undefined ? undefined : String(job.applicants) },
  ].filter((item) => item.value);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#09090b] px-4 py-7 text-white sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/brows-jobs" className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white">
          <ArrowLeft className="size-4" /> Back to jobs
        </Link>

        <header className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/[0.08] bg-[#141416] p-4 sm:px-6 sm:py-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-violet-400/20 to-[#202024] text-lg font-semibold text-violet-200">
            {company.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">{job.title}</h1>
            <p className="mt-1 flex flex-wrap items-center gap-x-2 text-sm text-zinc-400">
              <span>{company}</span>
              {job.location && <><span className="text-zinc-700">•</span><span>{job.location}</span></>}
              <span className="text-emerald-400">• Open position</span>
            </p>
          </div>
          <span aria-hidden="true" className="hidden rounded-lg border border-white/10 bg-[#1d1d20] p-2.5 text-zinc-300 sm:inline-flex">
            <Bookmark className="size-4" />
          </span>
          <Link href={`/sign-in?callbackUrl=${encodeURIComponent(`/brows-jobs/${job._id}`)}`} className="w-full rounded-lg bg-white px-5 py-2.5 text-center text-sm font-semibold text-zinc-900 transition hover:bg-violet-100 sm:w-auto">
            Apply Now
          </Link>
        </header>

        <section aria-label="Job summary" className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {summaryItems.map((item) => (
            <div key={item.label} className="min-w-0 rounded-xl border border-white/[0.07] bg-[#141416] p-3.5 sm:p-4">
              <div className="flex items-center gap-2 text-zinc-500">
                {item.icon}<span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
              </div>
              <p className="mt-2 truncate text-xs font-medium text-zinc-200" title={item.value}>{item.value}</p>
            </div>
          ))}
        </section>

        <div className="mt-3 grid items-start gap-3 lg:grid-cols-[minmax(0,1fr)_300px]">
          <article className="rounded-2xl border border-white/[0.08] bg-[#141416] p-5 sm:p-7">
            <section>
              <h2 className="text-base font-semibold">Job Description</h2>
              <p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-400">
                {job.description || 'No description provided.'}
              </p>
            </section>

            {detailSections.map((section) => (
              <section key={section.title} className="mt-6 border-t border-white/[0.07] pt-5">
                <h2 className="text-base font-semibold">{section.title}</h2>
                <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-6 text-zinc-400">
                  {section.items.map((item, index) => <li key={`${section.title}-${index}`}>{item}</li>)}
                </ul>
              </section>
            ))}

            <div className="mt-6 border-t border-white/[0.07] pt-5 text-xs text-zinc-500">
              {job.deadline ? `Apply before ${job.deadline}` : 'Review the role details before applying.'}
            </div>
          </article>

          <aside className="rounded-2xl border border-white/[0.08] bg-[#141416] p-5">
            <h2 className="text-base font-semibold">Company Overview</h2>
            <div className="mt-4 flex h-32 items-end overflow-hidden rounded-xl border border-white/[0.06] bg-[radial-gradient(ellipse_at_50%_10%,rgba(124,58,237,0.24),transparent_60%),linear-gradient(145deg,#222228,#101012_65%)] p-4">
              <div className="flex size-11 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-xl font-semibold text-violet-200 backdrop-blur">
                {company.charAt(0).toUpperCase()}
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-300">{company}</p>
            <div className="mt-4 divide-y divide-white/[0.07] border-y border-white/[0.07] text-xs">
              {companyInfo.length ? companyInfo.map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3 py-3">
                  <span className="text-zinc-500">{item.label}</span>
                  <span className="text-right text-zinc-300">{item.value}</span>
                </div>
              )) : (
                <p className="py-3 text-zinc-500">More company information will appear here when available.</p>
              )}
            </div>
            {job.website && (
              <a href={job.website} target="_blank" rel="noreferrer" className="mt-4 block rounded-lg border border-white/10 bg-[#1c1c20] px-3 py-2.5 text-center text-xs font-medium text-zinc-300 transition hover:bg-[#242428]">
                Visit website
              </a>
            )}
          </aside>
        </div>
      </div>
    </main>
    </>
  );
}
