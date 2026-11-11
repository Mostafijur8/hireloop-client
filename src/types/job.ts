// Job create endpoint-এ পাঠানো তথ্যের TypeScript contract।
export type Job = {
  title: string;
  location: string;
  type: string;
  salaryRange: {
    min: string;
    max: string;
    currency: "BDT";
    period: "monthly";
  };
  description: string;
};
