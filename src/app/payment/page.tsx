import { getSession } from '@/core/server';
import { Navbar } from '@/components/navbar';
import { CreditCard } from 'lucide-react';
import Link from 'next/link';
import { database } from '@/lib/mongodb';

export default async function PaymentPage({ searchParams }: { searchParams: Promise<{ canceled?: string }> }) {
  const user = await getSession();
  const { canceled } = await searchParams;
  const hasPaidAccess = user?.user
    ? Boolean(await database.collection('payments').findOne({ userId: user.user.id }))
    : false;
  return (
    <>
      <Navbar />
      <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#09090b] px-4 py-12 text-white">
        <section className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#141416] p-7 text-center shadow-2xl shadow-black/30 sm:p-10">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-violet-300/20 bg-violet-300/10 text-violet-200">
            <CreditCard className="size-6" />
          </div>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight">Hireloop Apply Plan</h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            {hasPaidAccess
              ? 'Your payment is confirmed. You can continue applying to jobs.'
              : 'You have used your 2 free job applications. Payment is required before you can apply to more jobs.'}
          </p>
          <div className="mt-6 rounded-xl border border-violet-300/20 bg-violet-300/[0.06] px-5 py-5">
            <p className="text-4xl font-semibold tracking-tight">$20<span className="ml-1 text-base font-medium text-zinc-400">USD</span></p>
            <p className="mt-2 text-sm text-zinc-400">One-time payment to unlock continued applications</p>
          </div>
          {canceled === '1' && <p role="status" className="mt-4 text-sm text-amber-300">Checkout was canceled. You have not been charged.</p>}
          {!hasPaidAccess && <form action="/api/checkout_sessions" method="POST">
            <button
              type="submit"
              disabled={!user?.user}
              className="mt-6 inline-flex w-full justify-center rounded-lg bg-violet-300 px-4 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-violet-200 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Pay $20 and continue
            </button>
          </form>}
          {!user?.user && <Link href="/sign-in?callbackUrl=%2Fpayment" className="mt-3 inline-block text-sm text-violet-200 hover:text-white">Sign in first</Link>}
          <Link
            href="/brows-jobs"
            className="mt-3 inline-flex rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-white/[0.05]"
          >
            Back to jobs
          </Link>
        </section>
      </main>
    </>
  );
}
