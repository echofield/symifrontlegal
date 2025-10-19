import nodemailer from 'nodemailer';

const hasSmtp = Boolean(process.env.SMTP_HOST);

export const mailer = hasSmtp
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST!,
      port: Number(process.env.SMTP_PORT ?? 587),
      auth: { user: process.env.SMTP_USER!, pass: process.env.SMTP_PASS! },
    })
  : null;

export async function sendMail(to: string, subject: string, html: string) {
  if (!mailer) return; // no-op in dev
  await mailer.sendMail({ from: process.env.MAIL_FROM ?? 'no-reply@example.com', to, subject, html });
}


