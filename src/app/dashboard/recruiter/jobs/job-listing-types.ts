import type { ComponentType } from "react";
import type { JobRecord } from "@/features/jobs/types";

/** Extends API job data with optional display-only icon metadata. */
export type JobListing = JobRecord & {
  icon?: ComponentType<{ className?: string }>;
};
