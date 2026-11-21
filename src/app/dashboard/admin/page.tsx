import { DashboardHome } from "@/features/dashboard/components/dashboard-home";

// Admin role-এর তথ্য দিয়ে shared dashboard component render করে।
export default function AdminDashboardPage() {
  return <DashboardHome role="admin" />;
}
