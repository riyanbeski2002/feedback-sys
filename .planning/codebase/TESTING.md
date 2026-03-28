# Testing Patterns

**Analysis Date:** 2025-03-28

## Test Framework

**Status:** No testing framework configured

**Observations:**
- `package.json` contains 0 testing dependencies (no Jest, Vitest, Playwright, Cypress)
- No test files found in codebase (0 `.test.ts`, `.test.tsx`, `.spec.ts`, `.spec.tsx` files)
- No `jest.config.js`, `vitest.config.ts`, or similar test configuration files
- No E2E testing framework installed

**Implication:** Testing infrastructure needs to be established from scratch.

## Recommended Testing Setup

**For this codebase architecture, recommended frameworks:**

**Unit Testing:**
- Framework: Vitest (faster, ESM-native, better for modern projects)
- Runner command: `vitest`
- Watch mode: `vitest --watch`
- Coverage: `vitest --coverage`

**Integration Testing:**
- Framework: Vitest (same runner)
- Scope: Database interactions, server actions, API responses

**E2E Testing:**
- Framework: Playwright (recommended for Next.js)
- Purpose: User workflows across pages and components

## Test File Organization

**Recommended Location:**
- Co-located: Place `.test.tsx` files next to component files
- OR separate: `src/__tests__/` directory with mirrored structure

**Recommended Naming:**
- Component test: `button.test.tsx` next to `button.tsx`
- Utility test: `utils.test.ts` next to `utils.ts`
- Page test: `page.test.tsx` next to `page.tsx`

**Recommended Structure:**
```
src/
├── components/
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── button.test.tsx
│   │   └── card.tsx
│   └── layout/
│       ├── app-sidebar.tsx
│       └── app-sidebar.test.tsx
├── features/
│   ├── feedback/
│   │   ├── actions/
│   │   │   ├── submit-feedback.ts
│   │   │   └── submit-feedback.test.ts
│   │   ├── lib/
│   │   │   ├── scoring.ts
│   │   │   ├── scoring.test.ts
│   │   │   └── analysis.ts
│   │   └── components/
│   │       ├── feedback-form.tsx
│   │       └── feedback-form.test.tsx
└── lib/
    ├── utils.ts
    └── utils.test.ts
```

## Test Structure

**Recommended Suite Organization (Vitest pattern):**

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { calculateWeightedScore } from '@/features/feedback/lib/scoring'

describe('Feedback Scoring', () => {
  describe('calculateWeightedScore', () => {
    it('should calculate correct weighted score with equal ratings', () => {
      const ratings = {
        value_for_money: 4,
        service_quality: 4,
        room_cleanliness: 4,
        amenities_provided: 4,
        recommend_to_colleagues: 4,
      }

      const result = calculateWeightedScore(ratings)
      expect(result).toBe(4.0)
    })

    it('should apply correct weights to ratings', () => {
      // Test individual weight contributions
    })

    it('should round to 2 decimal places', () => {
      // Test rounding behavior
    })
  })
})
```

**Patterns:**
- Use `describe()` blocks to group related tests
- Use `it()` for individual test cases with descriptive names
- Test one behavior per test
- Follow Arrange-Act-Assert pattern

## Mocking

**Framework:** Vitest built-in mocking via `vi.mock()`

**Recommended Approach for This Codebase:**

**Mocking Supabase Client:**
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { submitFeedback } from '@/features/feedback/actions/submit-feedback'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(),
}))

describe('submitFeedback action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should insert feedback and return success', async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { ... } }),
        update: vi.fn().mockReturnThis(),
      }),
    }

    vi.mocked(createClient).mockResolvedValue(mockSupabase)

    const result = await submitFeedback({ ... })
    expect(result.success).toBe(true)
  })
})
```

**Mocking React Hook Form:**
```typescript
import { useForm } from 'react-hook-form'

vi.mock('react-hook-form', () => ({
  useForm: vi.fn().mockReturnValue({
    register: vi.fn(),
    handleSubmit: vi.fn(),
    formState: { errors: {} },
  }),
}))
```

**Mocking Next.js Navigation:**
```typescript
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  usePathname: vi.fn(),
  redirect: vi.fn(),
}))
```

**What to Mock:**
- Database clients (Supabase)
- External API calls
- Next.js navigation and routing
- Heavy third-party libraries
- File system operations

**What NOT to Mock:**
- Utility functions (calculate, format, parse)
- Business logic libraries (scoring, analysis)
- UI component libraries (Button, Card)
- Zod schemas and validation

## Fixtures and Factories

**Recommended Test Data Pattern:**

Create `src/__tests__/fixtures/` or co-locate in `*.fixtures.ts`:

