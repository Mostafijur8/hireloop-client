import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sign in | Hireloop",
  description: "Sign in to your Hireloop account.",
};

// Sign-in route-এর জন্য পেজ metadata যোগ করে, children অপরিবর্তিত রাখে।
export default function SignInLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
