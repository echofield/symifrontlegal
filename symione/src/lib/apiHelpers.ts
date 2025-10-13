import { ApiError } from '../types/contracts';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL
  ? String((import.meta as any).env.VITE_API_BASE_URL).replace(/\/$/, '')
  : '';

function withBase(path: string): string {
  return API_BASE ? `${API_BASE}${path}` : path;
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    return await res.json();
  } catch {
    return { error: true, message: res.statusText };
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(withBase(path), { method: 'GET' });
  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  const res = await fetch(withBase(path), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (res.status === 429) {
    const resetTime = Number(res.headers.get('X-RateLimit-Reset') || 0);
    const remaining = Math.max(0, resetTime - Math.floor(Date.now() / 1000));
    throw {
      error: true,
      message: 'Rate limit exceeded',
      code: 'RATE_LIMIT',
      retryInSec: remaining,
    } as ApiError;
  }

  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function apiPatch<T>(path: string, body: any): Promise<T> {
  const res = await fetch(withBase(path), {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function downloadExport(
  text: string,
  format: 'pdf' | 'docx',
  meta?: { version?: string; author?: string; date?: string; review_status?: string }
): Promise<void> {
  const res = await fetch(withBase('/api/export'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contract_text: text, format, metadata: meta }),
  });

  if (!res.ok) throw await parseError(res);

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `contract.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function getRateLimitInfo(headers: Headers) {
  return {
    limit: Number(headers.get('X-RateLimit-Limit') || 0),
    remaining: Number(headers.get('X-RateLimit-Remaining') || 0),
    reset: Number(headers.get('X-RateLimit-Reset') || 0),
  };
}
