// ========================================
// 1. CONFIGURATION ENVIRONNEMENT
// ========================================

// .env.local (Frontend)
/*
NEXT_PUBLIC_API_URL=https://symilegalback.vercel.app/api
NEXT_PUBLIC_FRONTEND_URL=https://symifrontlegalfinal.vercel.app
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
NEXT_PUBLIC_GA_ID=your-google-analytics-id
*/

// .env (Backend)
/*
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
PERPLEXITY_API_KEY=pplx-...
JWT_SECRET=...
CORS_ORIGINS=https://symifrontlegalfinal.vercel.app,http://localhost:3000
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=15
WEBHOOK_SECRET=...
SENTRY_DSN=...
*/

// ========================================
// 2. MIDDLEWARE DE SÉCURITÉ ET MONITORING
// ========================================

// middleware/security.ts
import { NextRequest, NextResponse } from 'next/server';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { z } from 'zod';

// Configuration CORS avancée
export const corsOptions = {
  origin: (origin: string | undefined, callback: Function) => {
    const allowedOrigins = process.env.CORS_ORIGINS?.split(',') || [];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  maxAge: 86400, // 24 hours
};

// Rate limiting par IP et par user
export const createRateLimiter = (name: string) => {
  const limits: Record<string, any> = {
    global: { windowMs: 15 * 60 * 1000, max: 100 },
    auth: { windowMs: 15 * 60 * 1000, max: 5 },
    ai: { windowMs: 60 * 1000, max: 10 }, // AI calls plus restrictifs
    search: { windowMs: 60 * 1000, max: 20 },
  };

  return rateLimit({
    ...limits[name],
    message: 'Trop de requêtes, veuillez réessayer plus tard',
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
      // Combine IP + user ID pour le rate limiting
      const userId = req.user?.id || 'anonymous';
      const ip = req.ip || req.connection.remoteAddress;
      return `${ip}:${userId}`;
    },
  });
};

// Validation des entrées avec Zod
export const validators = {
  // Validation pour l'audit juridique
  auditRequest: z.object({
    problem: z.string().min(10).max(5000),
    userId: z.string().uuid().optional(),
    metadata: z.object({
      source: z.enum(['web', 'mobile', 'api']),
      version: z.string(),
    }).optional(),
  }),

  // Validation pour la recherche d'avocats
  lawyerSearch: z.object({
    city: z.string().min(2).max(100),
    specialty: z.string().min(3).max(200),
    options: z.object({
      urgency: z.enum(['immediate', 'week', 'month']).optional(),
      budget: z.enum(['economy', 'standard', 'premium']).optional(),
      radius: z.number().min(0).max(100).optional(),
    }).optional(),
  }),

  // Validation pour les contrats Bond
  contractCreation: z.object({
    templateId: z.string(),
    answers: z.record(z.any()),
    parties: z.array(z.object({
      name: z.string(),
      role: z.string(),
      email: z.string().email().optional(),
    })).min(2),
  }),
};

// Middleware de sécurité global
export async function securityMiddleware(req: NextRequest) {
  const requestId = crypto.randomUUID();
  
  // Ajouter des headers de sécurité
  const headers = new Headers(req.headers);
  headers.set('X-Request-ID', requestId);
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CSP pour prévenir XSS
  headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live; style-src 'self' 'unsafe-inline';"
  );

  // Log de monitoring
  console.log(`[${requestId}] ${req.method} ${req.url}`);

  return NextResponse.next({ headers });
}

// ========================================
// 3. SYSTÈME DE CACHE INTELLIGENT
// ========================================

// lib/cache.ts
import { Redis } from '@upstash/redis';
import crypto from 'crypto';

class CacheManager {
  private redis: Redis;
  private defaultTTL: number = 3600; // 1 heure

  constructor() {
    this.redis = new Redis({
      url: process.env.UPSTASH_REDIS_URL!,
      token: process.env.UPSTASH_REDIS_TOKEN!,
    });
  }

  // Génération de clé de cache unique
  private generateKey(prefix: string, data: any): string {
    const hash = crypto
      .createHash('md5')
      .update(JSON.stringify(data))
      .digest('hex');
    return `${prefix}:${hash}`;
  }

  // Get avec fallback
  async get<T>(
    key: string,
    fallback?: () => Promise<T>,
    ttl?: number
  ): Promise<T | null> {
    try {
      const cached = await this.redis.get(key);
      
      if (cached) {
        console.log(`Cache HIT: ${key}`);
        return cached as T;
      }

      console.log(`Cache MISS: ${key}`);
      
      if (fallback) {
        const data = await fallback();
        await this.set(key, data, ttl);
        return data;
      }

      return null;
    } catch (error) {
      console.error('Cache error:', error);
      // En cas d'erreur, on continue sans cache
      return fallback ? await fallback() : null;
    }
  }

