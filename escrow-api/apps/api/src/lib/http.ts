import type { NextApiResponse } from 'next';

export const ok = (res: NextApiResponse, data: any) => res.status(200).json(data);
export const err = (res: NextApiResponse, code: number, message: string, extra?: any) =>
  res.status(code).json({ error: true, message, ...(extra ?? {}) });


