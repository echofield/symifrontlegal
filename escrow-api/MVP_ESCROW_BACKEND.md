donc je copie colle ca, en lui disant de ne pas faire break et de garder ce qui est utile et qu'apre son adapetrera le front right? Arborescence
apps/
  api/
    next.config.js
    package.json
    .env.example
    prisma/
      schema.prisma
    src/
      lib/
        prisma.ts
        stripe.ts
        http.ts
        mailer.ts
        pdf.ts
        ai/
          index.ts
          prompts.ts
      domain/
        contracts.ts
        milestones.ts
        escrow.ts
      pages/api/
        healthz.ts
        cron/auto-approve.ts
        escrow/
          intent/create.ts
          milestone/submit.ts
          milestone/validate.ts
          stripe-webhook.ts
        contracts/
          suggest.ts
          create.ts
          pdf.ts

⚙️ next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: false },
};
export default nextConfig;

📦 package.json
{
  "name": "escrow-api",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start -p 3001",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev --name init"
  },
  "dependencies": {
    "@prisma/client": "^5.19.0",
    "@sparticuz/chromium": "^133.0.0",
    "next": "14.2.5",
    "nodemailer": "^6.9.13",
    "puppeteer-core": "^23.7.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "stripe": "^16.8.0",
    "zod": "^3.23.8",
    "openai": "^4.67.3",
    "@anthropic-ai/sdk": "^0.30.1"
  },
  "devDependencies": {
    "prisma": "^5.19.0",
    "typescript": "^5.5.4",
    "@types/node": "^20.14.10"
  }
}

🔐 .env.example
# DB
DATABASE_URL=postgresql://user:pass@host:5432/db

# Stripe (compte unique)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
APP_URL=http://localhost:3001

# Cron
CRON_SECRET=supersecret

# Mail (Nodemailer SMTP basique)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=pass
MAIL_FROM="Symione <no-reply@symione.com>"

# IA (choisir un provider)
AI_PROVIDER=openai # openai | anthropic | none
OPENAI_API_KEY=sk-openai
ANTHROPIC_API_KEY=sk-anthropic

🗃️ prisma/schema.prisma
generator client { provider = "prisma-client-js" }

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ContractStatus { DRAFT ACTIVE COMPLETED CANCELLED }
enum MilestoneStatus { PENDING SUBMITTED APPROVED PAID DISPUTED }
enum EscrowStatus { HELD RELEASED REFUNDED }

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Contract {
  id            String          @id @default(cuid())
  slug          String          @unique
  title         String
  creatorId     String
  payerId       String
  payeeId       String
  currency      String
  totalAmount   Int
  termsJson     Json
  pdfUrl        String?
  status        ContractStatus  @default(DRAFT)
  createdAt     DateTime        @default(now())
  updatedAt     DateTime        @updatedAt
  milestones    Milestone[]
  escrowBatches EscrowBatch[]
}

model Milestone {
  id          String          @id @default(cuid())
  contractId  String
  title       String
  description String
  amount      Int
  dueAt       DateTime?
  status      MilestoneStatus @default(PENDING)
  submittedAt DateTime?
  approvedAt  DateTime?
  proofs      Proof[]
}

model Proof {
  id          String   @id @default(cuid())
  milestoneId String
  url         String
  kind        String   // file | link | note
  createdAt   DateTime @default(now())
}

model EscrowBatch {
  id              String   @id @default(cuid())
  contractId      String
  amount          Int
  currency        String
  status          EscrowStatus @default(HELD)
  paymentIntentId String
  chargeId        String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model PayoutLog {
  id          String   @id @default(cuid())
  milestoneId String
  payeeEmail  String
  amount      Int
  method      String   // sepa | paypal | wise | manual
  status      String   // pending | sent | confirmed
  createdAt   DateTime @default(now())
}

🧩 Libs
src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";
export const prisma = globalThis.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") (globalThis as any).__prisma = prisma;

src/lib/stripe.ts
import Stripe from "stripe";
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

src/lib/http.ts
export const ok = (res: any, data: any) => res.status(200).json(data);
export const err = (res: any, code: number, message: string, extra?: any) =>
  res.status(code).json({ error: true, message, ...(extra ?? {}) });

src/lib/mailer.ts
import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST!,
  port: Number(process.env.SMTP_PORT ?? 587),
  auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! }
});

