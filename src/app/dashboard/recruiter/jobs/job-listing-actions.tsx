import Link from "next/link";
import { MoreVertical, Pencil } from "lucide-react";
import { JobDeleteDialog } from "@/app/components/alertDialog/jobDeleteDialog";
import type { JobListing } from "./job-listing-types";

/** Renders update and delete controls for a job listing. */
export function JobListingActions({ job, onRemove }: { job: JobListing; onRemove: (id: string) => void }) {
  return <td className="px-[12px]"><div className="flex items-center justify-end gap-[5px]"><Link href="/dashboard/recruiter/jobs/new" className="inline-flex h-[24px] items-center gap-[4px] rounded-[7px] bg-[#242044] px-[8px] text-[8px] text-[#d1caff] hover:bg-[#332d61] lg:h-[32px] lg:text-[11px]"><Pencil className="size-[12px]" />Update</Link><JobDeleteDialog jobId={job._id} jobTitle={job.title} onConfirm={() => onRemove(job._id)} /><button type="button" aria-label={`More actions for ${job.title}`} className="flex size-[22px] items-center justify-center text-[#9c9ca4] hover:text-white"><MoreVertical className="size-[15px]" /></button></div></td>;
}