```typescript
// feedback.fixtures.ts
export const createMockBooking = (overrides = {}) => ({
  id: '123e4567-e89b-12d3-a456-426614174000',
  traveller_name: 'John Doe',
  traveller_email: 'john@example.com',
  hotel_id: '550e8400-e29b-41d4-a716-446655440000',
  status: 'completed',
  feedback_submitted: false,
  ...overrides,
})

export const createMockRatings = (overrides = {}) => ({
  value_for_money: 4,
  service_quality: 4,
  room_cleanliness: 5,
  amenities_provided: 3,
  recommend_to_colleagues: 4,
  ...overrides,
})

export const createMockFeedback = (overrides = {}) => ({
  bookingId: 'booking-123',
  hotelId: 'hotel-456',
  ...createMockRatings(),
  comment: 'Great stay',
  ...overrides,
})
```

**Usage in tests:**
```typescript
it('should calculate score from ratings', () => {
  const ratings = createMockRatings()
  const result = calculateWeightedScore(ratings)
  expect(result).toBeGreaterThan(0)
})
```

**Location:**
- `src/__tests__/fixtures/` for shared fixtures
- `feature.fixtures.ts` for feature-specific test data
- Reference fixtures for each major entity (Booking, Hotel, Feedback, etc.)

## Coverage

**Requirements:** Not enforced (no testing infrastructure exists)

**Recommended Target:** 80%+ for critical paths
- Utilities: 90%+
- Server actions: 85%+
- React components: 70%+
- Pages: 50%+ (harder to test due to data fetching)

**View Coverage:**
```bash
npm run test -- --coverage
```

**Coverage Report Files (when implemented):**
```
coverage/
├── lcov-report/
│   └── index.html
├── coverage-final.json
└── lcov.info
```

## Test Types

**Unit Tests:**
- Scope: Single functions in isolation (scoring.ts, analysis.ts, utils.ts)
- Approach: No external dependencies, pure functions
- Examples: `calculateWeightedScore`, `analyzeFeedback`, `cn()` utility
- Sample:
```typescript
describe('calculateWeightedScore', () => {
  it('should weight cleanliness at 30%', () => {
    const result = calculateWeightedScore({
      room_cleanliness: 5,
      service_quality: 0,
      value_for_money: 0,
      amenities_provided: 0,
      recommend_to_colleagues: 0,
    })
    expect(result).toBe(1.5) // 5 * 0.30
  })
})
```

**Integration Tests:**
- Scope: Server actions with mocked Supabase
- Approach: Mock database interactions, test business logic flow
- Examples: `submitFeedback` action updating multiple tables
- Sample:
```typescript
describe('submitFeedback integration', () => {
  it('should insert feedback, update hotel stats, and update booking status', async () => {
    const mockSupabase = createMockSupabaseClient()

    const result = await submitFeedback({
      bookingId: 'b123',
      hotelId: 'h456',
      value_for_money: 4,
      // ... other ratings
    })

    expect(mockSupabase.from).toHaveBeenCalledWith('feedback')
    expect(mockSupabase.from).toHaveBeenCalledWith('hotels')
    expect(mockSupabase.from).toHaveBeenCalledWith('bookings')
  })
})
```

**E2E Tests (Not Yet Implemented):**
- Framework: Playwright
- Scope: Full user workflows end-to-end
- Examples:
  - User navigates to feedback form → submits → sees success screen
  - Admin views dashboard → filters hotels → sees flagged items
- Sample structure:
```typescript
import { test, expect } from '@playwright/test'

test('user can submit feedback and see success', async ({ page }) => {
  await page.goto('/feedback/booking-123')
  await page.fill('[name="value_for_money"]', '4')
  await page.fill('[name="service_quality"]', '4')
  // ... fill other fields
  await page.click('button:has-text("Submit")')
  await expect(page).toHaveURL('/feedback/success')
  await expect(page.getByText('Thank you')).toBeVisible()
})
```

## Common Patterns

**Async Testing:**
```typescript
// Action testing with async/await
it('should handle async operations', async () => {
  const result = await submitFeedback(mockData)
  expect(result.success).toBe(true)
})

// Promise-based testing
it('should return promise', () => {
  return submitFeedback(mockData).then(result => {
    expect(result.success).toBe(true)
  })
})
```

**Error Testing:**
```typescript
describe('Error handling', () => {
  it('should return error when database insert fails', async () => {
    mockSupabase.from.mockReturnValue({
      insert: vi.fn().mockResolvedValue({
        error: { message: 'Constraint violation' }
      }),
    })

    const result = await submitFeedback(mockData)
    expect(result.error).toBe('Constraint violation')
  })

  it('should handle missing required fields', () => {
    expect(() => {
      calculateWeightedScore(incompleteRatings)
    }).toThrow()
  })
})
```

**Component Testing (with React Testing Library):**
```typescript
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button component', () => {
  it('should render with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
```

## Setup Required

**Installation:**
```bash
npm install -D vitest @vitest/ui
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @playwright/test  # for E2E
npm install -D @vitest/coverage-v8  # for coverage
```

**Config file needed:** `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

**Scripts to add to package.json:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:ui": "vitest --ui",
    "test:e2e": "playwright test"
  }
}
```

---

*Testing analysis: 2025-03-28*
