// src/lib/api/response.ts

import { NextApiResponse } from 'next';
import { AppError } from '../errors';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export function sendSuccess<T>(
  res: NextApiResponse<ApiResponse<T>>,
  data: T,
  statusCode: number = 200
): void {
  res.status(statusCode).json({
    success: true,
    data
  });
}

export function sendError(
  res: NextApiResponse<ApiResponse>,
  error: unknown,
  statusCode?: number
): void {
  const normalizedError = normalizeError(error);
  
  res.status(statusCode || normalizedError.statusCode).json({
    success: false,
    error: {
      message: normalizedError.message,
      code: normalizedError.code,
      ...(normalizedError.details !== undefined && { details: normalizedError.details })
    }
  });
}

interface NormalizedError {
  message: string;
  code: string;
  statusCode: number;
  details?: unknown;
}

function normalizeError(error: unknown): NormalizedError {
  // Handle AppError instances - Line 55 area where the original error occurred
  if (error instanceof AppError) {
    return {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      details: error.details // Now TypeScript knows this property exists (as optional)
    };
  }

  // Handle standard Error instances
  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
      code: 'INTERNAL_ERROR',
      statusCode: 500
    };
  }

  // Handle unknown errors
  return {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    statusCode: 500,
    details: process.env.NODE_ENV === 'development' ? error : undefined
  };
}

// Helper function for consistent error responses
export function handleApiError(
  res: NextApiResponse,
  error: unknown,
  defaultMessage: string = 'An error occurred'
): void {
  console.error('API Error:', error);
  
  if (error instanceof AppError) {
    sendError(res, error, error.statusCode);
  } else {
    sendError(res, new AppError(defaultMessage, 'INTERNAL_ERROR', 500), 500);
  }
}
