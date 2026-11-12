// Job create endpoint-এ পাঠানো তথ্যের TypeScript contract।
export type Job = {
  title: string;
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
