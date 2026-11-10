"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Building2, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createjob } from "@/lib/action/jobs";
import type { Job } from "@/types/job";

const inputClassName =
  "mt-2 h-11 rounded-xl border-white/10 bg-white/[0.035] px-3.5 text-sm text-white placeholder:text-zinc-600 focus-visible:border-violet-400/60 focus-visible:ring-violet-400/20";
const labelClassName = "text-sm font-medium text-zinc-200";

export default function NewJobsPage() {
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitMessage("");
    setIsSubmitting(true);

    const formData = new FormData(form);
    const job: Job = {
      title: String(formData.get("title") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      type: String(formData.get("type") ?? ""),
      salaryRange: {
        min: String(formData.get("salaryMin") ?? "").trim(),
        max: String(formData.get("salaryMax") ?? "").trim(),
        currency: "BDT",
        period: "monthly",
      },
      description: String(formData.get("description") ?? "").trim(),
    };

    try {
      await createjob(job);
      setSubmitMessage("Job published successfully.");
      form.reset();
    } catch (error) {
      setSubmitMessage(error instanceof Error ? error.message : "Could not publish the job.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[calc(100svh-3rem)] bg-[#050507] px-5 py-8 text-white sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Button
          render={<Link href="/dashboard/recruiter/jobs" />}
          variant="ghost"
          className="-ml-2 h-8 rounded-lg px-2 text-zinc-400 hover:bg-white/[0.05] hover:text-white"
        >
          <ArrowLeft />
          Manage jobs
        </Button>

        <header className="mb-8 mt-6">
          <p className="text-xs font-semibold tracking-[0.2em] text-violet-300">
            RECRUITER WORKSPACE
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create a job post</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Share the role details to help the right candidates find your team.
          </p>
        </header>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <form onSubmit={handleSubmit} className="space-y-7 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5 sm:p-7">
            <section className="space-y-5">
              <div>
                <h2 className="font-medium">Job details</h2>
                <p className="mt-1 text-xs text-zinc-500">Start with the basics of the role.</p>
              </div>
              <div>
                <label htmlFor="job-title" className={labelClassName}>Job title</label>
                <Input id="job-title" name="title" placeholder="e.g. Senior Product Designer" required className={inputClassName} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="job-location" className={labelClassName}>Location</label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-500" />
                    <Input id="job-location" name="location" placeholder="City or remote" required className={`${inputClassName} pl-9`} />
                  </div>
                </div>
                <div>
                  <label htmlFor="job-type" className={labelClassName}>Employment type</label>
                  <select
                    id="job-type"
                    name="type"
                    defaultValue=""
                    required
                    className={`${inputClassName} block w-full appearance-none`}
                  >
                    <option value="" disabled className="bg-[#111114]">Select a type</option>
                    <option className="bg-[#111114]">Full-time</option>
                    <option className="bg-[#111114]">Part-time</option>
                    <option className="bg-[#111114]">Contract</option>
                    <option className="bg-[#111114]">Internship</option>
                  </select>
                </div>
              </div>
              <div>
                <p className={labelClassName}>Monthly salary range (BDT)</p>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="job-salary-min" className="sr-only">Minimum monthly salary</label>
                    <Input
                      id="job-salary-min"
                      name="salaryMin"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="Minimum (e.g. 50000)"
                      className={inputClassName}
                    />
                  </div>
                  <div>
                    <label htmlFor="job-salary-max" className="sr-only">Maximum monthly salary</label>
                    <Input
                      id="job-salary-max"
                      name="salaryMax"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="Maximum (e.g. 80000)"
                      className={inputClassName}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label htmlFor="job-description" className={labelClassName}>Description</label>
                <textarea
                  id="job-description"
                  name="description"
                  rows={7}
                  required
                  placeholder="Describe the role, responsibilities, and qualifications..."
                  className="mt-2 block w-full resize-y rounded-xl border border-white/10 bg-white/[0.035] px-3.5 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus-visible:border-violet-400/60 focus-visible:ring-3 focus-visible:ring-violet-400/20"
                />
              </div>
            </section>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-5">
              <p role="status" className="text-xs text-zinc-500">{submitMessage || "Job details will be saved to your account."}</p>
              <Button type="submit" disabled={isSubmitting} className="h-10 rounded-xl bg-violet-500 px-4 text-white">
               {isSubmitting ? "Publishing…" : "Publish job"}
              </Button>
            </div>
          </form>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-violet-300/10 bg-gradient-to-br from-violet-500/[0.12] to-transparent p-5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-violet-300/10 text-violet-200">
                <Sparkles className="size-4" />
              </span>
              <h2 className="mt-4 font-medium">Make your post stand out</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Clear responsibilities and realistic requirements help candidates understand the opportunity.
              </p>
            </div>
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
                <Building2 className="size-4 text-zinc-400" />
                Before publishing
              </div>
              <ul className="mt-4 space-y-3 text-xs leading-5 text-zinc-500">
                <li>Use a specific, easy-to-understand job title.</li>
                <li>Include location and employment type.</li>
                <li>Describe the role and what candidates need.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
