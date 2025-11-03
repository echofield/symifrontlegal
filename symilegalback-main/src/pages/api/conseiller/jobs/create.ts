import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { withCors } from '@/lib/http/cors';
import { memoryQueue } from '@/lib/queue/memory';

const CreateSchema = z.object({
  problem: z.string().min(20, 'Veuillez décrire votre situation (≥ 20 caractères).'),
  city: z.string().optional(),
  category: z.string().optional(),
  urgency: z.number().optional(),
  hasEvidence: z.boolean().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  tier: z.enum(['standard','premium']).optional(),
});

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: true, message: 'Method not allowed' });

  // Feature flag
  const enabled = String(process.env.LEGAL_AUDIT_V2_ASYNC || 'false') === 'true';
  if (!enabled) {
    return res.status(200).json({ success: false, error: 'Async pipeline disabled', code: 'ASYNC_DISABLED' });
  }

  const parsed = CreateSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: true, code: 'VALIDATION_ERROR', details: parsed.error.flatten() });
  }

  const payload = parsed.data;
  const { jobId } = memoryQueue.enqueue('conseiller_audit_v2', payload, { tier: payload.tier });

  return res.status(200).json({ jobId, status: 'queued' });
});