  // Set avec TTL
  async set(key: string, value: any, ttl?: number): Promise<void> {
    try {
      await this.redis.set(key, value, {
        ex: ttl || this.defaultTTL,
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  // Invalidation de cache
  async invalidate(pattern: string): Promise<void> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await Promise.all(keys.map(key => this.redis.del(key)));
        console.log(`Invalidated ${keys.length} cache entries`);
      }
    } catch (error) {
      console.error('Cache invalidation error:', error);
    }
  }

  // Cache pour les résultats d'audit
  async cacheAudit(problem: string, result: any): Promise<void> {
    const key = this.generateKey('audit', { problem });
    await this.set(key, result, 3600 * 24); // 24h pour les audits
  }

  // Cache pour les recherches d'avocats
  async cacheLawyerSearch(params: any, results: any): Promise<void> {
    const key = this.generateKey('lawyers', params);
    await this.set(key, results, 3600 * 12); // 12h pour les avocats
  }
}

export const cache = new CacheManager();

// ========================================
// 4. MONITORING ET LOGGING
// ========================================

// lib/monitoring.ts
import * as Sentry from '@sentry/nextjs';
import { analytics } from '@vercel/analytics';

class MonitoringService {
  constructor() {
    // Initialiser Sentry
    if (process.env.SENTRY_DSN) {
      Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: 1.0,
        beforeSend(event) {
          // Filtrer les données sensibles
          if (event.request?.data) {
            delete event.request.data.password;
            delete event.request.data.token;
          }
          return event;
        },
      });
    }
  }

  // Log des événements métier importants
  logEvent(eventName: string, properties?: any) {
    console.log(`[EVENT] ${eventName}`, properties);
    
    // Analytics Vercel
    if (typeof window !== 'undefined') {
      analytics.track(eventName, properties);
    }

    // Custom logging vers votre système
    this.sendToLoggingService({
      timestamp: new Date().toISOString(),
      event: eventName,
      properties,
      environment: process.env.NODE_ENV,
    });
  }

  // Tracking des erreurs
  captureError(error: Error, context?: any) {
    console.error('[ERROR]', error, context);
    
    Sentry.captureException(error, {
      extra: context,
    });
  }

  // Monitoring des performances
  measurePerformance(name: string, fn: () => Promise<any>) {
    return async (...args: any[]) => {
      const start = performance.now();
      
      try {
        const result = await fn(...args);
        const duration = performance.now() - start;
        
        this.logEvent('performance', {
          operation: name,
          duration,
          success: true,
        });
        
        return result;
      } catch (error) {
        const duration = performance.now() - start;
        
        this.logEvent('performance', {
          operation: name,
          duration,
          success: false,
          error: error.message,
        });
        
        throw error;
      }
    };
  }

  // Alertes critiques
  sendAlert(message: string, severity: 'low' | 'medium' | 'high' | 'critical') {
    if (severity === 'critical' || severity === 'high') {
      // Envoyer une notification immédiate
      this.sendNotification({
        message,
        severity,
        timestamp: new Date().toISOString(),
        service: 'symi-legal',
      });
    }
    
    Sentry.captureMessage(message, severity as any);
  }

  private async sendToLoggingService(data: any) {
    // Implémenter l'envoi vers votre service de logs
    // Ex: Datadog, LogRocket, etc.
    try {
      await fetch('/api/logs', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to send logs:', error);
    }
  }

  private async sendNotification(alert: any) {
    // Implémenter l'envoi de notifications
    // Ex: Email, Slack, Discord, etc.
    if (process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        body: JSON.stringify({
          text: `🚨 ${alert.severity.toUpperCase()}: ${alert.message}`,
        }),
      });
    }
  }
}

export const monitoring = new MonitoringService();

// ========================================
// 5. HEALTH CHECK & STATUS
// ========================================

// pages/api/health.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'down';
  timestamp: string;
  services: {
    database: boolean;
    openai: boolean;
    perplexity: boolean;
    cache: boolean;
  };
  metrics?: {
    responseTime: number;
    dbConnections: number;
    cacheHitRate: number;
  };
}

