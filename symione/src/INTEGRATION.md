# SYMIONE Backend Integration

## System Architecture

SYMIONE (lex-engine) fonctionne comme un **instrument d'intelligence juridique de précision** avec intégration complète de l'API backend.

### Core Components

#### 1. API Client (`/lib/lexClient.ts`)
Centralized SDK for all backend communication:
- Health monitoring
- Template catalog browsing
- Contract generation (AI-powered)
- Compliance review
- Clause explanation
- Document export (PDF/DOCX)

#### 2. Type System (`/types/contracts.ts`)
Mirrors backend contract schema:
- `ContractTemplate` - Template structure with inputs, clauses, annotations
- `ContractIndexEntry` - Catalog metadata
- `GenerateResponse`, `ReviewResponse`, `ExplainResponse` - API responses
- `ApiError` - Unified error handling with rate limit support

#### 3. Rate Limiting (`/hooks/useRateLimit.ts`)
- Automatic countdown for 429 responses
- Visual feedback showing retry time
- Respects `X-RateLimit-Reset` headers

#### 4. System Feedback (`/components/SystemToast.tsx`)
- Minimal toast notifications
- Success/error/info variants
- Instrument panel aesthetic (no playful animations)

#### 5. System Health (`/components/SystemStatus.tsx`)
- Live backend health monitoring
- Bottom-left status indicator
- Auto-checks every 60 seconds

---

## User Flows

### Template Catalog
**Route:** Home → Synthesis Module

1. `GET /api/contracts` - Fetch template index
2. Display searchable grid with categories
3. Filter by name, category, or ID
4. Select template → Navigate to editor

### Contract Generation
**Route:** Template Editor

1. `GET /api/contracts/{id}` - Load template schema
2. Build dynamic form from `template.inputs`
3. Validate required fields
4. `POST /api/generate` with user inputs
5. Display generated contract text
6. Handle rate limiting with countdown UI

### Compliance Review
**Feature:** Review Panel (modal)

1. Click "Review" button on generated contract
2. `POST /api/review` with contract text
3. Display:
   - Overall risk level (low/medium/high)
   - Detailed red flags with severity
   - AI-generated summary
   - Actionable suggestions

### Export
**Feature:** Export buttons (PDF/DOCX)

1. `POST /api/export` with contract text + metadata
2. Browser download triggered automatically
3. Success toast confirmation

---

## Error Handling

### Rate Limit (429)
```typescript
// Automatic retry countdown
if (err.code === 'RATE_LIMIT') {
  setRateLimitRetry(err.retryInSec);
  // UI shows: "Retry in 24s" with live countdown
}
```

### Network Errors
```typescript
// parseError() handles non-JSON responses
catch (err) {
  showToast(err.message || 'Request failed', 'error');
}
```

### Validation Errors
```typescript
// Client-side validation before API call
const missingFields = template.inputs
  .filter(input => input.required && !formData[input.key]);

if (missingFields.length > 0) {
  showToast(`Required: ${missingFields.join(', ')}`, 'error');
  return;
}
```

---

## State Management

### Local Form State
- Form inputs persist in component state
- TODO: Add localStorage persistence for draft recovery

### Template Cache
- Templates fetched once per session
- No caching layer yet (fetch on navigation)
- TODO: Add SWR or React Query for stale-while-revalidate

---

## Motion Language

All API-triggered states use **servo-precision motion**:
- Loading: Linear spinner (no bounce)
- Success: 200ms fade-in from 6px offset
- Error: Toast slides from bottom-right
- Modal: 200ms linear opacity + translateY

---

## Environment Variables

None required for same-origin API routes.

Optional (if using Supabase):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## Performance Notes

- No prefetching on AI routes (counts toward rate limit)
- Template catalog cached in memory for session
- Debounce search input (TODO: implement)
- Lazy-load review panel (only mounts when opened)

---

## Accessibility

- All inputs use semantic labels from `template.inputs.label`
- Toast notifications use ARIA live regions
- Focus states use precision blue underline (1px)
- Keyboard navigation supported throughout

---

## Next Steps

1. Add localStorage for draft recovery
2. Implement SWR/React Query for template caching
3. Add WebSocket for real-time generation progress
4. Lawyer mode: Enable clause editing via PATCH
5. Add Supabase auth for multi-user sessions

---

## Philosophie Système

> "Moins un site web, plus un panneau de contrôle pour la pensée."

Chaque interaction doit être **calculée, pas décorative** :
- Motion is linear, not elastic
- Feedback is informational, not playful
- Typography is monospaced for data, Inter for prose
- Status indicators pulse like a heartbeat, not bounce like a ball

This is an **instrument**, not a SaaS product.
