import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create account | Hireloop",
  description: "Create your Hireloop account and find your next opportunity.",
};

// Sign-up route-এর জন্য পেজ metadata যোগ করে, children অপরিবর্তিত রাখে।
export default function SignUpLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
