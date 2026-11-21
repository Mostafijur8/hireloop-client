import { getSession } from '@/core/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { database } from '@/lib/mongodb';
import { stripe } from '@/lib/stripe';

// Stripe পেমেন্ট শেষ হওয়ার পর ব্যবহারকারী এই পেজে ফেরত আসে।
export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  // URL-এর session_id দিয়ে Stripe Checkout সেশনটি শনাক্ত করা হয়।
  const { session_id: sessionId } = await searchParams;
  // সেশন আইডি না থাকলে payment পেজে ফেরত পাঠানো হয়।
  if (!sessionId) redirect('/payment');

  // লগইন করা ব্যবহারকারীর তথ্য যাচাই করা হয়।
  const userSession = await getSession();
  if (!userSession?.user) redirect('/sign-in?callbackUrl=%2Fpayment');

  // Stripe থেকে সেশনের আসল তথ্য আনা হয়; ব্যর্থ হলে payment পেজে ফেরত যায়।
  let checkout: Awaited<ReturnType<typeof stripe.checkout.sessions.retrieve>>;
  try {
    checkout = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error('Could not verify completed checkout:', error);
    redirect('/payment');
  }
  // সেশনটি এই ব্যবহারকারীর কি না এবং এটি এককালীন payment কি না যাচাই করা হয়।
  if (checkout.metadata?.userId !== userSession.user.id || checkout.mode !== 'payment')
    redirect('/payment');

  // Stripe payment সম্পন্ন বলেছে কি না, তা পরীক্ষা করা হয়।
  const paid = checkout.payment_status === 'paid';
  // Checkout email না থাকলে logged-in account-এর email ব্যবহার করি।
  const customerEmail = checkout.customer_details?.email ?? userSession.user.email;

  if (paid) {
    // পেমেন্টের রেকর্ড একবারই সংরক্ষণ হয়; একই সেশন আবার এলে duplicate তৈরি হয় না।
    // ??? checkout-?? customer ???? user-?? payment record-? ?????? ????.
    await database.collection('payments').updateOne(
      { checkoutSessionId: checkout.id },
      {
        $setOnInsert: {
          email: customerEmail,
          customerName: checkout.customer_details?.name ?? userSession.user.name ?? '',
          userId: userSession.user.id,
          checkoutSessionId: checkout.id,
          paidAt: new Date(),
          amountTotal: checkout.amount_total,
          currency: checkout.currency,
          transactionId: checkout.payment_intent,
        },
      },
      { upsert: true },
    );
    console.log(`Payment recorded for user: ${customerEmail},transactionId: ${checkout.payment_intent}, amount: ${checkout.amount_total} ,Id: ${checkout.id}`);
  }

  // পেমেন্টের অবস্থা অনুযায়ী বার্তা দেখায় এবং job browse করার লিংক দেয়।
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 text-white">
      <section className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#141416] p-8 text-center">
        <h1 className="text-2xl font-semibold">
          {paid ? 'Payment confirmed' : 'Payment is processing'}
        </h1>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {paid
            ? 'You can now continue applying for jobs.'
            : 'We have not received confirmation yet. Refresh this page in a moment.'}
        </p>
        <Link
          href="/brows-jobs"
          className="mt-6 inline-flex rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900"
        >
          Browse jobs
        </Link>
      </section>
    </main>
  );
}
