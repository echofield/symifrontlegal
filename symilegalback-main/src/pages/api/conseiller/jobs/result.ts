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

  const artifacts = memoryQueue.listArtifacts(jobId);
  const success = job.status === 'completed' || job.status === 'partial';
  return res.status(200).json({ success, analysis: job.result, artifacts, status: job.status });
});


