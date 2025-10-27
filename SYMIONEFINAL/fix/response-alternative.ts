// src/lib/api/response-alternative.ts
// Alternative approach using type guards without modifying AppError

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

// Type guard to check if an object has a details property
function hasDetails(error: unknown): error is { details: unknown } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'details' in error &&
    (error as any).details !== undefined
  );
}

// Type guard for objects with error properties
function isErrorLike(error: unknown): error is { message: string; code?: string; statusCode?: number } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
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
    const normalized: NormalizedError = {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    };

    // Safely check for details property using type guard
    if (hasDetails(error)) {
      normalized.details = error.details;
    }

    return normalized;
  }

  // Handle standard Error instances with potential details
  if (error instanceof Error) {
    const normalized: NormalizedError = {
      message: error.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500
    };

    // Check if this Error has additional properties
    if (hasDetails(error)) {
      normalized.details = error.details;
    }

    return normalized;
  }

  // Handle plain objects that look like errors
  if (isErrorLike(error)) {
    const normalized: NormalizedError = {
      message: error.message,
      code: error.code || 'INTERNAL_ERROR',
      statusCode: error.statusCode || 500
    };

    if (hasDetails(error)) {
      normalized.details = (error as any).details;
    }

    return normalized;
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
