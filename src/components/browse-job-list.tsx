'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BriefcaseBusiness, MapPin } from 'lucide-react';
import type { JobRecord } from '@/types/job';

type ApplicationListResponse = {
  applications?: { jobId?: string }[];
};

export function BrowseJobList({ jobs }: { jobs: JobRecord[] }) {
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let active = true;

    fetch('/api/applications')
      .then(async (response) => {
        if (!response.ok) return;
        return (await response.json()) as ApplicationListResponse;
      })
      .then((data) => {
        if (!active || !data?.applications) return;
        setAppliedJobIds(new Set(data.applications.flatMap((application) => application.jobId ? [application.jobId] : [])));
      })
      .catch(() => {
        // Browse jobs still works when the visitor is signed out or applications cannot load.
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-3">
      {jobs.length ? jobs.map((job) => {
        const company = job.companyName || job.company;
        const salary = job.salary || (job.salaryRange
          ? `${job.salaryRange.currency || 'BDT'} ${job.salaryRange.min || ''}${job.salaryRange.max ? ` - ${job.salaryRange.max}` : ''}`
          : '');
        const isApplied = appliedJobIds.has(String(job._id));

        return (
          <Link
            key={job._id}
            href={`/brows-jobs/${job._id}`}
            className={`group block rounded-2xl border p-5 transition sm:p-6 ${isApplied
              ? 'border-emerald-400/40 bg-emerald-400/[0.08] hover:border-emerald-300/60 hover:bg-emerald-400/[0.12]'
              : 'border-white/[0.07] bg-[#111113] hover:border-violet-400/40 hover:bg-[#151518]'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl border text-lg font-semibold ${isApplied
                ? 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200'
                : 'border-white/[0.06] bg-[#1d1d21] text-violet-300'}`}>
                {company?.charAt(0) || job.title.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className={`font-semibold transition ${isApplied ? 'text-emerald-100 group-hover:text-emerald-50' : 'text-zinc-100 group-hover:text-violet-200'}`}>{job.title}</h3>
                  {isApplied
                    ? <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-xs font-medium text-emerald-200">Applied</span>
                    : <span className="text-xs text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-violet-300">View details &rarr;</span>}
                </div>
                <p className="mt-1 text-sm text-zinc-400">{company || 'Company details coming soon'}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.location && <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs text-zinc-400"><MapPin className="size-3.5" />{job.location}</span>}
                  {job.type && <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.04] px-2.5 py-1.5 text-xs text-zinc-400"><BriefcaseBusiness className="size-3.5" />{job.type}</span>}
                  {salary && <span className="rounded-lg bg-violet-400/10 px-2.5 py-1.5 text-xs font-medium text-violet-200">{salary}</span>}
                  {job.remote && <span className="rounded-lg bg-emerald-400/10 px-2.5 py-1.5 text-xs text-emerald-300">Remote</span>}
                </div>
              </div>
            </div>
          </Link>
        );
      }) : (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#111113] px-6 py-12 text-center">
          <p className="font-medium text-zinc-300">No jobs found</p>
          <p className="mt-1 text-sm text-zinc-500">Try a different search or clear your filters.</p>
          <Link href="/brows-jobs" className="mt-4 inline-block text-sm text-violet-300 hover:text-violet-200">Clear search</Link>
        </div>
      )}
    </div>
  );
}
