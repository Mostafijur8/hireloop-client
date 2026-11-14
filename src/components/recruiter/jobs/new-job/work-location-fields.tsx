import { CalendarDays, Globe2, MapPin } from "lucide-react";
import { fieldClass, labelClass } from "./form-styles";

type WorkLocationFieldsProps = {
  remote: boolean;
  onRemoteChange: (remote: boolean) => void;
};

/** Collects remote preference, location, and application deadline. */
export function WorkLocationFields({
  remote,
  onRemoteChange,
}: WorkLocationFieldsProps) {
  return (
    <>
      <label className="flex min-h-[43px] cursor-pointer items-center justify-between rounded-[9px] bg-[#202023] px-[11px] py-[7px]">
        <span className="flex items-center gap-[9px]">
          <span className="flex size-[25px] items-center justify-center rounded-full bg-[#302d49] text-[#c6c0ff]">
            <Globe2 className="size-[13px]" />
          </span>
          <span>
            <span className="block text-[12px] font-medium lg:text-[14px]">
              Remote Work Allowed (isRemote)
            </span>
            <span className="mt-[1px] block text-[11px] text-[#85858e] lg:text-[13px]">
              Enable worldwide or distributed candidate applications
            </span>
          </span>
        </span>
        <input
          type="checkbox"
          checked={remote}
          onChange={(event) => onRemoteChange(event.target.checked)}
          className="size-[14px] accent-[#6555ff]"
          aria-label="Remote work allowed"
        />
      </label>
      <div className="mt-[10px] grid gap-[10px] sm:grid-cols-2">
        <label className={labelClass} htmlFor="job-location">
          Job Location (location)
          <span className="relative block">
            <MapPin className="absolute left-[10px] top-[10px] size-[13px] text-[#aaaab2]" />
            <input
              id="job-location"
              name="location"
              required={!remote}
              disabled={remote}
              placeholder={remote ? "Remote" : "City, Country"}
              className={`${fieldClass} pl-[31px] disabled:opacity-60`}
            />
          </span>
        </label>
        <label className={labelClass} htmlFor="job-deadline">
          Application Deadline (deadline)
          <span className="relative block">
            <CalendarDays className="absolute left-[10px] top-[10px] size-[13px] text-[#aaaab2]" />
            <input
              id="job-deadline"
              name="deadline"
              type="date"
              required
              className={`${fieldClass} pl-[31px] [color-scheme:dark]`}
            />
          </span>
        </label>
      </div>
    </>
  );
}