export async function sendMail(to: string, subject: string, html: string) {
  if (!process.env.SMTP_HOST) return; // fallback no-op en dev
  await mailer.sendMail({ from: process.env.MAIL_FROM ?? "no-reply@example.com", to, subject, html });
}

src/lib/pdf.ts (Puppeteer serverless-ready)
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

export async function renderContractPdf(html: string): Promise<Buffer> {
  const executablePath = await chromium.executablePath();
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath,
    headless: true,
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  const pdf = await page.pdf({
    printBackground: true,
    margin: { top: "20mm", right: "15mm", bottom: "20mm", left: "15mm" },
    format: "A4"
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
  const rows = payload.milestones.map(m => `
    <tr>
      <td>${m.index + 1}</td>
      <td><strong>${m.title}</strong><br/><small>${m.description}</small></td>
      <td style="text-align:right">${money(m.amount)} ${payload.currency.toUpperCase()}</td>
    </tr>`).join("");

  const clauses = payload.terms.map(c => `<li>${c}</li>`).join("");

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

src/lib/ai/prompts.ts
export const SYSTEM_FR = `
Tu es un juriste-conseil. Propose une structuration de contrat de prestation à jalons.
RENVOIE UNIQUEMENT du JSON strict:
{
  "title": string,
  "durationWeeks": number,
  "milestones": [{"title": string, "description": string, "amount": number}],
  "terms": [string],
  "risks": [string]
}
Les "amount" doivent sommer le budget si fourni, sinon proposer une répartition cohérente.
`;

export function userPromptFr(input: {
  description: string; budget?: number; roleA?: string; roleB?: string;
}) {
  return `Description: ${input.description}
Budget: ${input.budget ?? "N/A"}
Parties: ${input.roleA ?? "Client"} vs ${input.roleB ?? "Prestataire"}
Langue: FR`;
}

src/lib/ai/index.ts
import { SYSTEM_FR, userPromptFr } from "./prompts";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

export async function suggestContractFR(input: {
  description: string; budget?: number; roleA?: string; roleB?: string;
}) {
  const provider = (process.env.AI_PROVIDER ?? "none").toLowerCase();

  const system = SYSTEM_FR;
  const user = userPromptFr(input);

  if (provider === "openai" && process.env.OPENAI_API_KEY) {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user }
      ],
      response_format: { type: "json_object" }
    });
    return JSON.parse(res.choices[0].message.content!);
  }

  if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const res = await client.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 1024,
      system,
      messages: [{ role: "user", content: user }],
      temperature: 0.2
    });
    const text = res.content[0].type === "text" ? res.content[0].text : "";
    return JSON.parse(text);
  }

  // Fallback (déterministe minimal si pas d'IA)
  return {
    title: "Contrat de prestation à jalons",
    durationWeeks: 4,
    milestones: [
      { title: "Cadrage", description: "Spécifications et planning", amount: Math.round((input.budget ?? 100000) * 0.2) },
      { title: "Prototype", description: "Livrable v1", amount: Math.round((input.budget ?? 100000) * 0.4) },
      { title: "Finalisation", description: "Recette et remise", amount: Math.round((input.budget ?? 100000) * 0.4) }
    ],
    terms: [
      "Fonds détenus par la plateforme jusqu'à validation des jalons.",
      "Auto-validation après 5 jours ouvrés sans réponse.",
      "Transfert manuel des fonds au prestataire après validation."
    ],
    risks: ["Retard côté client", "Ambiguïté des livrables", "Dépendances externes"]
  };
}

🧠 Domain services
src/domain/contracts.ts
import { prisma } from "../lib/prisma";
import { ContractStatus } from "@prisma/client";

export async function createContract(params: {
  title: string;
  payerId: string;
  payeeId: string;
  currency: string;
  termsJson: any;
  milestones: Array<{ title: string; description: string; amount: number; dueAt?: Date }>;
  totalAmount?: number;
}) {
  const total = params.totalAmount ?? params.milestones.reduce((s, m) => s + m.amount, 0);
  const slug = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;

  return prisma.contract.create({
    data: {
      slug,
      title: params.title,
      creatorId: params.payerId,
      payerId: params.payerId,
      payeeId: params.payeeId,
      currency: params.currency,
      totalAmount: total,
      termsJson: params.termsJson,
      status: ContractStatus.ACTIVE,
      milestones: {
        create: params.milestones.map((m, i) => ({
          title: m.title,
          description: m.description,
          amount: m.amount,
          dueAt: m.dueAt ?? null,
        }))
      }
    },
    include: { milestones: true }
  });
}

