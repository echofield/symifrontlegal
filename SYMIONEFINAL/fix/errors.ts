// src/lib/errors.ts

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: unknown; // Added optional details property

  constructor(
    message: string,
    code: string = 'INTERNAL_ERROR',
    statusCode: number = 500,
    details?: unknown // Added optional details parameter
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    
    // Maintains proper prototype chain
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      ...(this.details !== undefined && { details: this.details })
    };
  }
}

// Common error factory functions
export const BadRequestError = (message: string, details?: unknown) =>
  new AppError(message, 'BAD_REQUEST', 400, details);

export const UnauthorizedError = (message: string, details?: unknown) =>
  new AppError(message, 'UNAUTHORIZED', 401, details);

export const ForbiddenError = (message: string, details?: unknown) =>
  new AppError(message, 'FORBIDDEN', 403, details);

export const NotFoundError = (message: string, details?: unknown) =>
  new AppError(message, 'NOT_FOUND', 404, details);

export const ConflictError = (message: string, details?: unknown) =>
  new AppError(message, 'CONFLICT', 409, details);

export const ValidationError = (message: string, details?: unknown) =>
  new AppError(message, 'VALIDATION_ERROR', 422, details);

export const InternalServerError = (message: string, details?: unknown) =>
  new AppError(message, 'INTERNAL_ERROR', 500, details);
