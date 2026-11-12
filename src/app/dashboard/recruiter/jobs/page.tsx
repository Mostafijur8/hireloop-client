"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  Globe2,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  Users,
} from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { JobDeleteDialog } from "@/app/components/alertDialog/jobDeleteDialog";
import getJobs from "@/lib/api/jobs";

type JobRow = {
  _id: string;
  title: string;
  companyName?: string;
  department?: string;
  company?: string;
  location?: string;
  remote?: boolean;
  type?: string;
  status?: string;
  salary?: string;
  salaryRange?: {
    min?: string;
    max?: string;
    currency?: string;
    period?: string;
  };
  applicants?: number;
  deadline?: string;
  createdAt?: string;
  posted?: string;
  color?: string;
  dept?: string;
  icon?: ComponentType<{ className?: string }>;
};

function formatJobDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

function formatPostedAgo(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  const days = Math.max(0, Math.floor((Date.now() - date.getTime()) / 86_400_000));
  if (days === 0) return "today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

// Recruiter-এর posted jobs-গুলো table আকারে দেখায় এবং Add/Update action দেয়।
export default function ManageJobsPage() {
  const [jobRows, setJobRows] = useState<JobRow[]>([]);

  useEffect(() => {
    getJobs()
      .then((data) => {
        setJobRows(Array.isArray(data) ? data : (data?.jobs ?? []));
      })
      .catch((error) => {
        console.error("Failed to load jobs", error);
      });
  }, []);

  const { toast } = useToast();

  function removeJob(id: string) {
    setJobRows((current) => current.filter((job) => job._id !== id));
    toast("Job removed from this list view.", "success");
  }

  return (
    <main className="min-h-[calc(100svh-3rem)] min-w-0 flex-1 overflow-x-hidden bg-[#121212] px-[7px] pb-8 pt-[16px] text-white sm:px-[7px]">
      <div className="mb-[5px] flex items-center gap-[7px] pl-0 text-[10px] leading-4 text-[#85858e]">
        <Link href="/dashboard/recruiter" className="hover:text-white">
          Manage Jobs
        </Link>
        <span>›</span>
        <span className="text-[#d6d1ff]">Job Listings &amp; Postings</span>
      </div>
      <div className="mb-[16px] flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium leading-[27px] tracking-[-0.04em]">
            Manage Job Posts
          </h1>
          <p className="mt-[2px] text-[10px] leading-4 text-[#96969f]">
            Review live listings, monitor applicants, and update job details
            across your organization.
          </p>
        </div>
        <Link
          href="/dashboard/recruiter/jobs/new"
          className="inline-flex h-[28px] shrink-0 items-center gap-1 rounded-[9px] bg-[#5c4bff] px-[13px] text-[10px] font-medium shadow-[0_3px_12px_rgba(76,61,255,.18)] transition hover:bg-[#7062ff]"
        >
          <Plus className="size-[13px]" /> New Job Post
        </Link>
      </div>

      <section
        aria-label="Job listings"
        className="overflow-x-auto rounded-[12px] border border-[#242427] bg-[#151515]"
      >
        <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[16%]" />
            <col className="w-[8%]" />
            <col className="w-[11%]" />
            <col className="w-[12%]" />
            <col className="w-[8%]" />
            <col className="w-[13%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead className="h-[35px] bg-[#101012] text-[8px] font-medium uppercase tracking-[.04em] text-[#a4a4ae]">
            <tr>
              {[
                "Job Title & Dept",
                "Company & Location",
                "Type",
                "Compensation",
                "Applicants",
                "Status",
                "Deadline",
                "Actions",
              ].map((label) => (
                <th key={label} className="whitespace-nowrap px-[14px]">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobRows.map((job) => {
              // API records are JSON, so they cannot contain the Lucide component
              // functions used by the old in-file sample data.
              const Icon =
                typeof job.icon === "function" ? job.icon : BriefcaseBusiness;
              const isActive = job.status?.toLowerCase() === "active";
              const isRemote =
                job.remote ?? job.location?.toLowerCase().startsWith("remote") ?? false;
              const locationLabel =
                job.location?.toLowerCase() === "remote"
                  ? "Remote (EU/US)"
                  : job.location;
              const salary = job.salaryRange
                ? `${job.salaryRange.currency ?? ""} ${job.salaryRange.min ?? "—"}–${job.salaryRange.max ?? "—"}${job.salaryRange.period ? ` / ${job.salaryRange.period}` : ""}`.trim()
                : job.salary ?? "—";
              return (
                <tr
                  key={job._id}
                  className="h-[54px] border-t border-[#242427] text-[10px]"
                >
                  <td className="px-[14px]">
                    <div className="flex items-center gap-[7px]">
                      <span
                        className={`flex size-[25px] shrink-0 items-center justify-center rounded-[6px] bg-[#242428] ${job.color}`}
                      >
                        <Icon className="size-[14px]" />
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-medium leading-[14px] text-[#f2f2f4]">
                          {job.title}
                        </div>
                        <div
                          className={`mt-[1px] text-[8px] leading-[12px] ${job.dept}`}
                        >
                          {job.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-[14px]">
                    <div className="truncate font-medium leading-[13px]">
                      {job.companyName ?? job.company ?? "—"}
                    </div>
                    <div className="mt-[1px] flex items-center gap-[4px] truncate text-[8px] leading-[12px] text-[#a2a2ab]">
                      {isRemote ? (
                        <Globe2 className="size-[13px] shrink-0" />
                      ) : (
                        <MapPin className="size-[13px] shrink-0" />
                      )}
                      {locationLabel}
                    </div>
                  </td>
                  <td className="px-[14px]">
                    <span className="whitespace-nowrap rounded-full bg-[#242426] px-[9px] py-[5px] text-[8px] text-[#d0d0d3]">
                      {job.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-[14px] text-[9px]">
                    {salary}
                  </td>
                  <td className="px-[14px]">
                    <span className="inline-flex items-center gap-[4px] whitespace-nowrap text-[9px] text-[#d4d0ff]">
                      <Users className="size-[14px]" />
                      {job.applicants} Candidates
                    </span>
                  </td>
                  <td className="px-[14px]">
                    <span
                      className={`inline-flex items-center gap-[5px] rounded-full px-[8px] py-[5px] text-[8px] ${isActive ? "bg-[#10321f] text-[#5ee28d]" : "bg-[#252527] text-[#a2a2a9]"}`}
                    >
                      <span
                        className={`size-[4px] rounded-full ${isActive ? "bg-[#2ce078]" : "bg-[#77777d]"}`}
                      />
                      {job.status ?? "Unknown"}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-[14px]">
                    <div className="leading-[13px]">{formatJobDate(job.deadline)}</div>
                    <div className="text-[8px] leading-[12px] text-[#66666d]">
                      Posted {formatPostedAgo(job.createdAt)}
                    </div>
                  </td>
                  <td className="px-[12px]">
                    <div className="flex items-center justify-end gap-[5px]">
                      <Link
                        href="/dashboard/recruiter/jobs/new"
                        className="inline-flex h-[24px] items-center gap-[4px] rounded-[7px] bg-[#242044] px-[8px] text-[8px] text-[#d1caff] hover:bg-[#332d61]"
                      >
                        <Pencil className="size-[12px]" />
                        Update
                      </Link>
                      <JobDeleteDialog
                        jobId={job._id}
                        jobTitle={job.title}
                        onConfirm={() => removeJob(job._id)}
                      />
                      <button
                        type="button"
                        aria-label={`More actions for ${job.title}`}
                        className="flex size-[22px] items-center justify-center text-[#9c9ca4] hover:text-white"
                      >
                        <MoreVertical className="size-[15px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
