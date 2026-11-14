import { Globe2, MapPin, Users } from "lucide-react";
import type { JobListing } from "./job-listing-types";
import { formatJobDate, formatPostedAgo } from "./job-listing-formatters";

/** Displays company and location information for a job row. */
export function CompanyLocationCell({ job }: { job: JobListing }) {
  const isRemote = job.remote ?? job.location?.toLowerCase().startsWith("remote") ?? false;
  const location = job.location?.toLowerCase() === "remote" ? "Remote (EU/US)" : job.location;
  return <td className="px-[14px]"><div className="truncate font-medium leading-[13px] lg:text-[13px] lg:leading-[17px]">{job.companyName ?? job.company ?? "—"}</div><div className="mt-[1px] flex items-center gap-[4px] truncate text-[8px] leading-[12px] text-[#a2a2ab] lg:text-[11px] lg:leading-[15px]">{isRemote ? <Globe2 className="size-[13px] shrink-0" /> : <MapPin className="size-[13px] shrink-0" />}{location}</div></td>;
}

/** Displays role type and compensation. */
export function CompensationCell({ job }: { job: JobListing }) {
  const salary = job.salaryRange ? `${job.salaryRange.currency ?? ""} ${job.salaryRange.min ?? "—"}–${job.salaryRange.max ?? "—"}${job.salaryRange.period ? ` / ${job.salaryRange.period}` : ""}`.trim() : job.salary ?? "—";
  return <><td className="px-[14px]"><span className="whitespace-nowrap rounded-full bg-[#242426] px-[9px] py-[5px] text-[8px] text-[#d0d0d3] lg:text-[11px]">{job.type}</span></td><td className="whitespace-nowrap px-[14px] text-[9px] lg:text-[12px]">{salary}</td></>;
}

/** Displays candidate count, status, and deadline metadata. */
export function JobActivityCells({ job }: { job: JobListing }) {
  const active = job.status?.toLowerCase() === "active";
  return <>
    <td className="px-[14px]"><span className="inline-flex items-center gap-[4px] whitespace-nowrap text-[9px] text-[#d4d0ff] lg:text-[12px]"><Users className="size-[14px]" />{job.applicants} Candidates</span></td>
    <td className="px-[14px]"><span className={`inline-flex items-center gap-[5px] rounded-full px-[8px] py-[5px] text-[8px] lg:text-[11px] ${active ? "bg-[#10321f] text-[#5ee28d]" : "bg-[#252527] text-[#a2a2a9]"}`}><span className={`size-[4px] rounded-full ${active ? "bg-[#2ce078]" : "bg-[#77777d]"}`} />{job.status ?? "Unknown"}</span></td>
    <td className="whitespace-nowrap px-[14px]"><div className="leading-[13px] lg:text-[12px] lg:leading-[17px]">{formatJobDate(job.deadline)}</div><div className="text-[8px] leading-[12px] text-[#66666d] lg:text-[10px] lg:leading-[15px]">Posted {formatPostedAgo(job.createdAt)}</div></td>
  </>;
}
