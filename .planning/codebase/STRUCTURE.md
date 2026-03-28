# Codebase Structure

**Analysis Date:** 2026-03-28

## Directory Layout

```
feedback-sys/
├── src/                           # All application code
│   ├── app/                       # Next.js App Router pages
│   │   ├── (dashboard)/           # Route group for authenticated pages with sidebar
│   │   │   ├── admin/             # Admin dashboard
│   │   │   ├── bookings/          # Bookings list
│   │   │   ├── feedback/          # Feedback form & success
│   │   │   │   ├── [bookingId]/   # Dynamic: single booking feedback
│   │   │   │   └── success/       # Success confirmation screen
│   │   │   ├── hotels/            # Hotel discovery & filtering
│   │   │   ├── notifications/     # Notification management
│   │   │   ├── settings/          # Settings page
│   │   │   ├── layout.tsx         # Dashboard layout wrapper
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Root page (redirects to /admin)
│   │   └── globals.css            # Global styles
│   │
│   ├── features/                  # Feature-based domain modules
│   │   ├── feedback/              # Feedback submission & analysis
│   │   │   ├── components/        # FeedbackForm, StarRating, DuplicateError
│   │   │   ├── actions/           # submit-feedback.ts (server action)
│   │   │   └── lib/               # scoring.ts, analysis.ts (utilities)
│   │   ├── bookings/              # Booking management
│   │   │   ├── components/        # BookingTable, CheckoutDialog
│   │   │   └── actions/           # simulate-checkout.ts
│   │   ├── hotels/                # Hotel discovery
│   │   │   └── components/        # HotelGrid, HotelCard
│   │   ├── admin/                 # Admin features
│   │   │   ├── components/        # MetricCards, FlaggedHotelsTable, RecentFeedbackFeed
│   │   │   └── actions/           # update-config.ts
│   │   └── notifications/         # Notification channels
│   │       └── components/        # NotificationsClient, SlackPreview, EmailPreview, TeamsPreview, WhatsAppPreview
│   │
│   ├── components/                # Shared UI components
│   │   ├── ui/                    # Primitive components from shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sidebar.tsx        # Radix UI sidebar components
│   │   │   ├── table.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── badge.tsx
│   │   │   └── separator.tsx
│   │   ├── layout/                # Layout components
│   │   │   ├── app-sidebar.tsx    # Main navigation sidebar
│   │   │   └── site-header.tsx    # Top navigation bar
│   │   └── theme-provider.tsx     # Tailwind dark mode provider
│   │
│   ├── lib/                       # Shared utilities & infrastructure
│   │   ├── supabase/              # Supabase client initialization
│   │   │   ├── client.ts          # Browser Supabase client
│   │   │   ├── server.ts          # Server Supabase client
│   │   │   └── middleware.ts      # Session refresh logic
│   │   └── utils.ts               # Tailwind className merge utility (cn)
│   │
│   ├── hooks/                     # Custom React hooks
│   │   └── use-mobile.ts          # Responsive mobile detection
│   │
│   ├── scripts/                   # Utility scripts
│   │   └── seed.ts                # Database seeding
│   │
│   └── middleware.ts              # Next.js middleware for auth
│
├── .next/                         # Next.js build output
├── node_modules/                  # Dependencies
├── .planning/                     # Project planning documents
├── .env.local                     # Local environment variables
├── components.json                # shadcn/ui component registry
├── next-env.d.ts                  # Next.js TypeScript definitions
├── package.json                   # Dependencies
├── package-lock.json              # Lock file
├── postcss.config.mjs             # PostCSS configuration
├── tsconfig.json                  # TypeScript configuration
└── README.md                       # Project README
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router pages and route structure
- Contains: Page routes, layout components, API routes
- Key files: `layout.tsx`, `page.tsx`, `(dashboard)/layout.tsx`, dynamic routes like `feedback/[bookingId]/page.tsx`

**`src/app/(dashboard)/`:**
- Purpose: Route group for authenticated dashboard pages
- Contains: All pages that require auth and use sidebar layout
- Key files: `admin/page.tsx`, `bookings/page.tsx`, `hotels/page.tsx`, `feedback/[bookingId]/page.tsx`

**`src/features/feedback/`:**
- Purpose: All feedback-related functionality
- Contains: Feedback form UI, submission logic, scoring and analysis utilities
- Key files: `components/feedback-form.tsx`, `actions/submit-feedback.ts`, `lib/scoring.ts`, `lib/analysis.ts`

**`src/features/bookings/`:**
- Purpose: Booking management
- Contains: Booking table display, checkout simulation
- Key files: `components/booking-table.tsx`, `actions/simulate-checkout.ts`

**`src/features/hotels/`:**
- Purpose: Hotel discovery and display
- Contains: Hotel grid display, hotel cards, filtering logic
- Key files: `components/hotel-grid.tsx`, `components/hotel-card.tsx`

**`src/features/admin/`:**
- Purpose: Admin dashboard features
- Contains: Metrics cards, flagged hotels table, recent feedback feed
- Key files: `components/metric-cards.tsx`, `components/flagged-hotels-table.tsx`, `components/recent-feedback-feed.tsx`

**`src/features/notifications/`:**
- Purpose: Notification management and preview
- Contains: Multi-channel notification display (Slack, Email, Teams, WhatsApp)
- Key files: `components/notifications-client.tsx`, `components/slack-preview.tsx`, `components/email-preview.tsx`

**`src/components/ui/`:**
- Purpose: Reusable primitive UI components from shadcn/ui
- Contains: Low-level components (Button, Card, Dialog, Form, etc.)
- Pattern: Each component exported as single function component

**`src/components/layout/`:**
- Purpose: Layout-level components used across pages
- Contains: AppSidebar, SiteHeader
- Key files: `app-sidebar.tsx` (navigation), `site-header.tsx` (top bar)

**`src/lib/supabase/`:**
- Purpose: Supabase client abstraction
- Contains: Browser client factory, server client factory, middleware session refresh
- Key files: `client.ts` (createClient for browser), `server.ts` (createClient for server), `middleware.ts`

**`src/lib/`:**
- Purpose: Shared utilities
- Contains: Tailwind className merge utility
- Key files: `utils.ts` (cn function)

**`src/hooks/`:**
- Purpose: Custom React hooks
- Contains: Mobile detection hook
- Key files: `use-mobile.ts`

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Root page that redirects to `/admin`
- `src/middleware.ts`: Next.js middleware that refreshes session on every request

**Configuration:**
- `tsconfig.json`: TypeScript settings, path alias `@/*` → `./src/*`
- `postcss.config.mjs`: PostCSS configuration for Tailwind CSS
- `components.json`: shadcn/ui component registry and configuration
- `.env.local`: Environment variables (Supabase URL, keys, etc.)

**Core Logic:**
- `src/features/feedback/lib/scoring.ts`: Weighted score calculation (30% cleanliness, 30% service, 20% value, 10% amenities, 10% recommendation)
- `src/features/feedback/lib/analysis.ts`: Sentiment analysis and issue classification
- `src/features/feedback/actions/submit-feedback.ts`: Complete feedback submission pipeline (validation, scoring, analysis, database updates, path revalidation)

**Testing:**
- No test files detected (no `.test.tsx` or `.spec.ts` files in codebase)

## Naming Conventions

**Files:**
- Components: kebab-case with `.tsx` or `.tsx` extension (e.g., `feedback-form.tsx`, `booking-table.tsx`)
- Server actions: kebab-case with `.ts` extension in `actions/` folder (e.g., `submit-feedback.ts`, `simulate-checkout.ts`)
- Utilities: kebab-case with `.ts` extension (e.g., `scoring.ts`, `analysis.ts`)
- Layout files: `layout.tsx`
- Page files: `page.tsx`
- Index files: `index.ts` for barrel exports (not observed, but would follow pattern)

**Directories:**
- Feature folders: singular lowercase (e.g., `feedback`, `bookings`, `hotels`, not `feedbacks`)
- Sub-folders: lowercase plural for categories (e.g., `components`, `actions`, `lib`)
- Route groups: parentheses for logical grouping (e.g., `(dashboard)`)
- Dynamic routes: square brackets (e.g., `[bookingId]`)

**Components:**
- Export function names: PascalCase (e.g., `FeedbackForm`, `BookingTable`, `MetricCards`)
- Props interface names: PascalCase with `Props` suffix or inlined in function signature
- Internal state hooks: camelCase (e.g., `const [hotels, setHotels] = useState()`)

**Functions & Constants:**
- Exported functions: camelCase (e.g., `calculateWeightedScore`, `analyzeFeedback`, `submitFeedback`)
- Constants/enums: UPPER_SNAKE_CASE for config, camelCase for data (e.g., `FILTERS` in hotels page, `feedbackSchema`)

## Where to Add New Code

**New Feature:**
- Primary code: Create `src/features/{featureName}/` directory with `components/`, `actions/`, `lib/` subdirectories
- Components: `src/features/{featureName}/components/{component-name}.tsx`
- Server actions: `src/features/{featureName}/actions/{action-name}.ts`
- Utilities: `src/features/{featureName}/lib/{utility-name}.ts`
- Tests: Would go in `src/features/{featureName}/__tests__/` or alongside source files with `.test.tsx` suffix

**New Component/Module:**
- Shared UI components: `src/components/ui/{component-name}.tsx`
- Layout components: `src/components/layout/{component-name}.tsx`
- Feature components: `src/features/{featureName}/components/{component-name}.tsx`

**Utilities:**
- Shared helpers: `src/lib/{utility-name}.ts`
- Feature-specific helpers: `src/features/{featureName}/lib/{utility-name}.ts`

**New Page Route:**
- Dashboard page: `src/app/(dashboard)/{routeName}/page.tsx`
- Standalone page: `src/app/{routeName}/page.tsx`
- Dynamic segments: `src/app/(dashboard)/{routeName}/[param]/page.tsx`

**New Custom Hook:**
- Location: `src/hooks/{hook-name}.ts`
- Pattern: Export single hook function per file

## Special Directories

**`.planning/`:**
- Purpose: Project planning documents (PRD, ROADMAP, FLOW, TECH, etc.)
- Generated: Yes (by GSD commands)
- Committed: Yes

**`.next/`:**
- Purpose: Next.js build output and incremental build cache
- Generated: Yes (by `npm run build` and `npm run dev`)
- Committed: No (in .gitignore)

**`node_modules/`:**
- Purpose: npm package dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in .gitignore)

**`basic/`:**
- Purpose: Reference or backup implementation directory
- Generated: Unknown (possibly manual)
- Committed: Yes

**`ref images/`:**
- Purpose: Reference images for design or documentation
- Generated: Unknown (possibly manual)
- Committed: Yes

---

*Structure analysis: 2026-03-28*
