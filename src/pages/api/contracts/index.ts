import type { NextApiRequest, NextApiResponse } from 'next';

const UPSTREAM_BASE = (process.env.NEXT_PUBLIC_API_URL || process.env.API_BASE_URL || '').replace(/\/$/, '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!UPSTREAM_BASE) {
    return res.status(500).json({ error: true, message: 'API base URL not configured (set NEXT_PUBLIC_API_URL or API_BASE_URL).' });
  }

  const url = `${UPSTREAM_BASE}/api/contracts${req.url?.includes('?') ? req.url?.slice(req.url.indexOf('?')) : ''}`;

  try {
    const upstream = await fetch(url, { method: 'GET' });
    const text = await upstream.text();
    const contentType = upstream.headers.get('content-type') || 'application/json';
    res.status(upstream.status).setHeader('content-type', contentType).send(text);
  } catch (err: any) {
    res.status(502).json({ error: true, message: err?.message || 'Upstream fetch failed' });
  }
}


