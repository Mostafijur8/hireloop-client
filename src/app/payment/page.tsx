import Link from 'next/link';
import { Navbar } from '@/components/navbar';
import { CreditCard } from 'lucide-react';

export default function PaymentPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#09090b] px-4 py-12 text-white">
        <section className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#141416] p-7 text-center shadow-2xl shadow-black/30 sm:p-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-300/10 text-violet-200">
            <CreditCard className="size-6" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Continue applying</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            You have used your 5 free job applications. Payment is required before you can apply to
            more jobs.
          </p>
          <p className="mt-5 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-xs leading-5 text-zinc-500">
            Payment checkout is not configured yet. Contact the site administrator to enable
            payments.
          </p>
          <Link
            href="/brows-jobs"
            className="mt-6 inline-flex rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.05]"
          >
            Back to jobs
          </Link>
        </section>
      </main>
    </>
  );
}
