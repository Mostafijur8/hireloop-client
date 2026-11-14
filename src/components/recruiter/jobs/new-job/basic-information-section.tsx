import { Building2, ChevronDown } from "lucide-react";
import { JOB_TYPES, type JobType } from "@/types/job";
import { fieldClass, labelClass } from "./form-styles";
import { JobFormSection } from "./job-form-section";

type BasicInformationSectionProps = {
  jobType: JobType;
  onJobTypeChange: (type: JobType) => void;
};

/** Collects role, employer, category, and employment type information. */
export function BasicInformationSection({
  jobType,
  onJobTypeChange,
}: BasicInformationSectionProps) {
  return (
    <JobFormSection title="1. Basic Information">
      <label className={labelClass} htmlFor="job-title">
        Job Title <span className="text-[#8c7dff]">*</span>
      </label>
      <input id="job-title" name="title" required placeholder="e.g. Frontend Developer" className={fieldClass} />
      <div className="mt-[10px] grid gap-[10px] sm:grid-cols-2">
        <label className={labelClass} htmlFor="company-name">
          Company Name <span className="text-[#8c7dff]">*</span>
          <span className="relative block">
            <Building2 className="absolute left-[10px] top-[10px] size-[13px] text-[#aaaab2]" />
            <input id="company-name" name="company" required defaultValue="HirePulse Network" className={`${fieldClass} mt-1.5 pl-[31px]`} />
          </span>
        </label>
        <label className={labelClass} htmlFor="job-category">
          Job Category <span className="text-[#8c7dff]">*</span>
          <span className="relative block">
            <select id="job-category" name="category" required defaultValue="Engineering & Tech" className={`${fieldClass} appearance-none pr-8`}>
              <option>Engineering &amp; Tech</option><option>Design</option><option>Marketing</option><option>Sales</option><option>Operations</option><option>Customer Support</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-[10px] top-[10px] size-[13px] text-[#aaaab2]" />
          </span>
        </label>
      </div>
      <fieldset className="mt-[10px]">
        <legend className={labelClass}>Job Type <span className="text-[#8c7dff]">*</span></legend>
        <div className="mt-[6px] grid grid-cols-2 gap-[4px] sm:grid-cols-4">
          {JOB_TYPES.map((type) => (
            <button key={type} type="button" onClick={() => onJobTypeChange(type)} className={`h-[36px] rounded-[9px] border text-[12px] transition lg:h-[42px] lg:text-[14px] ${jobType === type ? "border-[#5547e8] bg-[#222126] text-white" : "border-transparent bg-[#202023] text-[#9999a2] hover:text-white"}`}>
              {type}
            </button>
          ))}
        </div>
      </fieldset>
    </JobFormSection>
  );
}
