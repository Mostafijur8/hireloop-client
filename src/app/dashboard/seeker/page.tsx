import { DashboardHome } from "@/features/dashboard/components/dashboard-home";

// Job seeker role-এর তথ্য দিয়ে shared dashboard component render করে।
export default function SeekerPage() {
  return <DashboardHome role="seeker" />;
}
