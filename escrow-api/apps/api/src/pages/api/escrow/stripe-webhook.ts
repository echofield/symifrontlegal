import type { NextApiRequest, NextApiResponse } from 'next';
import getRawBody from 'raw-body';
import { stripe } from '@/src/lib/stripe';
import { recordEscrowBatch } from '@/src/domain/escrow';

// Keep raw body for Stripe signature verification
export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  let event;
  try {
    const buf = await getRawBody(req);
    const sig = req.headers['stripe-signature'] as string;
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e: any) {
    // Never throw; return 400 to Stripe on signature errors
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as any;
      const contractId = pi.metadata?.contractId;
      if (contractId) {
        await recordEscrowBatch({
          contractId,
          amount: pi.amount_received ?? pi.amount,
          currency: pi.currency,
          paymentIntentId: pi.id,
          chargeId: pi.latest_charge ?? null,
        });
      }
    }
  } catch (err) {
    // Log if needed; respond 200 to avoid Stripe retries storm on non-critical errors
  }

  res.status(200).json({ received: true });
}


