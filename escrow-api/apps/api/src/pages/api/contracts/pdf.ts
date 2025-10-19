import { prisma } from '@/src/lib/prisma';
import { renderContractPdf, contractHtmlTemplate } from '@/src/lib/pdf';

// Allow large PDF buffers
export const config = { api: { responseLimit: false } };

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return res.status(405).end();
  const { contractId } = req.body as { contractId: string };
  const c = await prisma.contract.findUnique({ where: { id: contractId }, include: { milestones: true } });
  if (!c) return res.status(404).json({ error: true });

  const payer = await prisma.user.findUnique({ where: { id: c.payerId } });
  const payee = await prisma.user.findUnique({ where: { id: c.payeeId } });

  const html = contractHtmlTemplate({
    title: c.title,
    parties: { payerEmail: payer?.email ?? 'payer', payeeEmail: payee?.email ?? 'payee' },
    currency: c.currency,
    amount: c.totalAmount,
    milestones: c.milestones.map((m, i) => ({ index: i, title: m.title, description: m.description, amount: m.amount })),
    terms: (c.termsJson?.terms ?? []) as string[],
  });

  const pdf = await renderContractPdf(html);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="contract-${c.slug}.pdf"`);
  return res.status(200).send(pdf);
}


