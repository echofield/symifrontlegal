import { z } from 'zod';
import { suggestContractFR } from '@/src/lib/ai';

const schema = z.object({
  description: z.string().min(10),
  budget: z.number().int().positive().optional(),
  roleA: z.string().optional(),
  roleB: z.string().optional(),
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: true });

  const draft = await suggestContractFR(body.data);
  res.status(200).json(draft);
}


