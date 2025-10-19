import { z } from 'zod';
import { approveMilestone } from '@/src/domain/milestones';

const schema = z.object({ milestoneId: z.string() });

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: true });

  const out = await approveMilestone(parsed.data.milestoneId);
  res.status(200).json(out);
}


