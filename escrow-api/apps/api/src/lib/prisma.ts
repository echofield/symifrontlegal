import { PrismaClient } from '@prisma/client';

// Reuse Prisma client across hot reloads in dev to avoid too many connections
export const prisma: PrismaClient = (globalThis as any).__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') (globalThis as any).__prisma = prisma;


