import { ChevronDown, Euro } from "lucide-react";
import { fieldClass, labelClass } from "./form-styles";

/** Collects the salary range and its currently supported display frequency. */
export function CompensationFields() {
  return (
    <div className="mt-[10px] grid gap-[10px] sm:grid-cols-3">
      <label className={labelClass} htmlFor="salary-min">Min Salary / Rate<span className="relative block"><Euro className="absolute left-[10px] top-[10px] size-[13px] text-[#aaaab2]" /><input id="salary-min" name="salaryMin" type="number" min="0" required placeholder="e.g. 25" className={`${fieldClass} pl-[31px]`} /></span></label>
      <label className={labelClass} htmlFor="salary-max">Max Salary / Rate<span className="relative block"><Euro className="absolute left-[10px] top-[10px] size-[13px] text-[#aaaab2]" /><input id="salary-max" name="salaryMax" type="number" min="0" required placeholder="e.g. 40" className={`${fieldClass} pl-[31px]`} /></span></label>
      <label className={labelClass} htmlFor="salary-frequency">Frequency<span className="relative block"><select id="salary-frequency" name="frequency" required defaultValue="per month" className={`${fieldClass} appearance-none pr-8`}><option>per month</option><option>per year</option><option>per hour</option></select><ChevronDown className="pointer-events-none absolute right-[10px] top-[10px] size-[13px] text-[#aaaab2]" /></span></label>
    </div>
  );
}
