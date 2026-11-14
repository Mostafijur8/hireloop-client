import { Activity, BriefcaseBusiness, Building2, ClipboardCheck, FileText, Search, ShieldCheck, Users, UserRound, type LucideIcon } from "lucide-react";

/** Roles supported by the dashboard landing experience. */
export type DashboardRole = "admin" | "recruiter" | "seeker";
export type DashboardCopy = {
  eyebrow: string; dashboardTitle: string; title: string; description: string;
  icon: LucideIcon; stats: { label: string; detail: string; icon: LucideIcon }[];
  sectionTitle: string; sectionDescription: string;
  tips: { title: string; description: string; icon: LucideIcon }[];
};

/** Copy and icon choices for each role-specific dashboard. */
export const dashboardContent: Record<DashboardRole, DashboardCopy> = {
  seeker: {
    eyebrow: "CANDIDATE SPACE", dashboardTitle: "Seeker Dashboard", title: "Your next chapter starts here.",
    description: "Keep your career journey moving. Your applications, saved roles, and profile updates will live here.", icon: UserRound,
    stats: [{ label: "Applications", detail: "Track the roles you apply to", icon: FileText }, { label: "Saved jobs", detail: "Keep interesting roles close", icon: BriefcaseBusiness }, { label: "Profile", detail: "Build a stronger first impression", icon: UserRound }],
    sectionTitle: "Make your next move", sectionDescription: "A few ways to get started with your HireLoop space.",
    tips: [{ title: "Shape your profile", description: "Add your experience and the work you want to do next.", icon: UserRound }, { title: "Explore opportunities", description: "Find roles that match your skills and goals.", icon: Search }, { title: "Stay organized", description: "Keep your job search progress in one place.", icon: ClipboardCheck }],
  },
  recruiter: {
    eyebrow: "RECRUITER SPACE", dashboardTitle: "Recruiter Dashboard", title: "Build a team that moves you forward.",
    description: "Your hiring workspace keeps roles, candidates, and team activity together as you grow.", icon: BriefcaseBusiness,
    stats: [{ label: "Open positions", detail: "Keep your hiring needs organized", icon: BriefcaseBusiness }, { label: "Candidates", detail: "Stay close to promising talent", icon: Users }, { label: "Hiring activity", detail: "Follow progress across your team", icon: Activity }],
    sectionTitle: "Your hiring workflow", sectionDescription: "Set up a clear path from a new role to the right hire.",
    tips: [{ title: "Define the role", description: "Make the responsibilities and requirements clear.", icon: FileText }, { title: "Find your people", description: "Bring promising candidates into one workspace.", icon: Search }, { title: "Keep your team aligned", description: "Give everyone a shared view of hiring progress.", icon: Users }],
  },
  admin: {
    eyebrow: "ADMIN SPACE", dashboardTitle: "Admin Dashboard", title: "A clearer view of your platform.",
    description: "Your admin workspace brings platform health, account activity, and hiring operations into view.", icon: ShieldCheck,
    stats: [{ label: "People", detail: "Review platform accounts", icon: Users }, { label: "Organizations", detail: "Keep employer spaces in view", icon: Building2 }, { label: "Platform activity", detail: "Monitor what is happening", icon: Activity }],
    sectionTitle: "Platform overview", sectionDescription: "Keep the important parts of HireLoop easy to find.",
    tips: [{ title: "People and access", description: "Keep account roles and access organized.", icon: Users }, { title: "Employer spaces", description: "Review the organizations using HireLoop.", icon: Building2 }, { title: "Platform operations", description: "Stay aware of activity across the platform.", icon: ClipboardCheck }],
  },
};
