import { getSession } from '@/lib/server/auth';
import { NextResponse } from 'next/server';
import { database } from '@/lib/mongodb';
import { stripe } from '@/lib/stripe';

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.redirect(new URL('/sign-in?callbackUrl=%2Fpayment', request.url), 303);
  }

  try {
    const existingPayment = await database.collection('payments').findOne({ userId: session.user.id });
    if (existingPayment) {
      return NextResponse.redirect(new URL('/brows-jobs', request.url), 303);
    }

    const checkout = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: 2000,
          product_data: {
            name: 'Hireloop Apply Plan',
            description: 'Unlock continued job applications after your 2 free applications.',
          },
        },
      }],
      client_reference_id: session.user.id,
      metadata: { userId: session.user.id },
      success_url: new URL('/checkout/success?session_id={CHECKOUT_SESSION_ID}', request.url).toString(),
      cancel_url: new URL('/payment?canceled=1', request.url).toString(),
    });

    if (!checkout.url) throw new Error('Stripe did not return a Checkout URL.');
    return NextResponse.redirect(checkout.url, 303);
  } catch (error) {
    console.error('Could not create Stripe Checkout session:', error);
    return NextResponse.json({ error: 'Could not start checkout. Please try again.' }, { status: 500 });
  }
}
