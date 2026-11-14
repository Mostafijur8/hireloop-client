/** Job payload accepted by the existing job creation endpoint. */
export type Job = {
  title: string;
  companyName?: string;
  company?: string;
  location: string;
  type: string;
  deadline?: string;
  salaryRange: {
    min: string;
    max: string;
    currency: "BDT";
    period: "monthly";
  };
  description: string;
};

/** Values offered by the recruiter job creation form. */
export const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;
export type JobType = (typeof JOB_TYPES)[number];

/** Job records returned by the API may contain additional display metadata. */
export type JobRecord = {
  _id: string;
  title: string;
  companyName?: string;
  company?: string;
  department?: string;
  location?: string;
  remote?: boolean;
  type?: string;
  status?: string;
  salary?: string;
  salaryRange?: {
    min?: string;
    max?: string;
    currency?: string;
    period?: string;
  };
  applicants?: number;
  deadline?: string;
  createdAt?: string;
  posted?: string;
  color?: string;
  dept?: string;
};
