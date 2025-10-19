export async function bondFetch<T = any>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    let msg = res.statusText;
    try { msg = await res.text(); } catch {}
    throw new Error(msg || `HTTP ${res.status}`);
  }
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json')) return res.json();
  // @ts-expect-error allow other types if needed (pdf later)
  return res.text();
}

export const BondAPI = {
  getTemplates: () => bondFetch<{ ok: boolean; templates: any[] }>(`/api/contracts/templates`),
  getQuestions: (id?: string) => bondFetch<{ ok: boolean; questions: any }>(
    id ? `/api/contracts/questions?id=${encodeURIComponent(id)}` : `/api/contracts/questions`
  ),
  suggest: (payload: any) => bondFetch(`/api/contracts/suggest`, { method: 'POST', body: JSON.stringify(payload) }),
  create: (payload: any) => bondFetch(`/api/contracts/create`, { method: 'POST', body: JSON.stringify(payload) }),
  intentCreate: (payload: any) => bondFetch(`/api/escrow/intent/create`, { method: 'POST', body: JSON.stringify(payload) }),
  submitMilestone: (payload: any) => bondFetch(`/api/escrow/milestone/submit`, { method: 'POST', body: JSON.stringify(payload) }),
  validateMilestone: (payload: any) => bondFetch(`/api/escrow/milestone/validate`, { method: 'POST', body: JSON.stringify(payload) }),
};


