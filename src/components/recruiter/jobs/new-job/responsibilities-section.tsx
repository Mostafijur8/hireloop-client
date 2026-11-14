import Link from "next/link";
import { CirclePlus } from "lucide-react";
import { labelClass, textareaClass } from "./form-styles";
import { JobFormSection } from "./job-form-section";

type ResponsibilitiesSectionProps = {
  submitMessage: string;
  isSubmitting: boolean;
};

/** Collects job duties and qualifications, then shows form status/actions. */
export function ResponsibilitiesSection({
  submitMessage,
  isSubmitting,
}: ResponsibilitiesSectionProps) {
  return (
    <JobFormSection title="3. Responsibilities & Requirements">
      <label className={labelClass} htmlFor="responsibilities">
        Key Responsibilities <span className="text-[#8c7dff]">*</span>
      </label>
      <textarea
        id="responsibilities"
        name="responsibilities"
        required
        rows={3}
        placeholder="Describe the key responsibilities for this role..."
        className={textareaClass}
      />
      <label
        className={`${labelClass} mt-[10px] block`}
        htmlFor="qualifications"
      >
        Qualifications &amp; Requirements{" "}
        <span className="text-[#8c7dff]">*</span>
      </label>
      <textarea
        id="qualifications"
        name="qualifications"
        required
        rows={3}
        placeholder="List the experience, skills, and qualifications candidates need..."
        className={textareaClass}
      />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-3">
        <p role="status" className="text-[12px] text-[#96969f] lg:text-[14px]">
          {submitMessage || "Fields marked with * are required."}
        </p>
        <div className="flex gap-2">
          <Link
            href="/dashboard/recruiter/jobs"
            className="inline-flex h-[36px] items-center rounded-[8px] border border-white/10 px-3 text-[12px] text-[#c8c8ce] hover:bg-white/[0.05] lg:h-[42px] lg:text-[14px]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#5c4bff] px-3 text-[12px] font-medium hover:bg-[#7062ff] disabled:opacity-60 lg:h-[42px] lg:text-[14px]"
          >
            <CirclePlus className="size-3" />
            {isSubmitting ? "Publishing…" : "Publish Job"}
          </button>
        </div>
      </div>
    </JobFormSection>
  );
}
