#!/bin/bash

# API_SMOKE_TESTS.sh - Symione Backend API Smoke Tests
# Run this after backend deployment to validate all endpoints
# Usage: bash API_SMOKE_TESTS.sh

set -e

API_BASE="https://api.symione.com"
TIMESTAMP=$(date +%s)
SESSION_ID="test-session-$TIMESTAMP"

echo "🚀 SYMIONE API SMOKE TESTS"
echo "=========================="
echo "API Base: $API_BASE"
echo "Timestamp: $TIMESTAMP"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

test_passed=0
test_failed=0

# Helper function to test endpoint
test_endpoint() {
    local name=$1
    local method=$2
    local endpoint=$3
    local data=$4
    local expected_status=$5

    echo -n "Testing $name... "
    
    if [ "$method" = "GET" ]; then
        response=$(curl -s -w "\n%{http_code}" "$API_BASE$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" \
            -H "Content-Type: application/json" \
            -d "$data" \
            "$API_BASE$endpoint")
    fi
    
    status_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} ($status_code)"
        ((test_passed++))
        echo "  Response: ${body:0:100}..."
    else
        echo -e "${RED}✗ FAIL${NC} (expected $expected_status, got $status_code)"
        ((test_failed++))
        echo "  Response: $body"
    fi
    echo ""
}

# Test 1: Health Check
echo "📊 1. HEALTH CHECK"
echo "------------------"
test_endpoint "Health Check" "GET" "/api/health" "" 200

# Test 2: Conseiller Analyze
echo "📊 2. CONSEILLER ANALYZE"
echo "------------------------"
analyze_data='{
  "problem": "J'\''ai un litige avec mon propriétaire concernant une augmentation de loyer abusive de 800€ à 1200€ sans justification. Le bail date de 2 ans. Que puis-je faire légalement?",
  "city": "Paris",
  "category": "Droit immobilier",
  "urgency": 7,
  "hasEvidence": true
}'
test_endpoint "Conseiller Analyze" "POST" "/api/conseiller/analyze" "$analyze_data" 200

# Test 3: Conseiller Step (Initial)
echo "📊 3. CONSEILLER STEP (Wizard)"
echo "------------------------------"
step_initial_data='{
  "sessionId": "'"$SESSION_ID"'",
  "message": "J'\''ai été licencié abusivement par mon employeur le mois dernier.",
  "isInitial": true
}'
test_endpoint "Step Initial" "POST" "/api/conseiller/step" "$step_initial_data" 200

# Test 4: Conseiller Step (Follow-up)
step_followup_data='{
  "contextId": "'"$SESSION_ID"'",
  "questionId": "situation",
  "answer": "Licenciement pour faute grave le 15 mars 2024"
}'
test_endpoint "Step Follow-up" "POST" "/api/conseiller/step" "$step_followup_data" 200

# Test 5: Conseiller Summarize
echo "📊 4. CONSEILLER SUMMARIZE"
echo "--------------------------"
summarize_data='{
  "contextId": "'"$SESSION_ID"'",
  "answers": {
    "situation": "Licenciement pour faute grave",
    "urgence": "8",
    "hasProofs": "true",
    "city": "Lyon"
  }
}'
test_endpoint "Summarize" "POST" "/api/conseiller/summarize" "$summarize_data" 200

# Test 6: Conseiller Chat (Initial)
echo "📊 5. CONSEILLER CHAT"
echo "---------------------"
chat_session_id="chat-$TIMESTAMP"
chat_initial_data='{
  "sessionId": "'"$chat_session_id"'",
  "message": "Je suis victime de harcèlement au travail depuis 6 mois.",
  "isInitial": true
}'
test_endpoint "Chat Initial" "POST" "/api/conseiller/chat" "$chat_initial_data" 200

