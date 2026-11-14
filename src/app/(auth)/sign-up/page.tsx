"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/app/(auth)/auth-form";
import { AuthShell } from "@/app/(auth)/auth-shell";
import { useToast } from "@/components/toast-provider";
import { authClient } from "@/lib/auth-client";

type RequestedRole = "seeker" | "recruiter" | "admin";

/** Handles account creation and composes the shared authentication UI. */
export default function SignUpPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const { error: signUpError } = await authClient.signUp.email({
        name: String(form.get("name") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        password: String(form.get("password") ?? ""),
        role: String(form.get("requestedRole") ?? "seeker") as RequestedRole,
        callbackURL: "/",
      });
      if (signUpError) {
        const message = signUpError.message ?? "Signup failed. Please try again.";
        setError(message);
        toast(message, "error");
      } else {
        toast("Account created successfully.", "success");
        router.replace("/");
        router.refresh();
      }
    } catch {
      const message = "Couldn't connect. Please try again.";
      setError(message);
      toast(message, "error");
    } finally {
      setPending(false);
    }
  }

  return (
    <AuthShell sideEyebrow="Your next chapter" sideTitle="Make room for what&apos;s next." sideDescription="Create your profile and find opportunities that fit the way you want to grow." eyebrow="Get started" title="Create your account" description="Start your search for a better fit." footer={<><p className="mt-7 text-center text-sm text-zinc-400">Already have an account? <Link href="/sign-in" className="font-medium text-violet-300 hover:text-violet-200">Sign in</Link></p><p className="mt-5 text-center text-[11px] leading-5 text-zinc-600">By creating an account, you agree to Hireloop&apos;s terms and privacy policy.</p></>}>
      <AuthForm mode="sign-up" pending={pending} error={error} passwordVisible={passwordVisible} onPasswordVisibilityChange={() => setPasswordVisible((value) => !value)} onSubmit={handleSubmit} />
    </AuthShell>
  );
}
