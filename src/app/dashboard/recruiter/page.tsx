import { DashboardHome } from "@/features/dashboard/components/dashboard-home";

// Recruiter role-এর তথ্য দিয়ে shared dashboard component render করে।
export default function RecruiterDashboardPage() {
  return <DashboardHome role="recruiter" />;
}