# Test 7: Conseiller Chat (Follow-up)
chat_followup_data='{
  "sessionId": "'"$chat_session_id"'",
  "message": "Emails répétés, critiques injustifiées, isolement de l'\''équipe.",
  "isInitial": false
}'
test_endpoint "Chat Follow-up" "POST" "/api/conseiller/chat" "$chat_followup_data" 200

# Test 8: Conseiller Session GET
echo "📊 6. CONSEILLER SESSION"
echo "------------------------"
test_endpoint "Session GET" "GET" "/api/conseiller/session?sessionId=$chat_session_id" "" 200

# Test 9: Conseiller Export PDF
echo "📊 7. CONSEILLER EXPORT PDF"
echo "---------------------------"
export_data='{
  "sessionId": "'"$chat_session_id"'"
}'
echo -n "Testing Export PDF... "
curl -s -X POST \
    -H "Content-Type: application/json" \
    -d "$export_data" \
    "$API_BASE/api/conseiller/export" \
    -o "test_export_$TIMESTAMP.pdf" \
    -w "%{http_code}" > /tmp/pdf_status.txt

pdf_status=$(cat /tmp/pdf_status.txt)
if [ "$pdf_status" -eq "200" ] && [ -f "test_export_$TIMESTAMP.pdf" ]; then
    file_size=$(wc -c < "test_export_$TIMESTAMP.pdf")
    if [ "$file_size" -gt 1000 ]; then
        echo -e "${GREEN}✓ PASS${NC} (200, ${file_size} bytes)"
        ((test_passed++))
    else
        echo -e "${RED}✗ FAIL${NC} (PDF too small: ${file_size} bytes)"
        ((test_failed++))
    fi
else
    echo -e "${RED}✗ FAIL${NC} (status: $pdf_status)"
    ((test_failed++))
fi
echo ""

# Test 10: Conseiller Session DELETE
test_endpoint "Session DELETE" "DELETE" "/api/conseiller/session?sessionId=$chat_session_id" "" 200

# Test 11: Bond - Contracts Suggest
echo "📊 8. BOND - CONTRACTS SUGGEST"
echo "-------------------------------"
suggest_data='{
  "projectDescription": "Développement application mobile e-commerce avec paiement sécurisé",
  "budget": "5000",
  "duration": 60,
  "preferredPaymentStructure": "milestone"
}'
test_endpoint "Contracts Suggest" "POST" "/api/contracts/suggest" "$suggest_data" 200

# Test 12: Bond - Contracts Create
echo "📊 9. BOND - CONTRACTS CREATE"
echo "------------------------------"
create_data='{
  "projectDescription": "Application mobile iOS pour gestion de tâches",
  "totalAmount": 5000,
  "currency": "EUR",
  "milestones": [
    {
      "title": "Design UI/UX",
      "description": "Maquettes Figma complètes",
      "amount": 1500,
      "dueDate": "2025-12-01T00:00:00Z",
      "order": 1
    },
    {
      "title": "Développement MVP",
      "description": "Version beta fonctionnelle",
      "amount": 2500,
      "dueDate": "2026-01-15T00:00:00Z",
      "order": 2
    },
    {
      "title": "Tests et livraison",
      "description": "Tests QA et mise en production",
      "amount": 1000,
      "dueDate": "2026-02-01T00:00:00Z",
      "order": 3
    }
  ]
}'
test_endpoint "Contracts Create" "POST" "/api/contracts/create" "$create_data" 200

# Test 13: Templates Search
echo "📊 10. TEMPLATES SEARCH"
echo "-----------------------"
test_endpoint "Templates Search" "GET" "/api/documents/search?q=bail&limit=5" "" 200

# Summary
echo "=========================="
echo "📊 TEST SUMMARY"
echo "=========================="
echo -e "Total tests: $((test_passed + test_failed))"
echo -e "${GREEN}Passed: $test_passed${NC}"
echo -e "${RED}Failed: $test_failed${NC}"
echo ""

if [ $test_failed -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}✗ SOME TESTS FAILED${NC}"
    exit 1
fi

