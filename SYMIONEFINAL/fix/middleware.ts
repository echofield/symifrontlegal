// src/lib/api/middleware.ts

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { AppError } from '../errors';
import { handleApiError } from './response';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

interface CorsOptions {
  origin?: string | string[] | ((origin: string) => boolean);
  methods?: HttpMethod[];
  allowedHeaders?: string[];
  exposedHeaders?: string[];
  credentials?: boolean;
  maxAge?: number;
}

const defaultCorsOptions: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
};

/**
 * CORS middleware - now takes only ONE parameter (the handler)
 * Usage: withCors(handler) or withCors(withValidation(schema, options, handler))
 */
export function withCors(
  handler: NextApiHandler,
  options: CorsOptions = {}
): NextApiHandler {
  const corsOptions = { ...defaultCorsOptions, ...options };

  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Set CORS headers
    const origin = req.headers.origin || '*';
    
    if (corsOptions.origin === '*') {
      res.setHeader('Access-Control-Allow-Origin', '*');
    } else if (typeof corsOptions.origin === 'string') {
      res.setHeader('Access-Control-Allow-Origin', corsOptions.origin);
    } else if (Array.isArray(corsOptions.origin)) {
      if (corsOptions.origin.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
    } else if (typeof corsOptions.origin === 'function') {
      if (corsOptions.origin(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      }
    }

    if (corsOptions.credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    if (corsOptions.exposedHeaders) {
      res.setHeader('Access-Control-Expose-Headers', corsOptions.exposedHeaders.join(', '));
    }

    res.setHeader('Access-Control-Allow-Methods', corsOptions.methods!.join(', '));
    res.setHeader('Access-Control-Allow-Headers', corsOptions.allowedHeaders!.join(', '));
    res.setHeader('Access-Control-Max-Age', String(corsOptions.maxAge));

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }

    // Execute the actual handler
    return handler(req, res);
  };
}

/**
 * Method validation middleware
 */
export function withMethods(
  methods: HttpMethod[],
  handler: NextApiHandler
): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!methods.includes(req.method as HttpMethod)) {
      throw new AppError(
        `Method ${req.method} not allowed`,
        'METHOD_NOT_ALLOWED',
        405,
        { allowedMethods: methods }
      );
    }
    return handler(req, res);
  };
}

/**
 * Validation middleware for request body/query
 */
export function withValidation(
  schema: {
    body?: any; // Replace with your validation schema type (e.g., Zod, Joi, Yup)
    query?: any;
    headers?: any;
  },
  options: {
    onError?: (error: unknown) => void;
  },
  handler: NextApiHandler
): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      // Validate body
      if (schema.body && req.body) {
        // Replace with your actual validation logic
        // const validatedBody = await schema.body.parseAsync(req.body);
        // req.body = validatedBody;
      }

      // Validate query
      if (schema.query && req.query) {
        // Replace with your actual validation logic
        // const validatedQuery = await schema.query.parseAsync(req.query);
        // req.query = validatedQuery;
      }

      // Validate headers
      if (schema.headers && req.headers) {
        // Replace with your actual validation logic
        // const validatedHeaders = await schema.headers.parseAsync(req.headers);
      }

      return handler(req, res);
    } catch (error) {
      if (options.onError) {
        options.onError(error);
      }
      
      throw new AppError(
        'Validation failed',
        'VALIDATION_ERROR',
        400,
        error // The validation error details will be included
      );
    }
  };
}

/**
 * Error handling middleware wrapper
 */
export function withErrorHandler(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res);
    } catch (error) {
      handleApiError(res, error);
    }
  };
}

/**
 * Compose multiple middlewares
 * Usage: compose(withCors, withErrorHandler)(handler)
 */
export function compose(...middlewares: Array<(handler: NextApiHandler) => NextApiHandler>) {
  return (handler: NextApiHandler): NextApiHandler => {
    return middlewares.reduceRight((acc, middleware) => middleware(acc), handler);
  };
}
