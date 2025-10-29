# 🎨 DESIGN VERIFICATION CHECKLIST - SYMIONE

> **Master Prompt for Design System Compliance**  
> Use this checklist before committing any UI component to ensure consistency, accessibility, and brand alignment.

---

## 📐 **1. GEOMETRIC ALIGNMENT**

### Grid System
- [ ] All elements aligned to **8pt base grid** (8, 16, 24, 32, 40, 48, 56, 64px)
- [ ] Exceptions: Text line-height can use 4pt increments for optical balance
- [ ] Container max-width: **1280px** (desktop), **100%** (mobile)
- [ ] Responsive breakpoints:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

### Spacing Scale
```typescript
// Tailwind spacing (adheres to 8pt grid)
space-1  = 4px   // Exception: fine-tuning only
space-2  = 8px   // Base unit ✅
space-3  = 12px  // Exception: text spacing
space-4  = 16px  // 2× base ✅
space-6  = 24px  // 3× base ✅
space-8  = 32px  // 4× base ✅
space-12 = 48px  // 6× base ✅
space-16 = 64px  // 8× base ✅
```

**Component Spacing Rules:**
- [ ] Card padding: `p-6` (24px) or `p-8` (32px)
- [ ] Section margins: `mb-8` (32px) or `mb-12` (48px)
- [ ] Button padding: `px-4 py-2` (16×8px) or `px-6 py-3` (24×12px)
- [ ] Form fields gap: `space-y-4` (16px) or `space-y-6` (24px)
- [ ] Radio/checkbox groups: `space-y-2` (8px) for tight, `space-y-3` (12px) for comfortable

---

## 🎨 **2. DESIGN TOKENS**

### Brand Colors (SYMIONE Palette)
```css
/* Primary - Blue */
--primary-50:  #eff6ff;
--primary-100: #dbeafe;
--primary-500: #3b82f6; /* Main brand color */
--primary-600: #2563eb;
--primary-700: #1d4ed8;

/* Accent - Purple */
--accent-500: #8b5cf6;
--accent-600: #7c3aed;

/* Neutral - Gray */
--gray-50:  #f9fafb;
--gray-100: #f3f4f6;
--gray-200: #e5e7eb;
--gray-300: #d1d5db;
--gray-700: #374151;
--gray-800: #1f2937;
--gray-900: #111827;

/* Semantic Colors */
--success: #10b981;
--warning: #f59e0b;
--error:   #ef4444;
--info:    #3b82f6;
```

**Color Usage:**
- [ ] Primary actions: `bg-primary-600 hover:bg-primary-700`
- [ ] Secondary actions: `bg-gray-200 hover:bg-gray-300 text-gray-900`
- [ ] Destructive actions: `bg-error hover:bg-red-600`
- [ ] Text hierarchy:
  - Headings: `text-gray-900`
  - Body: `text-gray-700`
  - Muted: `text-gray-500`
  - Disabled: `text-gray-400`

### Shadows
```css
/* Tailwind shadows (use sparingly) */
shadow-sm:  0 1px 2px 0 rgb(0 0 0 / 0.05)        // Subtle elevation
shadow:     0 1px 3px 0 rgb(0 0 0 / 0.1)         // Card default
shadow-md:  0 4px 6px -1px rgb(0 0 0 / 0.1)      // Dropdowns
shadow-lg:  0 10px 15px -3px rgb(0 0 0 / 0.1)    // Modals
shadow-xl:  0 20px 25px -5px rgb(0 0 0 / 0.1)    // Hero elements
```

**Shadow Rules:**
- [ ] Cards: `shadow` or `shadow-sm`
- [ ] Modals/Dialogs: `shadow-lg` or `shadow-xl`
- [ ] Dropdowns/Popovers: `shadow-md`
- [ ] Hover states: Increase shadow by one level (e.g., `shadow → shadow-md`)

