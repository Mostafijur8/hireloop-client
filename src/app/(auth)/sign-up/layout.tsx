import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Create account | Hireloop",
  description: "Create your Hireloop account and find your next opportunity.",
};

export default function SignUpLayout({ children }: Readonly<{ children: ReactNode }>) {
  return children;
}
