"use client";

import { useState } from "react";
import { BriefcaseBusiness } from "lucide-react";
import type { JobListing } from "./job-listing-types";
import { CompanyLocationCell, CompensationCell, JobActivityCells } from "./job-listing-cells";
import { JobListingActions } from "./job-listing-actions";

/** Renders one recruiter job row from reusable cell components. */
export function JobListingRow({ job, onRemove }: { job: JobListing; onRemove: (id: string) => void }) {
  const [candidatesExpanded, setCandidatesExpanded] = useState(false);
  const Icon = typeof job.icon === "function" ? job.icon : BriefcaseBusiness;
  const applicants = job.applicantList ?? [];

  return <>
    <tr className="h-[54px] border-t border-[#242427] text-[10px] lg:h-[66px] lg:text-[13px]">
      <td className="px-[14px]"><div className="flex items-center gap-[7px]"><span className={`flex size-[25px] shrink-0 items-center justify-center rounded-[6px] bg-[#242428] ${job.color}`}><Icon className="size-[14px]" /></span><div className="min-w-0"><div className="truncate font-medium leading-[14px] text-[#f2f2f4] lg:text-[14px] lg:leading-[18px]">{job.title}</div><div className={`mt-[1px] text-[8px] leading-[12px] lg:text-[11px] lg:leading-[15px] ${job.dept}`}>{job.department}</div></div></div></td>
      <CompanyLocationCell job={job} /><CompensationCell job={job} />
      <JobActivityCells job={job} candidatesExpanded={candidatesExpanded} onViewCandidates={() => setCandidatesExpanded((expanded) => !expanded)} />
      <JobListingActions job={job} onRemove={onRemove} />
    </tr>
    {candidatesExpanded && <tr className="border-t border-[#242427] bg-[#111112]">
      <td colSpan={8} className="px-4 py-3">
        <h3 className="mb-2 text-[11px] font-medium text-white lg:text-[13px]">Applicants for {job.title}</h3>
        {applicants.length === 0 ? <p className="text-[10px] text-[#96969f]">No candidates have applied yet.</p> : (
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {applicants.map((application) => <li key={application._id} className="rounded-lg border border-[#29292d] bg-[#181819] p-2.5">
              <div className="text-[10px] font-medium text-white lg:text-[12px]">{application.seeker?.name ?? 'Name unavailable'}</div>
              <div className="mt-0.5 break-all text-[9px] text-[#aaaab2] lg:text-[11px]">{application.seeker?.email ?? 'Email unavailable'}</div>
              <div className="mt-1 text-[8px] text-[#85858e] lg:text-[10px]">Applied {formatAppliedTime(application.appliedAt)}</div>
            </li>)}
          </ul>
        )}
      </td>
    </tr>}
  </>;
}

function formatAppliedTime(value?: string) {
  if (!value) return 'time unavailable';
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return 'time unavailable';
  const minutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
