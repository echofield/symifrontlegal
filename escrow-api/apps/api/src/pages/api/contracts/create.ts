import { z } from 'zod';
import { createContract } from '@/src/domain/contracts';

const msSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  amount: z.number().int().positive(),
  dueAt: z.string().datetime().optional(),
});

const schema = z.object({
  title: z.string().min(3),
  payerId: z.string(),
  payeeId: z.string(),
  currency: z.string().min(3),
  termsJson: z.any(),
  milestones: z.array(msSchema).min(1),
  totalAmount: z.number().int().positive().optional(),
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: true, issues: body.error.issues });

  const { title, payerId, payeeId, currency, termsJson, milestones, totalAmount } = body.data;
  const created = await createContract({
    title,
    payerId,
    payeeId,
    currency,
    termsJson,
    milestones: milestones.map((m) => ({ ...m, dueAt: m.dueAt ? new Date(m.dueAt) : undefined })),
    totalAmount,
  });
  res.status(200).json(created);
}


