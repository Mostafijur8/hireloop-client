'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/toast-provider';
import { useSession } from '@/lib/auth-client';
import { getJobs } from '@/features/jobs/queries';
import type { JobListing } from './job-listing-types';
import { JobListingsTable } from './job-listings-table';

/** Loads recruiter jobs and renders page navigation plus the listings table. */
export default function ManageJobsPage() {
  const [jobRows, setJobRows] = useState<JobListing[]>([]);
  const { toast } = useToast();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    const recruiterId = session?.user?.id;
    if (isPending) return;
    if (!recruiterId) {
      setJobRows([]);
      return;
    }

    getJobs(`recruiterId=${encodeURIComponent(recruiterId)}`)
      .then((data) => {
        const jobs: JobListing[] = Array.isArray(data) ? data : (data?.jobs ?? []);
        // Request filter-এর পাশাপাশি UI-তেও নিশ্চিত করা হয় যে শুধু নিজের job দেখায়।
        setJobRows(jobs.filter((job) => job.recruiterId === recruiterId));
      })
      .catch((error) => console.error('Failed to load jobs', error));
  }, [isPending, session?.user?.id]);

  function removeJob(id: string) {
    setJobRows((current) => current.filter((job) => job._id !== id));
    toast('Job removed from this list view.', 'success');
  }

  return (
    <main className="min-h-[calc(100svh-3rem)] min-w-0 flex-1 overflow-x-hidden bg-[#121212] px-[7px] pb-8 pt-[16px] text-white sm:px-[7px]">
      <div className="mb-[5px] flex items-center gap-[7px] pl-0 text-[10px] leading-4 text-[#85858e] lg:text-[13px]">
        <Link href="/dashboard/recruiter" className="hover:text-white">
          Manage Jobs
        </Link>
        <span>›</span>
        <span className="text-[#d6d1ff]">Job Listings &amp; Postings</span>
      </div>
      <div className="mb-[16px] flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium leading-[27px] tracking-[-0.04em] lg:text-[30px] lg:leading-[36px]">
            Manage Job Posts
          </h1>
          <p className="mt-[2px] text-[10px] leading-4 text-[#96969f] lg:text-[14px] lg:leading-5">
            Review live listings, monitor applicants, and update job details across your
            organization.
          </p>
        </div>
        <Link
          href="/dashboard/recruiter/jobs/new"
          className="inline-flex h-[28px] shrink-0 items-center gap-1 rounded-[9px] bg-[#5c4bff] px-[13px] text-[10px] font-medium shadow-[0_3px_12px_rgba(76,61,255,.18)] transition hover:bg-[#7062ff] lg:h-[38px] lg:text-[14px]"
        >
          <Plus className="size-[13px]" />
          New Job Post
        </Link>
      </div>
      <JobListingsTable jobs={jobRows} onRemove={removeJob} />
    </main>
  );
}
