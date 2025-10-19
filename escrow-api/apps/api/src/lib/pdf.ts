// Serverless-friendly PDF rendering with dynamic imports to reduce cold starts
export async function renderContractPdf(html: string): Promise<Buffer> {
  const chromium = (await import('@sparticuz/chromium')).default;
  const puppeteer = await import('puppeteer-core');

  const executablePath = await chromium.executablePath();
  const browser = await puppeteer.default.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: true,
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    printBackground: true,
    margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
    format: 'A4',
  });
  await browser.close();
  return pdf;
}

export function contractHtmlTemplate(payload: {
  title: string;
  parties: { payerEmail: string; payeeEmail: string };
  currency: string;
  amount: number;
  milestones: Array<{ index: number; title: string; description: string; amount: number }>;
  terms: string[];
}) {
  const money = (cents: number) => (cents / 100).toFixed(2);
  const rows = payload.milestones
    .map(
      (m) => `
    <tr>
      <td>${m.index + 1}</td>
      <td><strong>${m.title}</strong><br/><small>${m.description}</small></td>
      <td style="text-align:right">${money(m.amount)} ${payload.currency.toUpperCase()}</td>
    </tr>`,
    )
    .join('');

  const clauses = payload.terms.map((c) => `<li>${c}</li>`).join('');

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        body { font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial; color:#111; }
        h1 { font-size: 20px; margin: 0 0 8px; }
        h2 { font-size: 16px; margin: 24px 0 8px; }
        table { width:100%; border-collapse: collapse; }
        th, td { border-bottom: 1px solid #eee; padding: 8px; vertical-align: top; }
        small { color:#555 }
      </style>
    </head>
    <body>
      <h1>${payload.title}</h1>
      <p><strong>Parties</strong>: Payer ${payload.parties.payerEmail} • Prestataire ${payload.parties.payeeEmail}</p>
      <p><strong>Montant total</strong>: ${money(payload.amount)} ${payload.currency.toUpperCase()}</p>
      <h2>Jalons</h2>
      <table>
        <thead><tr><th>#</th><th>Jalon</th><th style="text-align:right">Montant</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <h2>Clauses</h2>
      <ol>${clauses}</ol>
      <p style="margin-top:32px"><small>Les fonds sont détenus à titre d'intermédiaire par la plateforme Symione (compte Stripe). Libération après validation des jalons.</small></p>
    </body>
  </html>`;
}