export default async function healthCheck(
  req: NextApiRequest,
  res: NextApiResponse<HealthStatus>
) {
  const start = Date.now();
  const services = {
    database: false,
    openai: false,
    perplexity: false,
    cache: false,
  };

  try {
    // Check Database
    await prisma.$queryRaw`SELECT 1`;
    services.database = true;
  } catch (error) {
    console.error('Database health check failed:', error);
  }

  try {
    // Check OpenAI
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    });
    services.openai = response.ok;
  } catch (error) {
    console.error('OpenAI health check failed:', error);
  }

  try {
    // Check Perplexity
    const response = await fetch('https://api.perplexity.ai/health');
    services.perplexity = response.ok;
  } catch (error) {
    console.error('Perplexity health check failed:', error);
  }

  try {
    // Check Cache
    await cache.set('health:check', true, 10);
    services.cache = await cache.get('health:check') === true;
  } catch (error) {
    console.error('Cache health check failed:', error);
  }

  const allHealthy = Object.values(services).every(v => v);
  const someHealthy = Object.values(services).some(v => v);

  const status: HealthStatus = {
    status: allHealthy ? 'healthy' : someHealthy ? 'degraded' : 'down',
    timestamp: new Date().toISOString(),
    services,
    metrics: {
      responseTime: Date.now() - start,
      dbConnections: 0, // À implémenter
      cacheHitRate: 0, // À implémenter
    },
  };

  // Définir le code de statut HTTP approprié
  const httpStatus = allHealthy ? 200 : someHealthy ? 503 : 500;
  
  res.status(httpStatus).json(status);
}

// ========================================
// 6. CONFIGURATION VERCEL
// ========================================

// vercel.json
const vercelConfig = {
  "functions": {
    "pages/api/conseiller/audit.ts": {
      "maxDuration": 30 // 30 secondes pour les appels AI
    },
    "pages/api/conseiller/lawyers.ts": {
      "maxDuration": 30
    },
    "pages/api/bond/generate.ts": {
      "maxDuration": 60 // Plus long pour génération de contrats
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Credentials", "value": "true" },
        { "key": "Access-Control-Allow-Origin", "value": "$CORS_ORIGIN" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://symilegalback.vercel.app/api/:path*"
    }
  ]
};

// ========================================
// 7. SCRIPTS DE DÉPLOIEMENT
// ========================================

// scripts/deploy.sh
const deployScript = `
#!/bin/bash

# Couleurs pour output
GREEN='\\033[0;32m'
RED='\\033[0;31m'
NC='\\033[0m'

echo "🚀 Déploiement Symi Legal"

# 1. Tests
echo "Running tests..."
npm run test
if [ $? -ne 0 ]; then
  echo "\${RED}❌ Tests failed\${NC}"
  exit 1
fi

# 2. Build
echo "Building..."
npm run build
if [ $? -ne 0 ]; then
  echo "\${RED}❌ Build failed\${NC}"
  exit 1
fi

# 3. Migration DB
echo "Running migrations..."
npx prisma migrate deploy
if [ $? -ne 0 ]; then
  echo "\${RED}❌ Migration failed\${NC}"
  exit 1
fi

# 4. Deploy to Vercel
echo "Deploying to Vercel..."
vercel --prod

# 5. Health check
echo "Health check..."
sleep 10
curl -f https://symilegalback.vercel.app/api/health
if [ $? -ne 0 ]; then
  echo "\${RED}❌ Health check failed\${NC}"
  # Rollback si nécessaire
  exit 1
fi

echo "\${GREEN}✅ Deployment successful!\${NC}"

# 6. Notifications
curl -X POST $SLACK_WEBHOOK_URL \\
  -H 'Content-Type: application/json' \\
  -d '{"text":"✅ Symi Legal deployed successfully!"}'
`;

// ========================================
// 8. TYPES GLOBAUX
// ========================================

// types/global.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      DATABASE_URL: string;
      OPENAI_API_KEY: string;
      PERPLEXITY_API_KEY: string;
      JWT_SECRET: string;
      NEXT_PUBLIC_API_URL: string;
      CORS_ORIGINS: string;
      UPSTASH_REDIS_URL?: string;
      UPSTASH_REDIS_TOKEN?: string;
      SENTRY_DSN?: string;
      SLACK_WEBHOOK_URL?: string;
    }
  }

  interface Window {
    analytics?: any;
  }
}

export {};

// ========================================
// 9. PACKAGE.JSON SCRIPTS
// ========================================

const packageScripts = {
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint && tsc --noEmit",
    "test": "jest --coverage",
    "test:watch": "jest --watch",
    "test:e2e": "playwright test",
    "db:migrate": "prisma migrate dev",
    "db:push": "prisma db push",
    "db:seed": "prisma db seed",
    "deploy": "bash scripts/deploy.sh",
    "monitor": "node scripts/monitor.js",
    "analyze": "ANALYZE=true next build"
  }
};