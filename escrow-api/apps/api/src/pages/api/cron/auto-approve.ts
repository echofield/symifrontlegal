import { prisma } from '@/src/lib/prisma';
import { MilestoneStatus } from '@prisma/client';

// Auto-approve milestones that have been in SUBMITTED for > 72 hours
const HOURS = 72;

export default async function handler(req: any, res: any) {
  const auth = req.headers.authorization ?? '';
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ error: true, message: 'Unauthorized' });

  const threshold = new Date(Date.now() - HOURS * 3600 * 1000);

  const toApprove = await prisma.milestone.findMany({
    where: { status: MilestoneStatus.SUBMITTED, submittedAt: { lte: threshold } },
    include: { contract: true },
  });

  for (const ms of toApprove) {
    await prisma.milestone.update({ where: { id: ms.id }, data: { status: MilestoneStatus.PAID, approvedAt: new Date() } });
  }

  res.status(200).json({ ok: true, autoApproved: toApprove.length });
}


