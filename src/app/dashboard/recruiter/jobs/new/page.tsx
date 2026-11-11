"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Building2, CalendarDays, ChevronDown, CirclePlus, Euro, Globe2, MapPin } from "lucide-react";
import { createjob } from "@/lib/action/jobs";
import type { Job } from "@/types/job";
import { useToast } from "@/components/toast-provider";

const fieldClass = "mt-1.5 h-[34px] w-full rounded-[9px] border border-transparent bg-[#202023] px-[11px] text-[11px] text-[#e5e5e7] outline-none placeholder:text-[#77777e] focus:border-[#6252ff]/70 focus:ring-2 focus:ring-[#6252ff]/15";
const labelClass = "text-[10px] font-medium text-[#efeff1]";

// প্রতিটি ফর্ম সেকশনের নম্বরযুক্ত শিরোনাম দেখায়।
function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-[14px] flex items-center gap-[7px] text-[11px] font-medium text-[#f0f0f2]"><span className="size-[5px] rounded-full bg-[#6555ff]" />{children}</h2>;
}

export default function NewJobsPage() {
  const { toast } = useToast();
  // ফর্ম জমা দেওয়া, চাকরির ধরন নির্বাচন এবং remote option-এর UI state।
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobType, setJobType] = useState("Full-time");
  const [remote, setRemote] = useState(true);

  // ফর্মের তথ্য API-এর Job format-এ সাজিয়ে চাকরিটি প্রকাশ করে।
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitMessage("");
    setIsSubmitting(true);
    const formData = new FormData(form);
    const responsibilities = String(formData.get("responsibilities") ?? "").trim();
    const qualifications = String(formData.get("qualifications") ?? "").trim();
    // বর্তমান API schema অনুযায়ী বর্ণনা, লোকেশন ও বেতনের তথ্য তৈরি।
    const job: Job = {
      title: String(formData.get("title") ?? "").trim(),
      location: remote ? "Remote" : String(formData.get("location") ?? "").trim(),
      type: jobType,
      salaryRange: {
        min: String(formData.get("salaryMin") ?? "").trim(),
        max: String(formData.get("salaryMax") ?? "").trim(),
        currency: "BDT",
        period: "monthly",
      },
      description: [responsibilities, qualifications && `Qualifications & Requirements\n${qualifications}`].filter(Boolean).join("\n\n"),
    };

    // সফল হলে ফর্ম খালি করে; ব্যর্থ হলে API থেকে পাওয়া বার্তা দেখায়।
    try {
      await createjob(job);
      setSubmitMessage("Job published successfully.");
      toast("Job published successfully.", "success");
      form.reset();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not publish the job.";
      setSubmitMessage(message);
      toast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100svh-3rem)] flex-1 bg-[#121212] px-4 pb-10 pt-5 text-white sm:px-5 lg:px-4">
      <div className="mx-auto max-w-[920px]">
        <div className="mb-[5px] flex items-center gap-[6px] text-[9px] text-[#888891]"><Link href="/dashboard/recruiter/jobs" className="hover:text-white">Manage Jobs</Link><span>›</span><span className="text-[#d4d0ff]">Create New Listing</span></div>
        {/* পেজের শিরোনাম এবং দ্রুত Publish button। */}
        <header className="mb-[26px] flex items-center justify-between gap-4">
          <div><h1 className="text-[21px] font-medium leading-[27px] tracking-[-.035em]">Post a New Job</h1><p className="mt-[2px] text-[10px] text-[#92929b]">Fill in the position specifications to attract qualified talent across our network.</p></div>
          <button type="submit" form="new-job-form" disabled={isSubmitting} className="inline-flex h-[30px] shrink-0 items-center gap-[6px] rounded-[9px] bg-[#5c4bff] px-[13px] text-[10px] font-medium shadow-[0_4px_14px_rgba(76,61,255,.2)] hover:bg-[#7062ff] disabled:opacity-60">{isSubmitting ? "Publishing…" : "Publish Job"}<ArrowRight className="size-[13px]" /></button>
        </header>

        <form id="new-job-form" onSubmit={handleSubmit} className="space-y-[14px]">
          {/* সেকশন ১: পদের নাম, কোম্পানি, ক্যাটাগরি ও চাকরির ধরন। */}
          <section className="rounded-[12px] border border-[#19191c] bg-[#151515] p-[15px] sm:px-[17px] sm:py-[16px]">
            <SectionTitle>1. Basic Information</SectionTitle>
            <label className={labelClass} htmlFor="job-title">Job Title <span className="text-[#8c7dff]">*</span></label>
            <input id="job-title" name="title" required placeholder="e.g. Frontend Developer" className={fieldClass} />
            <div className="mt-[10px] grid gap-[10px] sm:grid-cols-2">
              <label className={labelClass} htmlFor="company-name">Company Name <span className="text-[#8c7dff]">*</span><span className="relative block"><Building2 className="absolute left-[10px] top-[10px] size-[13px] text-[#aaaab2]"/><input id="company-name" name="company" required defaultValue="HirePulse Network" className={`${fieldClass} mt-1.5 pl-[31px]`} /></span></label>
              <label className={labelClass} htmlFor="job-category">Job Category <span className="text-[#8c7dff]">*</span><span className="relative block"><select id="job-category" name="category" required defaultValue="Engineering & Tech" className={`${fieldClass} appearance-none pr-8`}><option>Engineering &amp; Tech</option><option>Design</option><option>Marketing</option><option>Sales</option><option>Operations</option><option>Customer Support</option></select><ChevronDown className="pointer-events-none absolute right-[10px] top-[10px] size-[13px] text-[#aaaab2]"/></span></label>
            </div>
            <fieldset className="mt-[10px]"><legend className={labelClass}>Job Type <span className="text-[#8c7dff]">*</span></legend><div className="mt-[6px] grid grid-cols-2 gap-[4px] sm:grid-cols-4">{["Full-time", "Part-time", "Contract", "Internship"].map((type) => <button key={type} type="button" onClick={() => setJobType(type)} className={`h-[31px] rounded-[9px] border text-[10px] transition ${jobType === type ? "border-[#5547e8] bg-[#222126] text-white" : "border-transparent bg-[#202023] text-[#9999a2] hover:text-white"}`}>{type}</button>)}</div></fieldset>
          </section>

          {/* সেকশন ২: remote/location, deadline, salary ও salary frequency। */}
          <section className="rounded-[12px] border border-[#19191c] bg-[#151515] p-[15px] sm:px-[17px] sm:py-[16px]">
            <SectionTitle>2. Location, Compensation &amp; Timeline</SectionTitle>
            <label className="flex min-h-[43px] cursor-pointer items-center justify-between rounded-[9px] bg-[#202023] px-[11px] py-[7px]">
              <span className="flex items-center gap-[9px]"><span className="flex size-[25px] items-center justify-center rounded-full bg-[#302d49] text-[#c6c0ff]"><Globe2 className="size-[13px]"/></span><span><span className="block text-[10px] font-medium">Remote Work Allowed (isRemote)</span><span className="mt-[1px] block text-[9px] text-[#85858e]">Enable worldwide or distributed candidate applications</span></span></span>
              <input type="checkbox" checked={remote} onChange={(event) => setRemote(event.target.checked)} className="size-[14px] accent-[#6555ff]" aria-label="Remote work allowed" />
            </label>
            <div className="mt-[10px] grid gap-[10px] sm:grid-cols-2">
              <label className={labelClass} htmlFor="job-location">Job Location (location)<span className="relative block"><MapPin className="absolute left-[10px] top-[10px] size-[13px] text-[#aaaab2]"/><input id="job-location" name="location" required={!remote} disabled={remote} placeholder={remote ? "Remote" : "City, Country"} className={`${fieldClass} pl-[31px] disabled:opacity-60`} /></span></label>
              <label className={labelClass} htmlFor="job-deadline">Application Deadline (deadline)<span className="relative block"><CalendarDays className="absolute left-[10px] top-[10px] size-[13px] text-[#aaaab2]"/><input id="job-deadline" name="deadline" type="date" className={`${fieldClass} pl-[31px] [color-scheme:dark]`} /></span></label>
            </div>
            <div className="mt-[10px] grid gap-[10px] sm:grid-cols-3">
              <label className={labelClass} htmlFor="salary-min">Min Salary / Rate<span className="relative block"><Euro className="absolute left-[10px] top-[10px] size-[13px] text-[#aaaab2]"/><input id="salary-min" name="salaryMin" type="number" min="0" placeholder="e.g. 25" className={`${fieldClass} pl-[31px]`} /></span></label>
              <label className={labelClass} htmlFor="salary-max">Max Salary / Rate<span className="relative block"><Euro className="absolute left-[10px] top-[10px] size-[13px] text-[#aaaab2]"/><input id="salary-max" name="salaryMax" type="number" min="0" placeholder="e.g. 40" className={`${fieldClass} pl-[31px]`} /></span></label>
              <label className={labelClass} htmlFor="salary-frequency">Frequency<span className="relative block"><select id="salary-frequency" name="frequency" defaultValue="per month" className={`${fieldClass} appearance-none pr-8`}><option>per month</option><option>per year</option><option>per hour</option></select><ChevronDown className="pointer-events-none absolute right-[10px] top-[10px] size-[13px] text-[#aaaab2]"/></span></label>
            </div>
          </section>

          {/* সেকশন ৩: দায়িত্ব, যোগ্যতা এবং ফর্মের Cancel/Publish action। */}
          <section className="rounded-[12px] border border-[#19191c] bg-[#151515] p-[15px] sm:px-[17px] sm:py-[16px]">
            <SectionTitle>3. Responsibilities &amp; Requirements</SectionTitle>
            <label className={labelClass} htmlFor="responsibilities">Key Responsibilities <span className="text-[#8c7dff]">*</span></label>
            <textarea id="responsibilities" name="responsibilities" required rows={3} placeholder="Describe the key responsibilities for this role..." className="mt-1.5 block min-h-[65px] w-full resize-y rounded-[9px] border border-transparent bg-[#202023] px-[11px] py-[10px] text-[10px] leading-[16px] text-[#e5e5e7] outline-none placeholder:text-[#77777e] focus:border-[#6252ff]/70 focus:ring-2 focus:ring-[#6252ff]/15" />
            <label className={`${labelClass} mt-[10px] block`} htmlFor="qualifications">Qualifications &amp; Requirements <span className="text-[#8c7dff]">*</span></label>
            <textarea id="qualifications" name="qualifications" required rows={3} placeholder="List the experience, skills, and qualifications candidates need..." className="mt-1.5 block min-h-[65px] w-full resize-y rounded-[9px] border border-transparent bg-[#202023] px-[11px] py-[10px] text-[10px] leading-[16px] text-[#e5e5e7] outline-none placeholder:text-[#77777e] focus:border-[#6252ff]/70 focus:ring-2 focus:ring-[#6252ff]/15" />
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-3"><p role="status" className="text-[10px] text-[#96969f]">{submitMessage || "Fields marked with * are required."}</p><div className="flex gap-2"><Link href="/dashboard/recruiter/jobs" className="inline-flex h-[30px] items-center rounded-[8px] border border-white/10 px-3 text-[10px] text-[#c8c8ce] hover:bg-white/[0.05]">Cancel</Link><button type="submit" disabled={isSubmitting} className="inline-flex h-[30px] items-center gap-1.5 rounded-[8px] bg-[#5c4bff] px-3 text-[10px] font-medium hover:bg-[#7062ff] disabled:opacity-60"><CirclePlus className="size-3"/>{isSubmitting ? "Publishing…" : "Publish Job"}</button></div></div>
          </section>
        </form>
      </div>
    </div>
  );
}
