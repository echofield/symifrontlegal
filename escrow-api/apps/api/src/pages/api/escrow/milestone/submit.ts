import { z } from 'zod';
import { submitMilestone } from '@/src/domain/milestones';

const schema = z.object({
  milestoneId: z.string(),
  proofs: z.array(z.object({ url: z.string().url(), kind: z.enum(['file', 'link', 'note']) })),
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: true });

  await submitMilestone(body.data.milestoneId, body.data.proofs);
  res.status(200).json({ ok: true });
}


