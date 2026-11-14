"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/app/(auth)/auth-form";
import { AuthShell } from "@/app/(auth)/auth-shell";
import { useToast } from "@/components/toast-provider";
import { authClient } from "@/lib/auth-client";

/** Handles email sign-in state and composes the shared authentication UI. */
export default function SignInPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const { error: signInError } = await authClient.signIn.email({
        email: String(form.get("email") ?? "").trim(),
        password: String(form.get("password") ?? ""),
        rememberMe: true,
        callbackURL: "/",
      });
      if (signInError) {
        const message = signInError.message ?? "Sign in failed. Please try again.";
        setError(message);
        toast(message, "error");
      } else {
        toast("Signed in successfully.", "success");
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
    <AuthShell sideEyebrow="Welcome back" sideTitle="Great to have you back." sideDescription="Pick up where you left off and keep moving toward your next opportunity." eyebrow="Account access" title="Sign in to Hireloop" description="Enter your details to continue." footer={<p className="mt-7 text-center text-sm text-zinc-400">New to Hireloop? <Link href="/sign-up" className="font-medium text-violet-300 hover:text-violet-200">Create an account</Link></p>}>
      <AuthForm mode="sign-in" pending={pending} error={error} passwordVisible={passwordVisible} onPasswordVisibilityChange={() => setPasswordVisible((value) => !value)} onSubmit={handleSignIn} />
    </AuthShell>
  );
}
