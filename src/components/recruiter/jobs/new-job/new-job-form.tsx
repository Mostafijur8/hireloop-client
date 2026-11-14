"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/toast-provider";
import { createjob } from "@/lib/action/jobs";
import type { Job, JobType } from "@/types/job";
import { BasicInformationSection } from "./basic-information-section";
import { LocationCompensationSection } from "./location-compensation-section";
import { ResponsibilitiesSection } from "./responsibilities-section";

/** Owns job submission state and composes the feature's form sections. */
export default function NewJobForm() {
  const { toast } = useToast();
  const [submitMessage, setSubmitMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [jobType, setJobType] = useState<JobType>("Full-time");
  const [remote, setRemote] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitMessage("");
    setIsSubmitting(true);
    const formData = new FormData(form);
    const responsibilities = String(
      formData.get("responsibilities") ?? "",
    ).trim();
    const qualifications = String(formData.get("qualifications") ?? "").trim();
    const job: Job = {
      title: String(formData.get("title") ?? "").trim(),
      companyName: String(formData.get("company") ?? "").trim(),
      location: remote
        ? "Remote"
        : String(formData.get("location") ?? "").trim(),
      type: jobType,
      deadline: String(formData.get("deadline") ?? "") || undefined,
      salaryRange: {
        min: String(formData.get("salaryMin") ?? "").trim(),
        max: String(formData.get("salaryMax") ?? "").trim(),
        currency: "BDT",
        period: "monthly",
      },
      description: [
        responsibilities,
        qualifications && `Qualifications & Requirements\n${qualifications}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    };

    try {
      await createjob(job);
      setSubmitMessage("Job published successfully.");
      toast("Job published successfully.", "success");
      form.reset();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not publish the job.";
      setSubmitMessage(message);
      toast(message, "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100svh-3rem)] flex-1 bg-[#121212] px-4 pb-10 pt-5 text-white sm:px-5 lg:px-4">
      <div className="mx-auto max-w-[920px]">
        <div className="mb-[5px] flex items-center gap-[6px] text-[11px] text-[#888891] lg:text-[13px]">
          <Link href="/dashboard/recruiter/jobs" className="hover:text-white">
            Manage Jobs
          </Link>
          <span>›</span>
          <span className="text-[#d4d0ff]">Create New Listing</span>
        </div>
        <header className="mb-[26px] flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[21px] font-medium leading-[27px] tracking-[-.035em] lg:text-[30px] lg:leading-[36px]">
              Post a New Job
            </h1>
            <p className="mt-[2px] text-[12px] text-[#92929b] lg:text-[15px]">
              Fill in the position specifications to attract qualified talent
              across our network.
            </p>
          </div>
          <button
            type="submit"
            form="new-job-form"
            disabled={isSubmitting}
            className="inline-flex h-[36px] shrink-0 items-center gap-[6px] rounded-[9px] bg-[#5c4bff] px-[13px] text-[12px] font-medium shadow-[0_4px_14px_rgba(76,61,255,.2)] hover:bg-[#7062ff] disabled:opacity-60 lg:h-[42px] lg:text-[14px]"
          >
            {isSubmitting ? "Publishing…" : "Publish Job"}
            <ArrowRight className="size-[13px]" />
          </button>
        </header>
        <form
          id="new-job-form"
          onSubmit={handleSubmit}
          className="space-y-[14px]"
        >
          <BasicInformationSection
            jobType={jobType}
            onJobTypeChange={setJobType}
          />
          <LocationCompensationSection
            remote={remote}
            onRemoteChange={setRemote}
          />
          <ResponsibilitiesSection
            submitMessage={submitMessage}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </main>
  );
}
