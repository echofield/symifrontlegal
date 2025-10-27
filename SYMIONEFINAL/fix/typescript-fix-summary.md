# TypeScript Build Error Fix Summary

## Problem
TypeScript error at `src/lib/api/response.ts:55` - Property 'details' does not exist on type 'AppError'.

## Chosen Solution: Approach 1 - Add Optional `details` Property

I recommend **Approach 1** because it:
- Maintains type safety throughout the codebase
- Makes the intent explicit in the type system
- Allows proper IntelliSense and autocomplete
- Prevents future similar errors
- Follows TypeScript best practices

## Implementation Steps

### 1. Update AppError Class (src/lib/errors.ts)
Add the optional `details` property to the class:
- Add `public readonly details?: unknown;` as a class property
- Add `details?: unknown` parameter to constructor
- Assign `this.details = details;` in constructor
- Update `toJSON()` method to include details when present

### 2. Update Factory Functions
All error factory functions should accept optional details:
```typescript
export const ValidationError = (message: string, details?: unknown) =>
  new AppError(message, 'VALIDATION_ERROR', 422, details);
```

### 3. Verify response.ts
The existing code at line 55 will now work without changes since TypeScript recognizes the `details` property.

### 4. Fix withCors Usage
Change all instances from:
```typescript
// INCORRECT - two arguments
withCors(handler, options)
```

To:
```typescript
// CORRECT - single argument
withCors(handler)
// or
withCors(withValidation(schema, options, handler))
```

## Benefits of This Approach

1. **Type Safety**: The `details` property is properly typed as optional
2. **Backward Compatibility**: Existing code without details continues to work
3. **Flexibility**: Can attach any additional context to errors
4. **Debugging**: Better error context for troubleshooting
5. **API Consistency**: Uniform error shape across all endpoints

## Example Usage

```typescript
// Throwing errors with details
throw new ValidationError('Invalid input', {
  fields: {
    email: 'Invalid email format',
    age: 'Must be 18 or older'
  }
});

// API response will include:
{
  "success": false,
  "error": {
    "message": "Invalid input",
    "code": "VALIDATION_ERROR",
    "details": {
      "fields": {
        "email": "Invalid email format",
        "age": "Must be 18 or older"
      }
    }
  }
}
```

## Files to Modify

1. **src/lib/errors.ts** - Add details property to AppError
2. **src/lib/api/response.ts** - No changes needed after AppError update
3. **All API routes** - Fix withCors usage to single argument
4. **Any custom error classes** - Update constructors to pass details

## Verification Checklist

- [ ] AppError class has optional `details` property
- [ ] All error factory functions updated to accept details
- [ ] TypeScript build error at line 55 is resolved
- [ ] All withCors calls use single argument pattern
- [ ] Custom error classes updated if applicable
- [ ] Tests pass with new error structure
- [ ] API responses include details when present

## Migration Script

```bash
# Find all files that might need updating
echo "Files throwing AppError or its variants:"
grep -r "new AppError\|BadRequestError\|ValidationError\|NotFoundError" src/

echo "\nFiles with withCors usage:"
grep -r "withCors(" src/

echo "\nFiles referencing error.details:"
grep -r "error\.details" src/
```

## Alternative Approach Note

If you cannot modify the AppError class (e.g., it's from a shared library), use the type guard approach shown in `response-alternative.ts`. This approach:
- Doesn't require modifying AppError
- Uses runtime type checking
- Still maintains type safety in the response handler

However, I strongly recommend Approach 1 for better long-term maintainability.
