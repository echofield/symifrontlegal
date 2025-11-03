import type { NextApiRequest, NextApiResponse } from 'next';
import { withCors } from '@/lib/http/cors';
import { memoryQueue } from '@/lib/queue/memory';

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: true, message: 'Method not allowed' });

  const enabled = String(process.env.LEGAL_AUDIT_V2_ASYNC || 'false') === 'true';
  if (!enabled) {
    return res.status(200).json({ success: false, error: 'Async pipeline disabled', code: 'ASYNC_DISABLED' });
  }

  const jobId = (req.query.id as string) || (req.query.jobId as string);
  if (!jobId) return res.status(400).json({ error: true, message: 'Missing jobId' });

  const job = memoryQueue.get(jobId);
  if (!job) return res.status(404).json({ error: true, message: 'Job not found' });

  const events = memoryQueue.listEvents(jobId);
  const completed = events.filter(e => e.status === 'succeeded').length;
  const steps = String(process.env.ASYNC_AGENT_STEPS || '').split(',').filter(Boolean);
  const total = steps.length || 7;
  const progress = Math.min(100, Math.round((completed / total) * 100));

  return res.status(200).json({ jobId, status: job.status, step: events.at(-1)?.step, progress, updatedAt: job.updatedAt });
});


