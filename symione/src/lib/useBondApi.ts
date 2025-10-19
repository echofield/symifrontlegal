export async function bondFetch<T = any>(url: string, options?: RequestInit): Promise<T> {
  // Ensure URL points to the correct backend
  const baseUrl = 'https://symilegalback.vercel.app';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  const res = await fetch(fullUrl, {
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
  getContracts: () => bondFetch<{ success: boolean; contracts: any[] }>(`/api/bond/contracts`),
  getMilestones: () => bondFetch<{ success: boolean; milestones: any[] }>(`/api/bond/milestones`),
  getPayments: () => bondFetch<{ success: boolean; payments: any[] }>(`/api/bond/payments`),
  createContract: (payload: any) => bondFetch(`/api/bond/contracts`, { method: 'POST', body: JSON.stringify(payload) }),
  createMilestone: (payload: any) => bondFetch(`/api/bond/milestones`, { method: 'POST', body: JSON.stringify(payload) }),
  createPayment: (payload: any) => bondFetch(`/api/bond/payments`, { method: 'POST', body: JSON.stringify(payload) }),
};


