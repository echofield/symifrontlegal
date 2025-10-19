import Stripe from 'stripe';

// Single platform Stripe account
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});


