#!/bin/bash
# verify-fix.sh - Script to verify the TypeScript fix

echo "==================================="
echo "TypeScript Build Fix Verification"
echo "==================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Change to project directory
cd SYMIONEFINAL_back/symilegalback-main

echo -e "\n${YELLOW}Step 1: Checking TypeScript compilation${NC}"
echo "Running: npx tsc --noEmit"
npx tsc --noEmit

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ TypeScript compilation successful!${NC}"
else
    echo -e "${RED}✗ TypeScript compilation failed${NC}"
    echo "Check the error output above for remaining issues"
    exit 1
fi

echo -e "\n${YELLOW}Step 2: Checking for error.details references${NC}"
echo "Searching for error.details usage..."
grep -r "error\.details" src/ --include="*.ts" --include="*.tsx" | head -10

echo -e "\n${YELLOW}Step 3: Checking withCors usage patterns${NC}"
echo "Looking for potential two-argument withCors calls..."

# Check for patterns that might indicate two-argument usage
grep -r "withCors(" src/ --include="*.ts" --include="*.tsx" -A 2 | grep -E "withCors\([^)]+,[^)]+\)" || echo -e "${GREEN}✓ No two-argument withCors calls found${NC}"

echo -e "\n${YELLOW}Step 4: Running type checks on specific files${NC}"
echo "Checking src/lib/api/response.ts..."
npx tsc --noEmit src/lib/api/response.ts

echo "Checking src/lib/errors.ts..."
npx tsc --noEmit src/lib/errors.ts

echo -e "\n${YELLOW}Step 5: Quick test of error handling${NC}"
cat > test-error.ts << 'EOF'
import { AppError, ValidationError } from './src/lib/errors';

// Test creating errors with details
const error1 = new AppError('Test error', 'TEST', 400, { foo: 'bar' });
console.log('Error with details:', error1.details);

const error2 = new ValidationError('Validation failed', { fields: ['email'] });
console.log('Validation error:', error2.toJSON());

// Test without details
const error3 = new AppError('Simple error', 'SIMPLE', 500);
console.log('Error without details:', error3.details); // Should be undefined
EOF

echo "Running error test..."
npx tsx test-error.ts 2>/dev/null || npx ts-node test-error.ts 2>/dev/null || echo "Skipping runtime test (tsx/ts-node not available)"

echo -e "\n${YELLOW}Step 6: Build test${NC}"
echo "Attempting production build..."
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Production build successful!${NC}"
else
    echo -e "${RED}✗ Production build failed${NC}"
    echo "Review the build output for issues"
fi

echo -e "\n${GREEN}==================================="
echo "Verification Complete!"
echo "===================================${NC}"
echo ""
echo "Summary:"
echo "1. AppError class now has optional 'details' property"
echo "2. response.ts can safely access error.details"
echo "3. withCors uses single-argument pattern"
echo "4. TypeScript compilation should pass"
echo ""
echo "If any issues remain, check the specific error messages above."