### Border Radius
```css
rounded-sm:  2px   // Tight elements (badges)
rounded:     4px   // Default (buttons, inputs)
rounded-md:  6px   // Cards
rounded-lg:  8px   // Large cards, modals
rounded-xl:  12px  // Hero sections
rounded-2xl: 16px  // Feature cards
rounded-full: 9999px // Avatars, pills
```

---

## ✍️ **3. TYPOGRAPHY**

### Font Family
```css
font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
font-mono: 'Fira Code', 'Consolas', monospace
```

### Type Scale
```typescript
// Headings
text-4xl: 36px / 40px (2.25rem / 2.5rem)  // Hero h1
text-3xl: 30px / 36px (1.875rem / 2.25rem) // Page h1
text-2xl: 24px / 32px (1.5rem / 2rem)     // Section h2
text-xl:  20px / 28px (1.25rem / 1.75rem)  // Subsection h3
text-lg:  18px / 28px (1.125rem / 1.75rem) // Large body

// Body
text-base: 16px / 24px (1rem / 1.5rem)     // Default ✅
text-sm:   14px / 20px (0.875rem / 1.25rem) // Secondary text
text-xs:   12px / 16px (0.75rem / 1rem)    // Captions, labels
```

### Font Weight
```typescript
font-normal:   400  // Body text
font-medium:   500  // Emphasized text, labels
font-semibold: 600  // Buttons, headings
font-bold:     700  // Hero headings
```

**Typography Rules:**
- [ ] Headings: `font-semibold` or `font-bold`
- [ ] Body: `font-normal` (default)
- [ ] Buttons/Labels: `font-medium`
- [ ] Line height: 1.5 (24px for 16px text) for readability
- [ ] Paragraph spacing: `space-y-4` (16px) between paragraphs

---

## 📱 **4. RESPONSIVE DESIGN**

### Mobile-First Approach
- [ ] Base styles target mobile (`< 640px`)
- [ ] Use `sm:`, `md:`, `lg:`, `xl:` prefixes for larger screens
- [ ] Test on:
  - Mobile: 375px (iPhone SE)
  - Tablet: 768px (iPad)
  - Desktop: 1280px (MacBook Pro)

### Layout Patterns
```typescript
// Stack on mobile, side-by-side on desktop
<div class="flex flex-col lg:flex-row gap-4 lg:gap-8">

// Full width on mobile, constrained on desktop
<div class="w-full lg:w-1/2 xl:w-1/3">

// Hide on mobile, show on desktop
<div class="hidden lg:block">

// Responsive grid
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

### Touch Targets
- [ ] Minimum size: **44×44px** (iOS) or **48×48px** (Android)
- [ ] Button padding: `px-6 py-3` (24×12px min)
- [ ] Radio/Checkbox: `w-4 h-4` (16px) with `p-2` (8px) padding around

---

## ♿ **5. ACCESSIBILITY (A11Y)**

### Semantic HTML
- [ ] Use correct tags: `<button>`, `<nav>`, `<main>`, `<article>`, `<section>`
- [ ] Never use `<div>` for clickable elements (use `<button>`)
- [ ] Form labels: Always pair `<label htmlFor="id">` with `<input id="id">`

### ARIA Attributes
```typescript
// Required for screen readers
aria-label="Close dialog"          // Buttons without visible text
aria-labelledby="heading-id"       // Modal titles
aria-describedby="description-id"  // Error messages, hints
aria-expanded="true"               // Collapsible sections
aria-checked="true"                // Custom checkboxes
role="alert"                       // Error/success messages
```

### Keyboard Navigation
- [ ] All interactive elements focusable (no `tabindex="-1"` except for modals)
- [ ] Focus visible: `focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`
- [ ] Modal trap focus (use Radix UI primitives)
- [ ] Escape key closes modals/dropdowns

### Color Contrast
- [ ] WCAG AA: 4.5:1 for normal text, 3:1 for large text (18px+)
- [ ] Test with [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [ ] Never rely on color alone (use icons + text)

---

## 🎭 **6. ANIMATIONS & TRANSITIONS**

### Duration
```css
transition-none:   0ms
transition-fast:   150ms  // Hover states, tooltips
transition:        200ms  // Default ✅
transition-slow:   300ms  // Modals, page transitions
```

### Easing
```css
ease-linear:      linear
ease-in:          cubic-bezier(0.4, 0, 1, 1)
ease-out:         cubic-bezier(0, 0, 0.2, 1)     // Default ✅
ease-in-out:      cubic-bezier(0.4, 0, 0.2, 1)
```

**Animation Rules:**
- [ ] Hover states: `transition-colors duration-200 ease-out`
- [ ] Modals: `animate-in fade-in-0 zoom-in-95 duration-300`
- [ ] Toasts: `animate-in slide-in-from-right duration-200`
- [ ] Loading spinners: `animate-spin duration-1000`
- [ ] Respect `prefers-reduced-motion`:
```typescript
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🧩 **7. COMPONENT PATTERNS**

