import type { JobListing } from "./job-listing-types";
import { JobListingRow } from "./job-listing-row";

const columnWidths = ["20%", "16%", "8%", "11%", "12%", "8%", "13%", "12%"];
const headings = [
  "Job Title & Dept",
  "Company & Location",
  "Type",
  "Compensation",
  "Applicants",
  "Status",
  "Deadline",
  "Actions",
];

/** Presents the jobs list with consistent headings and row rendering. */
export function JobListingsTable({
  jobs,
  onRemove,
}: {
  jobs: JobListing[];
  onRemove: (id: string) => void;
}) {
  return (
    <section
      aria-label="Job listings"
      className="overflow-x-auto rounded-[12px] border border-[#242427] bg-[#151515]"
    >
      <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
        <colgroup>
          {columnWidths.map((width, index) => (
            <col key={headings[index]} style={{ width }} />
          ))}
        </colgroup>
        <thead className="h-[42px] bg-[#101012] text-[8px] font-medium uppercase tracking-[.04em] text-[#a4a4ae] lg:text-[11px]">
          <tr>
            {headings.map((heading) => (
              <th key={heading} className="whitespace-nowrap px-[14px]">
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <JobListingRow key={job._id} job={job} onRemove={onRemove} />
          ))}
        </tbody>
      </table>
    </section>
  );
}
