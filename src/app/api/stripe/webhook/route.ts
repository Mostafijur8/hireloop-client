import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { database } from '@/lib/mongodb';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return NextResponse.json({ error: 'Webhook is not configured.' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch (error) {
    console.error('Invalid Stripe webhook signature:', error);
    return NextResponse.json({ error: 'Invalid signature.' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
    const checkout = event.data.object as Stripe.Checkout.Session;
    const userId = checkout.metadata?.userId;
    if (checkout.mode === 'payment' && checkout.payment_status === 'paid' && userId) {
      await database.collection('payments').updateOne(
        { checkoutSessionId: checkout.id },
        { $setOnInsert: { checkoutSessionId: checkout.id, userId, paidAt: new Date(), amountTotal: checkout.amount_total, currency: checkout.currency } },
        { upsert: true },
      );
    }
  }

  return NextResponse.json({ received: true });
}
