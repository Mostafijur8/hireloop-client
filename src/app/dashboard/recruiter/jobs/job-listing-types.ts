import type { ComponentType } from "react";
import type { JobRecord } from "@/types/job";

/** Extends API job data with optional display-only icon metadata. */
export type JobListing = JobRecord & {
  icon?: ComponentType<{ className?: string }>;
};
