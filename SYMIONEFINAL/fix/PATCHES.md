# TypeScript Build Error Fix - Unified Diffs

## Approach 1: Add Optional `details` Property to AppError (Recommended)

### Diff for src/lib/errors.ts

```diff
--- a/src/lib/errors.ts
+++ b/src/lib/errors.ts
@@ -1,14 +1,16 @@
 export class AppError extends Error {
   public readonly statusCode: number;
   public readonly code: string;
+  public readonly details?: unknown; // Added optional details property
 
   constructor(
     message: string,
     code: string = 'INTERNAL_ERROR',
-    statusCode: number = 500
+    statusCode: number = 500,
+    details?: unknown // Added optional details parameter
   ) {
     super(message);
     this.name = 'AppError';
     this.code = code;
     this.statusCode = statusCode;
+    this.details = details;
     
     // Maintains proper prototype chain
@@ -20,5 +22,6 @@
       name: this.name,
       message: this.message,
       code: this.code,
-      statusCode: this.statusCode
+      statusCode: this.statusCode,
+      ...(this.details !== undefined && { details: this.details })
     };
   }
@@ -27,17 +30,17 @@
 
 // Update factory functions if you have them
-export const BadRequestError = (message: string) =>
-  new AppError(message, 'BAD_REQUEST', 400);
+export const BadRequestError = (message: string, details?: unknown) =>
+  new AppError(message, 'BAD_REQUEST', 400, details);
 
-export const UnauthorizedError = (message: string) =>
-  new AppError(message, 'UNAUTHORIZED', 401);
+export const UnauthorizedError = (message: string, details?: unknown) =>
+  new AppError(message, 'UNAUTHORIZED', 401, details);
 
-export const NotFoundError = (message: string) =>
-  new AppError(message, 'NOT_FOUND', 404);
+export const NotFoundError = (message: string, details?: unknown) =>
+  new AppError(message, 'NOT_FOUND', 404, details);
 
-export const ValidationError = (message: string) =>
-  new AppError(message, 'VALIDATION_ERROR', 422);
+export const ValidationError = (message: string, details?: unknown) =>
+  new AppError(message, 'VALIDATION_ERROR', 422, details);
```

### Diff for src/lib/api/response.ts (minimal change)

```diff
--- a/src/lib/api/response.ts
+++ b/src/lib/api/response.ts
@@ -52,7 +52,7 @@ function normalizeError(error: unknown): NormalizedError {
       message: error.message,
       code: error.code,
       statusCode: error.statusCode,
-      details: error.details // Line 55 - TypeScript error was here
+      details: error.details // Now TypeScript knows this property exists (as optional)
     };
   }
```

## Approach 2: Using Type Guards (Alternative - No AppError Modification)

### Diff for src/lib/api/response.ts (type guard approach)

```diff
--- a/src/lib/api/response.ts
+++ b/src/lib/api/response.ts
@@ -40,6 +40,14 @@ interface NormalizedError {
   details?: unknown;
 }
 
+// Type guard to check if an object has a details property
+function hasDetails(error: unknown): error is { details: unknown } {
+  return (
+    typeof error === 'object' &&
+    error !== null &&
+    'details' in error
+  );
+}
+
 function normalizeError(error: unknown): NormalizedError {
   // Handle AppError instances
@@ -48,10 +56,14 @@ function normalizeError(error: unknown): NormalizedError {
-    return {
+    const normalized: NormalizedError = {
       message: error.message,
       code: error.code,
-      statusCode: error.statusCode,
-      details: error.details // Line 55 - TypeScript error was here
+      statusCode: error.statusCode
     };
+    
+    // Safely check for details property using type guard
+    if (hasDetails(error)) {
+      normalized.details = error.details;
+    }
+    
+    return normalized;
   }
```

## Fix for withCors Usage

### Diff for API routes using withCors incorrectly

```diff
--- a/pages/api/example.ts
+++ b/pages/api/example.ts
@@ -10,8 +10,13 @@ async function handler(req: NextApiRequest, res: NextApiResponse) {
   // handler logic
 }
 
-// INCORRECT: Two arguments
-export default withCors(handler, { origin: 'https://example.com' });
+// CORRECT: Single argument (handler)
+export default withCors(handler);
+
+// Or with custom options:
+// export default withCors(handler, { origin: 'https://example.com' });
+
+// Or with validation:
+// export default withCors(withValidation(schema, options, handler));
```

## Ripple Effects & Required Changes

### 1. Update all error throwing locations to include details when needed:

```diff
--- a/src/services/userService.ts
+++ b/src/services/userService.ts
@@ -15,7 +15,10 @@ export async function validateUser(data: any) {
   const validation = schema.safeParse(data);
   
   if (!validation.success) {
-    throw new ValidationError('Invalid user data');
+    throw new ValidationError(
+      'Invalid user data',
+      { errors: validation.error.flatten() }
+    );
   }
 }
```

### 2. Update any custom error classes that extend AppError:

```diff
--- a/src/lib/errors/customErrors.ts
+++ b/src/lib/errors/customErrors.ts
@@ -2,8 +2,8 @@ import { AppError } from '../errors';
 
 export class DatabaseError extends AppError {
-  constructor(message: string) {
-    super(message, 'DATABASE_ERROR', 500);
+  constructor(message: string, details?: unknown) {
+    super(message, 'DATABASE_ERROR', 500, details);
     this.name = 'DatabaseError';
   }
 }
```

### 3. Search for all references to error.details:

```bash
# Run this command to find all references
grep -r "error\.details" src/ --include="*.ts" --include="*.tsx"

# Common locations to check:
# - src/lib/api/response.ts
# - src/middleware/errorHandler.ts
# - src/utils/logger.ts
# - Any custom error handling utilities
```

## Testing the Fix

```typescript
// test/errors.test.ts
import { AppError, ValidationError } from '@/lib/errors';

describe('AppError with details', () => {
  it('should include details when provided', () => {
    const error = new AppError(
      'Test error',
      'TEST_ERROR',
      400,
      { field: 'email', value: 'invalid' }
    );
    
    expect(error.details).toEqual({ field: 'email', value: 'invalid' });
  });
  
  it('should work without details', () => {
    const error = new AppError('Test error', 'TEST_ERROR', 400);
    expect(error.details).toBeUndefined();
  });
  
  it('should serialize correctly with toJSON', () => {
    const error = new ValidationError(
      'Validation failed',
      { fields: ['email', 'name'] }
    );
    
    const json = error.toJSON();
    expect(json.details).toEqual({ fields: ['email', 'name'] });
  });
});
```
