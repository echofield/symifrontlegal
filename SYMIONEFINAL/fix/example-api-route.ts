// Example: pages/api/users/[id].ts or app/api/users/[id]/route.ts

import { NextApiRequest, NextApiResponse } from 'next';
import { withCors, withMethods, withErrorHandler, withValidation, compose } from '@/lib/api/middleware';
import { sendSuccess, sendError } from '@/lib/api/response';
import { AppError, NotFoundError, ValidationError } from '@/lib/errors';

// Example validation schema (replace with your actual validation library)
const updateUserSchema = {
  body: {
    // Your validation schema here
    // e.g., using Zod: z.object({ name: z.string().min(1), email: z.string().email() })
  }
};

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  
  switch (req.method) {
    case 'GET':
      // Fetch user
      const user = await getUserById(id as string);
      if (!user) {
        throw NotFoundError('User not found', { userId: id });
      }
      sendSuccess(res, user);
      break;
      
    case 'PUT':
      // Update user
      const updatedUser = await updateUser(id as string, req.body);
      if (!updatedUser) {
        throw NotFoundError('User not found', { userId: id });
      }
      sendSuccess(res, updatedUser);
      break;
      
    case 'DELETE':
      // Delete user
      const deleted = await deleteUser(id as string);
      if (!deleted) {
        throw NotFoundError('User not found', { userId: id });
      }
      sendSuccess(res, { message: 'User deleted successfully' });
      break;
      
    default:
      throw new AppError('Method not allowed', 'METHOD_NOT_ALLOWED', 405);
  }
}

// CORRECT USAGE - Single argument to withCors:
export default withCors(
  withErrorHandler(
    withMethods(['GET', 'PUT', 'DELETE'], handler)
  )
);

// Alternative with validation - still single argument to withCors:
export const handlerWithValidation = withCors(
  withValidation(
    updateUserSchema,
    { onError: (err) => console.error('Validation error:', err) },
    withErrorHandler(handler)
  )
);

// Using compose for cleaner syntax:
export const composedHandler = compose(
  withCors,
  withErrorHandler,
  withMethods(['GET', 'PUT', 'DELETE'])
)(handler);

// Mock functions (replace with your actual database logic)
async function getUserById(id: string) {
  // Your database logic
  return { id, name: 'John Doe', email: 'john@example.com' };
}

async function updateUser(id: string, data: any) {
  // Your database logic
  if (!data.name || !data.email) {
    throw ValidationError('Name and email are required', { 
      fields: ['name', 'email'] 
    });
  }
  return { id, ...data };
}

async function deleteUser(id: string) {
  // Your database logic
  return true;
}
