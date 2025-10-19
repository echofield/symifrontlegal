import { prisma } from '@/src/lib/prisma';
import { MilestoneStatus } from '@prisma/client';

export async function submitMilestone(milestoneId: string, proofs: Array<{ url: string; kind: string }>) {
  await prisma.$transaction(async (tx) => {
    await tx.proof.createMany({ data: proofs.map((p) => ({ ...p, milestoneId })) });
    await tx.milestone.update({
      where: { id: milestoneId },
      data: { status: MilestoneStatus.SUBMITTED, submittedAt: new Date() },
    });
  });
}

export async function approveMilestone(milestoneId: string) {
  const ms = await prisma.milestone.findUnique({ where: { id: milestoneId }, include: { contract: true } });
  if (!ms) throw new Error('Milestone not found');
  if (ms.status !== 'SUBMITTED') throw new Error('Milestone not submitted');

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status: MilestoneStatus.PAID, approvedAt: new Date() },
  });

  // Mark contract as completed when all milestones are paid
  const remaining = await prisma.milestone.count({ where: { contractId: ms.contractId, NOT: { status: MilestoneStatus.PAID } } });
  if (remaining === 0) {
    await prisma.contract.update({ where: { id: ms.contractId }, data: { status: 'COMPLETED' } as any });
  }

  // Payout log (manual step to be reconciled by ops)
  const payee = await prisma.user.findUnique({ where: { id: ms.contract.payeeId } });
  await prisma.payoutLog.create({
    data: { milestoneId, payeeEmail: payee?.email ?? 'unknown', amount: ms.amount, method: 'manual', status: 'pending' },
  });

  return { ok: true } as const;
}