export async function getContract(id: string) {
  return prisma.contract.findUnique({ where: { id }, include: { milestones: true } });
}

src/domain/milestones.ts
import { prisma } from "../lib/prisma";
import { MilestoneStatus } from "@prisma/client";

export async function submitMilestone(milestoneId: string, proofs: Array<{ url: string; kind: string }>) {
  await prisma.$transaction(async (tx) => {
    await tx.proof.createMany({ data: proofs.map(p => ({ ...p, milestoneId })) });
    await tx.milestone.update({ where: { id: milestoneId }, data: { status: MilestoneStatus.SUBMITTED, submittedAt: new Date() } });
  });
}

export async function approveMilestone(milestoneId: string) {
  const ms = await prisma.milestone.findUnique({ where: { id: milestoneId }, include: { contract: true } });
  if (!ms) throw new Error("Milestone not found");
  if (ms.status !== "SUBMITTED") throw new Error("Milestone not submitted");

  await prisma.milestone.update({
    where: { id: milestoneId },
    data: { status: MilestoneStatus.PAID, approvedAt: new Date() }
  });

  // Contrat complété si tous payés
  const remaining = await prisma.milestone.count({ where: { contractId: ms.contractId, NOT: { status: MilestoneStatus.PAID } } });
  if (remaining === 0) {
    await prisma.contract.update({ where: { id: ms.contractId }, data: { status: "COMPLETED" } as any });
  }

  // Log payout manuel
  const payee = await prisma.user.findUnique({ where: { id: ms.contract.payeeId } });
  await prisma.payoutLog.create({
    data: { milestoneId, payeeEmail: payee?.email ?? "unknown", amount: ms.amount, method: "manual", status: "pending" }
  });

  return { ok: true };
}

src/domain/escrow.ts
import { prisma } from "../lib/prisma";

export async function recordEscrowBatch(params: {
  contractId: string; amount: number; currency: string; paymentIntentId: string; chargeId?: string | null;
}) {
  return prisma.escrowBatch.create({
    data: {
      contractId: params.contractId,
      amount: params.amount,
      currency: params.currency,
      paymentIntentId: params.paymentIntentId,
      chargeId: params.chargeId ?? null
    }
  });
}

🌐 Endpoints API
Health — pages/api/healthz.ts
export default function handler(_req, res) {
  res.status(200).json({ ok: true, ts: Date.now() });
}

Cron auto-approve — pages/api/cron/auto-approve.ts
import { prisma } from "../../../src/lib/prisma";
import { MilestoneStatus } from "@prisma/client";

// Approve auto les jalons SUBMITTED depuis > 72h
const HOURS = 72;

export default async function handler(req, res) {
  const auth = req.headers.authorization ?? "";
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) return res.status(401).json({ error: true, message: "Unauthorized" });

  const threshold = new Date(Date.now() - HOURS * 3600 * 1000);

  const toApprove = await prisma.milestone.findMany({
    where: { status: MilestoneStatus.SUBMITTED, submittedAt: { lte: threshold } },
    include: { contract: true }
  });

  for (const ms of toApprove) {
    await prisma.milestone.update({
      where: { id: ms.id },
      data: { status: MilestoneStatus.PAID, approvedAt: new Date() }
    });
  }

  res.status(200).json({ ok: true, autoApproved: toApprove.length });
}

Stripe — create intent — pages/api/escrow/intent/create.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import { stripe } from "../../../../src/lib/stripe";

const schema = z.object({
  contractId: z.string(),
  amount: z.number().int().positive(),
  currency: z.string().min(3),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: true });

  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: true, message: "Invalid payload" });

  const { contractId, amount, currency } = body.data;
  const pi = await stripe.paymentIntents.create({
    amount, currency,
    automatic_payment_methods: { enabled: true },
    metadata: { contractId }
  });
  res.status(200).json({ clientSecret: pi.client_secret });
}

