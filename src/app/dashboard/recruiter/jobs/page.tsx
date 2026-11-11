import Link from "next/link";
import {
  BriefcaseBusiness, Code2, Globe2, MapPin, Megaphone, MoreVertical, Pencil,
  Plus, ShieldCheck, Trash2, Users, Workflow,
} from "lucide-react";

const jobs = [
  { title: "Frontend Developer", department: "Engineering", company: "HirePulse Network", location: "Remote (New York, USA)", remote: true, type: "Full-time", salary: "€25 – €40 / hr", applicants: 34, deadline: "May 30, 2025", posted: "Posted 4d ago", icon: Code2, color: "text-indigo-400", dept: "text-sky-400", active: true },
  { title: "Senior Product Designer", department: "Design", company: "HirePulse Labs", location: "London, UK (Hybrid)", type: "Full-time", salary: "€90k – €115k / yr", applicants: 19, deadline: "Jun 14, 2025", posted: "Posted 1w ago", icon: Workflow, color: "text-orange-400", dept: "text-orange-400", active: true },
  { title: "DevOps Specialist", department: "Infrastructure", company: "HirePulse Platform", location: "Berlin, Germany", type: "Full-time", salary: "€95k – €120k / yr", applicants: 12, deadline: "Jun 30, 2025", posted: "Posted 2w ago", icon: BriefcaseBusiness, color: "text-cyan-400", dept: "text-sky-400", active: true },
  { title: "Product Marketing Lead", department: "Marketing", company: "HirePulse Network", location: "Remote (EU/US)", remote: true, type: "Full-time", salary: "€80k – €105k / yr", applicants: 27, deadline: "Jul 15, 2025", posted: "Posted 5d ago", icon: Megaphone, color: "text-violet-300", dept: "text-violet-300", active: true },
  { title: "QA Automation Engineer", department: "Quality", company: "HirePulse Platform", location: "Dublin, Ireland (Hybrid)", type: "Part-time", salary: "€35 – €50 / hr", applicants: 8, deadline: "May 01, 2025", posted: "Closed", icon: ShieldCheck, color: "text-blue-400", dept: "text-indigo-300", active: false },
];

export default function ManageJobsPage() {
  return (
    <main className="min-h-[calc(100svh-3rem)] min-w-0 flex-1 overflow-x-hidden bg-[#121212] px-[7px] pb-8 pt-[16px] text-white sm:px-[7px]">
      <div className="mb-[5px] flex items-center gap-[7px] pl-0 text-[10px] leading-4 text-[#85858e]">
        <Link href="/dashboard/recruiter" className="hover:text-white">Manage Jobs</Link>
        <span>›</span>
        <span className="text-[#d6d1ff]">Job Listings &amp; Postings</span>
      </div>
      <div className="mb-[16px] flex items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-medium leading-[27px] tracking-[-0.04em]">Manage Job Posts</h1>
          <p className="mt-[2px] text-[10px] leading-4 text-[#96969f]">Review live listings, monitor applicants, and update job details across your organization.</p>
        </div>
        <Link href="/dashboard/recruiter/jobs/new" className="inline-flex h-[28px] shrink-0 items-center gap-1 rounded-[9px] bg-[#5c4bff] px-[13px] text-[10px] font-medium shadow-[0_3px_12px_rgba(76,61,255,.18)] transition hover:bg-[#7062ff]">
          <Plus className="size-[13px]" /> New Job Post
        </Link>
      </div>

      <section aria-label="Job listings" className="overflow-x-auto rounded-[12px] border border-[#242427] bg-[#151515]">
        <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
          <colgroup><col className="w-[20%]"/><col className="w-[16%]"/><col className="w-[8%]"/><col className="w-[11%]"/><col className="w-[12%]"/><col className="w-[8%]"/><col className="w-[13%]"/><col className="w-[12%]"/></colgroup>
          <thead className="h-[35px] bg-[#101012] text-[8px] font-medium uppercase tracking-[.04em] text-[#a4a4ae]">
            <tr>{["Job Title & Dept", "Company & Location", "Type", "Compensation", "Applicants", "Status", "Deadline", "Actions"].map((label) => <th key={label} className="whitespace-nowrap px-[14px]">{label}</th>)}</tr>
          </thead>
          <tbody>
            {jobs.map((job) => {
              const Icon = job.icon;
              return <tr key={job.title} className="h-[54px] border-t border-[#242427] text-[10px]">
                <td className="px-[14px]"><div className="flex items-center gap-[7px]"><span className={`flex size-[25px] shrink-0 items-center justify-center rounded-[6px] bg-[#242428] ${job.color}`}><Icon className="size-[14px]" /></span><div className="min-w-0"><div className="truncate font-medium leading-[14px] text-[#f2f2f4]">{job.title}</div><div className={`mt-[1px] text-[8px] leading-[12px] ${job.dept}`}>{job.department}</div></div></div></td>
                <td className="px-[14px]"><div className="truncate font-medium leading-[13px]">{job.company}</div><div className="mt-[1px] flex items-center gap-[4px] truncate text-[8px] leading-[12px] text-[#a2a2ab]">{job.remote ? <Globe2 className="size-[13px] shrink-0"/> : <MapPin className="size-[13px] shrink-0"/>}{job.location}</div></td>
                <td className="px-[14px]"><span className="whitespace-nowrap rounded-full bg-[#242426] px-[9px] py-[5px] text-[8px] text-[#d0d0d3]">{job.type}</span></td>
                <td className="whitespace-nowrap px-[14px] text-[9px]">{job.salary}</td>
                <td className="px-[14px]"><span className="inline-flex items-center gap-[4px] whitespace-nowrap text-[9px] text-[#d4d0ff]"><Users className="size-[14px]" />{job.applicants} Candidates</span></td>
                <td className="px-[14px]"><span className={`inline-flex items-center gap-[5px] rounded-full px-[8px] py-[5px] text-[8px] ${job.active ? "bg-[#10321f] text-[#5ee28d]" : "bg-[#252527] text-[#a2a2a9]"}`}><span className={`size-[4px] rounded-full ${job.active ? "bg-[#2ce078]" : "bg-[#77777d]"}`} />{job.active ? "Active" : "Expired"}</span></td>
                <td className="whitespace-nowrap px-[14px]"><div className="leading-[13px]">{job.deadline}</div><div className="text-[8px] leading-[12px] text-[#66666d]">{job.posted}</div></td>
                <td className="px-[12px]"><div className="flex items-center justify-end gap-[5px]"><Link href="/dashboard/recruiter/jobs/new" className="inline-flex h-[24px] items-center gap-[4px] rounded-[7px] bg-[#242044] px-[8px] text-[8px] text-[#d1caff] hover:bg-[#332d61]"><Pencil className="size-[12px]"/>Update</Link><button aria-label={`Delete ${job.title}`} className="flex size-[24px] items-center justify-center rounded-[7px] bg-[#242426] text-[#9c9ca4] hover:bg-[#3b2424] hover:text-red-300"><Trash2 className="size-[13px]"/></button><button aria-label={`More actions for ${job.title}`} className="flex size-[22px] items-center justify-center text-[#9c9ca4] hover:text-white"><MoreVertical className="size-[15px]"/></button></div></td>
              </tr>;
            })}
          </tbody>
        </table>
      </section>
    </main>
  );
}
