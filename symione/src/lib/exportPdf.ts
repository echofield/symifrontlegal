export async function downloadContractPdf(params: {
  contractText: string;
  fileName?: string;
  htmlOverride?: string;
  metadata?: { version?: string; author?: string; date?: string; review_status?: string };
}) {
  const { contractText, fileName = 'contract.pdf', htmlOverride, metadata = { version: '1.0.0' } } = params;

  const base = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;
  const endpoint = base ? `${base.replace(/\/$/, '')}/api/export` : `/api/export`;

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contract_text: contractText, format: 'pdf', html: htmlOverride, metadata })
  });

  if (!res.ok) {
    let message = 'Export failed';
    try {
      const err = await res.json();
      message = err?.message || message;
    } catch {}
    throw new Error(message);
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}


