import { prisma } from '@/src/lib/prisma';

// Record a deposit held in platform escrow (Stripe PI)
export async function recordEscrowBatch(params: {
  contractId: string;
  amount: number;
  currency: string;
  paymentIntentId: string;
  chargeId?: string | null;
}) {
  return prisma.escrowBatch.create({
    data: {
      contractId: params.contractId,
      amount: params.amount,
      currency: params.currency,
      paymentIntentId: params.paymentIntentId,
      chargeId: params.chargeId ?? null,
    },
  });
}