### Buttons
```typescript
// Primary
<button className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded shadow-sm transition-colors duration-200">

// Secondary
<button className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-medium rounded shadow-sm transition-colors duration-200">

// Destructive
<button className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded shadow-sm transition-colors duration-200">
```

### Form Fields
```typescript
// Input
<input className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent" />

// Textarea
<textarea className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent" rows={4} />

// Label
<label className="block text-sm font-medium text-gray-700 mb-2">
```

### Cards
```typescript
<div className="p-6 lg:p-8 bg-white border border-gray-200 rounded-lg shadow-sm">
  <h3 className="text-xl font-semibold text-gray-900 mb-4">Card Title</h3>
  <p className="text-gray-700">Card content...</p>
</div>
```

### Radio Groups (Tight Spacing)
```typescript
<div className="space-y-2">
  {options.map(opt => (
    <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
      <input type="radio" name="group" value={opt.value} className="w-4 h-4" />
      <span className="text-sm text-gray-700">{opt.label}</span>
    </label>
  ))}
</div>
```

---

## ✅ **8. PRE-COMMIT CHECKLIST**

Before committing any UI component:

### Design
- [ ] Aligned to 8pt grid
- [ ] Uses SYMIONE color tokens
- [ ] Typography scale respected
- [ ] Shadows appropriate for elevation
- [ ] Border radius consistent

### Responsive
- [ ] Tested on mobile (375px)
- [ ] Tested on tablet (768px)
- [ ] Tested on desktop (1280px)
- [ ] Touch targets ≥ 44px

### Accessibility
- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Keyboard navigable
- [ ] Focus visible
- [ ] Color contrast ≥ 4.5:1

### Performance
- [ ] No layout shifts (CLS)
- [ ] Images have width/height
- [ ] Animations respect reduced-motion
- [ ] No unnecessary re-renders

### Code Quality
- [ ] No console.log/errors
- [ ] TypeScript types defined
- [ ] Props documented (JSDoc)
- [ ] Error boundaries in place

---

## 🎯 **SYMIONE-SPECIFIC RULES**

### Brand Voice
- Professional but approachable
- Use "vous" (formal French)
- Clear, concise legal language
- No jargon without explanation

### Component Naming
```typescript
// ✅ Good
ConseillerChatView.tsx
BondCreateView.tsx
LawyerContactCard.tsx

// ❌ Bad
chat.tsx
create-bond.tsx
lawyer_card.tsx
```

### File Structure
```
src/
├── components/
│   ├── ui/              # Primitives (Radix-based)
│   ├── *View.tsx        # Page-level components
│   └── *Card.tsx        # Reusable components
├── lib/
│   ├── api-client.ts    # API layer
│   └── utils.ts         # Utilities
└── styles/
    └── globals.css      # Tailwind + custom
```

---

## 📚 **REFERENCES**

- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design 3](https://m3.material.io/) (inspiration only)
- [Inter Font](https://rsms.me/inter/)

---

**Last Updated**: 2025-10-29  
**Version**: 1.0.0  
**Maintainer**: Symione Design System Team

