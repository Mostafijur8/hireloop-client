"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  Eye,
  EyeOff,
  LoaderCircle,
  ShieldCheck,
} from "lucide-react";
import logo from "@/images/logo.png";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/components/toast-provider";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const { toast } = useToast();
  const router = useRouter();
  // Submit state, password visibility ও validation/server error সংরক্ষণ করে।
  const [pending, setPending] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  // Email/password Better Auth-এ পাঠায় এবং সফল হলে home page খোলে।
  async function handleSignIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const form = new FormData(event.currentTarget);

    try {
      const { error } = await authClient.signIn.email({
        email: String(form.get("email") ?? "").trim(),
        password: String(form.get("password") ?? ""),
        rememberMe: true,
        callbackURL: "/",
      });

      if (error) {
        const message = error.message ?? "Sign in failed. Please try again.";
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07070a] px-4 py-10 text-white sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 size-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-700/10 blur-[140px]"
      />
      <Link
        href="/"
        className="absolute left-5 top-5 inline-flex items-center gap-2 text-xs text-zinc-400 transition-colors hover:text-white sm:left-8 sm:top-8"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>
      {/* বড় স্ক্রিনে পরিচিতিমূলক panel এবং সব স্ক্রিনে sign-in form দেখায়। */}
      <div className="relative grid w-full max-w-[920px] overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d11] shadow-[0_30px_100px_rgba(0,0,0,0.5)] md:grid-cols-[0.9fr_1.1fr]">
        <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-white/10 bg-[radial-gradient(ellipse_at_20%_0%,rgba(98,75,245,0.24),transparent_48%),#0a0a0e] p-9 md:flex lg:p-12">
          <div className="relative z-10">
            <Link href="/" aria-label="Hireloop home">
              <Image
                src={logo}
                alt="Hireloop"
                width={130}
                height={34}
                priority
              />
            </Link>
            <div className="mt-20 max-w-xs">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-violet-300">
                Welcome back
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.04em]">
                Great to have you back.
              </h1>
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                Pick up where you left off and keep moving toward your next
                opportunity.
              </p>
            </div>
          </div>
          <div className="relative z-10 space-y-4 text-xs text-zinc-400">
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-violet-300">
                <BriefcaseBusiness className="size-4" />
              </span>
              Find roles that match your goals
            </div>
            <div className="flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-violet-300">
                <ShieldCheck className="size-4" />
              </span>
              Your information stays protected
            </div>
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-40 -right-24 size-80 rounded-full border border-violet-400/10 shadow-[0_0_100px_rgba(104,83,255,0.16)]"
          />
        </aside>
        <section className="p-6 sm:p-10 lg:p-12">
          <div className="mb-8 md:hidden">
            <Link href="/" aria-label="Hireloop home">
              <Image
                src={logo}
                alt="Hireloop"
                width={120}
                height={32}
                priority
              />
            </Link>
          </div>
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-violet-300">
              Account access
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.035em]">
              Sign in to Hireloop
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Enter your details to continue.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSignIn}>
            <label className="block space-y-2 text-sm font-medium text-zinc-200">
              Email address
              <input
                autoComplete="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/15"
              />
            </label>
            <label className="block space-y-2 text-sm font-medium text-zinc-200">
              Password
              <span className="relative block">
                <input
                  autoComplete="current-password"
                  name="password"
                  type={passwordVisible ? "text" : "password"}
                  minLength={8}
                  required
                  placeholder="Enter your password"
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 pr-12 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400/60 focus:ring-2 focus:ring-violet-500/15"
                />
                <button
                  type="button"
                  aria-label={
                    passwordVisible ? "Hide password" : "Show password"
                  }
                  aria-pressed={passwordVisible}
                  onClick={() => setPasswordVisible((value) => !value)}
                  className="absolute right-1.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {passwordVisible ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </span>
            </label>
            {error ? (
              <p
                role="alert"
                className="rounded-lg border border-red-500/20 bg-red-500/[0.07] px-3 py-2 text-sm text-red-300"
              >
                {error}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={pending}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#6955f5] text-sm font-medium text-white shadow-[0_4px_20px_rgba(105,85,245,0.2)] hover:bg-[#7968ff] disabled:pointer-events-none disabled:opacity-50"
            >
              {pending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>
          <p className="mt-7 text-center text-sm text-zinc-400">
            New to Hireloop?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-violet-300 hover:text-violet-200"
            >
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
