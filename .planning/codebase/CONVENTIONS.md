# Coding Conventions

**Analysis Date:** 2025-03-28

## Naming Patterns

**Files:**
- React components: PascalCase with `.tsx` extension (e.g., `AppSidebar.tsx`, `BookingTable.tsx`)
- Utility/helper files: lowercase with hyphens for compound names (e.g., `app-sidebar.tsx`, `booking-table.tsx`)
- Actions: lowercase with hyphens, suffix `action.ts` (e.g., `submit-feedback.ts`)
- Hooks: camelCase with `use-` prefix (e.g., `use-mobile.ts`)
- Libraries: lowercase (e.g., `scoring.ts`, `analysis.ts`)
- UI components: lowercase (e.g., `button.tsx`, `card.tsx`, `badge.tsx`)

**Functions:**
- camelCase for all function names
- Exported component functions: PascalCase (e.g., `FeedbackForm`, `BookingTable`, `MetricCards`)
- Utility functions: camelCase (e.g., `calculateWeightedScore`, `analyzeFeedback`, `createClient`)
- React hooks: `useXxx` pattern (e.g., `useIsMobile`)
- Server actions: camelCase, descriptive of the action (e.g., `submitFeedback`, `updateConfig`, `simulateCheckout`)

**Variables:**
- camelCase for all local and module variables
- Constants: SCREAMING_SNAKE_CASE for truly immutable values (e.g., `MOBILE_BREAKPOINT`)
- Interface/type properties: camelCase (e.g., `value_for_money`, `sentiment_label`, `urgency_flag` follow underscore convention for database field mapping)
- Props objects: camelCase properties

**Types:**
- Interfaces: PascalCase with `Props` suffix for component props (e.g., `ButtonProps`, `MetricCardsProps`)
- Type aliases: PascalCase (e.g., `FeedbackFormValues`, `FeedbackRatings`)
- Database-mapped interfaces: camelCase with underscores for field names (e.g., `FeedbackAnalysis`, `FeedbackRatings`)

## Code Style

**Formatting:**
- No explicit formatter detected (no `.prettierrc` or ESLint config found)
- Observed patterns: 2-space indentation, single quotes in JSX attributes, double quotes for string literals
- Semicolons: not used consistently but present in type definitions
- Line length: not enforced, varies but generally readable

**Linting:**
- No ESLint config found (Next.js default linting via `npm run lint`)
- No TypeScript strict mode enabled (`"strict": false` in tsconfig.json)
- Files use optional chaining (`?.`) and nullish coalescing (`??`)
- Import resolution uses path alias `@/*` mapping to `./src/*`

## Import Organization

**Order:**
1. React and Next.js core imports
2. Third-party UI libraries (Radix UI, Lucide icons, Framer Motion)
3. Form handling libraries (@hookform, zod)
4. Internal path-aliased imports (`@/components`, `@/lib`, `@/features`, `@/hooks`)
5. Relative imports (same directory or parent)

**Path Aliases:**
- `@/*` maps to `./src/*` - used throughout for absolute imports
- Always use path aliases for cross-module imports, never relative paths going up directories

**Examples from codebase:**
```typescript
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import { submitFeedback } from "../actions/submit-feedback"
import { BookingTable } from "./booking-table"
```

## Error Handling

**Patterns:**
- Async functions return `{ error: string }` or `{ success: boolean }` tuples for actions
- Database errors captured and returned as `{ error: errorMessage }`
- Silent catches for non-critical operations (e.g., cookie setting in middleware)
- React error boundaries implied but not explicitly shown in sampled code
- Validation errors handled via Zod schema with react-hook-form integration

**Example pattern from `submit-feedback.ts`:**
```typescript
if (feedbackError) {
  return { error: feedbackError.message }
}
```

## Logging

**Framework:** `console` (no dedicated logging library detected)

**Patterns:**
- Minimal logging observed in codebase
- Debugging likely done via TypeScript and IDE inspection
- Toast notifications used for user-facing feedback (via `sonner` library)
- No server-side logging infrastructure visible

**Usage observed:**
```typescript
const { error: feedbackError } = await supabase...
if (feedbackError) {
  return { error: feedbackError.message }
}
```

## Comments

**When to Comment:**
- Algorithm explanations required (e.g., Bayesian Average calculation in `scoring.ts`)
- Non-obvious business logic (e.g., status bucket determination thresholds)
- Field mappings between frontend forms and database columns
- Block comments for section organization

**JSDoc/TSDoc:**
- No explicit JSDoc found in sampled files
- Type annotations preferred over comments for function signatures
- Interfaces document structure (e.g., `FeedbackAnalysis`, `FeedbackRatings`)

**Example from `scoring.ts`:**
```typescript
// Weights from PRD:
// Cleanliness = 30%
// Service = 30%
// Value = 20%
// Amenities = 10%
// Recommendation = 10%
```

## Function Design

**Size:** Small to medium functions, typically 10-40 lines for business logic

**Parameters:**
- Destructured props for React components
- Single object parameter for server actions (data: any, later validated with Zod)
- Interface-typed parameters preferred over primitive unions

**Return Values:**
- Components: JSX.Element (no explicit return type annotation observed)
- Utilities: typed return values (e.g., `number` for scoring functions)
- Server actions: explicit result tuples `{ error?: string; success?: boolean }`
- React hooks: implicit return typing (e.g., `useIsMobile` returns `boolean`)

**Example pattern:**
```typescript
export function calculateWeightedScore(ratings: FeedbackRatings): number {
  // calculation
  return Math.round(totalScore * 100) / 100
}
```

## Module Design

**Exports:**
- Named exports preferred: `export function`, `export interface`, `export { Component }`
- Default exports used for pages and layout components in app router
- Barrel files (index.ts) not observed, direct imports used instead

**Example pattern:**
```typescript
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
export { Button, buttonVariants }
```

**Barrel Files:** Not used; imports directly reference component files

**Feature-Based Structure:**
- Features organized in `src/features/[feature]/` with:
  - `components/` for UI components
  - `actions/` for server actions
  - `lib/` for business logic and utilities
  - Layout and pages at `src/app/`

## React Conventions

**Server vs Client:**
- Server components by default (Next.js 13+)
- `"use client"` directive required for interactive components (forms, hooks, event listeners)
- Server actions use `"use server"` directive

**Component Structure:**
- Functional components with hooks
- React.forwardRef for reusable UI primitives
- Destructured props with TypeScript interfaces

**Styling:**
- Tailwind CSS for all styling
- `cn()` utility function (from `@/lib/utils`) for conditional class merging
- CSS variables for design tokens (e.g., `--status-top-rated-bg`, `--metric-info`)
- Class Variance Authority (CVA) for component variants (e.g., Button variants)

---

*Convention analysis: 2025-03-28*