Stripe webhook — pages/api/escrow/stripe-webhook.ts
import type { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import { stripe } from "../../../../src/lib/stripe";
import { recordEscrowBatch } from "../../../../src/domain/escrow";

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const buf = await getRawBody(req);
  const sig = req.headers["stripe-signature"] as string;
  let event;
  try {
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (e: any) {
    return res.status(400).send(`Webhook Error: ${e.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object as any;
    const contractId = pi.metadata?.contractId;
    if (contractId) {
      await recordEscrowBatch({
        contractId,
        amount: pi.amount_received ?? pi.amount,
        currency: pi.currency,
        paymentIntentId: pi.id,
        chargeId: pi.latest_charge ?? null
      });
    }
  }

  res.status(200).json({ received: true });
}

Milestone submit — pages/api/escrow/milestone/submit.ts
import { z } from "zod";
import { submitMilestone } from "../../../../src/domain/milestones";

const schema = z.object({
  milestoneId: z.string(),
  proofs: z.array(z.object({ url: z.string().url(), kind: z.enum(["file","link","note"]) }))
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: true });

  await submitMilestone(body.data.milestoneId, body.data.proofs);
  res.status(200).json({ ok: true });
}

Milestone validate — pages/api/escrow/milestone/validate.ts
import { z } from "zod";
import { approveMilestone } from "../../../../src/domain/milestones";

const schema = z.object({ milestoneId: z.string() });

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: true });

  const out = await approveMilestone(parsed.data.milestoneId);
  res.status(200).json(out);
}

📝 Contrats
Suggest (IA) — pages/api/contracts/suggest.ts
import { z } from "zod";
import { suggestContractFR } from "../../../src/lib/ai";

const schema = z.object({
  description: z.string().min(10),
  budget: z.number().int().positive().optional(),
  roleA: z.string().optional(),
  roleB: z.string().optional()
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: true });

  const draft = await suggestContractFR(body.data);
  res.status(200).json(draft);
}

Create — pages/api/contracts/create.ts
import { z } from "zod";
import { createContract } from "../../../src/domain/contracts";

const msSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(2),
  amount: z.number().int().positive(),
  dueAt: z.string().datetime().optional()
});

const schema = z.object({
  title: z.string().min(3),
  payerId: z.string(),
  payeeId: z.string(),
  currency: z.string().min(3),
  termsJson: z.any(),
  milestones: z.array(msSchema).min(1),
  totalAmount: z.number().int().positive().optional()
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const body = schema.safeParse(req.body);
  if (!body.success) return res.status(400).json({ error: true, issues: body.error.issues });

  const { title, payerId, payeeId, currency, termsJson, milestones, totalAmount } = body.data;
  const created = await createContract({
    title, payerId, payeeId, currency, termsJson,
    milestones: milestones.map(m => ({ ...m, dueAt: m.dueAt ? new Date(m.dueAt) : undefined })),
    totalAmount
  });
  res.status(200).json(created);
}

PDF — pages/api/contracts/pdf.ts
import { prisma } from "../../../src/lib/prisma";
import { renderContractPdf, contractHtmlTemplate } from "../../../src/lib/pdf";

export const config = { api: { responseLimit: false } }; // autoriser PDF buffer

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { contractId } = req.body as { contractId: string };
  const c = await prisma.contract.findUnique({
    where: { id: contractId },
    include: { milestones: true }
  });
  if (!c) return res.status(404).json({ error: true });

  const payer = await prisma.user.findUnique({ where: { id: c.payerId } });
  const payee = await prisma.user.findUnique({ where: { id: c.payeeId } });

  const html = contractHtmlTemplate({
    title: c.title,
    parties: { payerEmail: payer?.email ?? "payer", payeeEmail: payee?.email ?? "payee" },
    currency: c.currency,
    amount: c.totalAmount,
    milestones: c.milestones.map((m, i) => ({ index: i, title: m.title, description: m.description, amount: m.amount })),
    terms: (c.termsJson?.terms ?? []) as string[]
  });

  const pdf = await renderContractPdf(html);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `inline; filename="contract-${c.slug}.pdf"`);
  return res.status(200).send(pdf);
}