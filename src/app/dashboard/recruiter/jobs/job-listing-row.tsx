import { BriefcaseBusiness } from "lucide-react";
import type { JobListing } from "./job-listing-types";
import { CompanyLocationCell, CompensationCell, JobActivityCells } from "./job-listing-cells";
import { JobListingActions } from "./job-listing-actions";

/** Renders one recruiter job row from reusable cell components. */
export function JobListingRow({ job, onRemove }: { job: JobListing; onRemove: (id: string) => void }) {
  const Icon = typeof job.icon === "function" ? job.icon : BriefcaseBusiness;
  return <tr className="h-[54px] border-t border-[#242427] text-[10px] lg:h-[66px] lg:text-[13px]">
    <td className="px-[14px]"><div className="flex items-center gap-[7px]"><span className={`flex size-[25px] shrink-0 items-center justify-center rounded-[6px] bg-[#242428] ${job.color}`}><Icon className="size-[14px]" /></span><div className="min-w-0"><div className="truncate font-medium leading-[14px] text-[#f2f2f4] lg:text-[14px] lg:leading-[18px]">{job.title}</div><div className={`mt-[1px] text-[8px] leading-[12px] lg:text-[11px] lg:leading-[15px] ${job.dept}`}>{job.department}</div></div></div></td>
    <CompanyLocationCell job={job} /><CompensationCell job={job} /><JobActivityCells job={job} /><JobListingActions job={job} onRemove={onRemove} />
  </tr>;
}
