import { prisma } from '@/src/lib/prisma';
import { ContractStatus } from '@prisma/client';

// Creates a contract with milestones; computes total if not provided
export async function createContract(params: {
  title: string;
  payerId: string;
  payeeId: string;
  currency: string;
  termsJson: any;
  milestones: Array<{ title: string; description: string; amount: number; dueAt?: Date }>;
  totalAmount?: number;
}) {
  const total = params.totalAmount ?? params.milestones.reduce((s, m) => s + m.amount, 0);
  const slug = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  return prisma.contract.create({
    data: {
      slug,
      title: params.title,
      creatorId: params.payerId,
      payerId: params.payerId,
      payeeId: params.payeeId,
      currency: params.currency,
      totalAmount: total,
      termsJson: params.termsJson,
      status: ContractStatus.ACTIVE,
      milestones: {
        create: params.milestones.map((m) => ({
          title: m.title,
          description: m.description,
          amount: m.amount,
          dueAt: m.dueAt ?? null,
        })),
      },
    },
    include: { milestones: true },
  });
}

export async function getContract(id: string) {
  return prisma.contract.findUnique({ where: { id }, include: { milestones: true } });
}


