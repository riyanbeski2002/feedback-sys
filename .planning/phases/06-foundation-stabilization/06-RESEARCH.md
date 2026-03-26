# Phase 6: Foundation Stabilization - Research

**Researched:** 2026-03-26
**Domain:** Tailwind CSS v4 migration, PostgreSQL singleton constraints, idempotent seed scripts, Next.js / Supabase data layer fixes
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Seed Script Behavior on Re-run**
- Strategy: Skip if data exists. Check hotel row count first — if hotels are already present, exit early.
- Output on skip: Print a summary message (`6 hotels already exist — skipping seed`) so the developer knows why nothing happened. No silent failure.
- Command: `npm run seed` — single command, no flags needed.
- Feedback rows: Do NOT wipe submitted feedback on re-seed. Feedback is user-generated and must survive a reseed. Only hotels, bookings, and feedback_config are managed by the seed.

**Demo Data Content**
- Hotel distribution: 6 hotels total — 2 top-rated (score ≥ 4.5), 2 stable (score 3.0–4.4), 1 needs-review (score 2.0–2.9), 1 flagged (score < 2.0). Shows the full intelligence spectrum.
- Context: Indian corporate travel context matching Ziptrrip's market. Use realistic names: travellers like "Priya Sharma", "Arjun Mehta", "Kavitha Nair"; hotels in Mumbai, Delhi, Bangalore, Chennai.
- Feedback comment scenarios (12–15 rows total): Cover all four scenarios: Positive, Negative/critical, Neutral/mixed, Multi-category.
- Score distribution: Feedback scores must be consistent with hotel `avg_score`.

**Duplicate Config Rows Cleanup**
- Migration strategy: `DELETE FROM feedback_config WHERE id NOT IN (SELECT id FROM feedback_config ORDER BY created_at DESC LIMIT 1)`.
- Migration location: SQL migration file checked into the repo alongside existing schema files (e.g., `basic/10_singleton_constraint.sql`).
- Settings page resilience: Use `.maybeSingle()` for all reads. If multiple rows somehow exist, use the first returned row — no error thrown.
- Upsert on save: Settings save action uses upsert (not insert) keyed on the singleton constraint so repeated saves never create new rows.

**Tailwind Upgrade Breakage Policy**
- Component visual breakage: Note regressions but do NOT fix them in Phase 6. Phase 8 will overhaul all component colors.
- Dark mode regressions from `@layer base` fix: Accept dark mode visual changes until Phase 8.
- CSS fix scope: Apply `@theme inline`, add `hsl()` wrappers, move `:root`/`.dark` outside `@layer base` — but stop there. No color value changes in this phase.
- dotenv: Add to `devDependencies` only. Seed script is a dev tool; it never runs in production.

### Claude's Discretion
- Exact SQL constraint syntax for the singleton (UNIQUE INDEX vs CHECK vs trigger)
- Whether to use stable UUIDs in seed for deterministic FK references
- Order of TRUNCATE/upsert operations to avoid FK violations
- Exact Tailwind version to pin (latest stable v4.x)

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| FND-01 | App runs on Tailwind CSS stable v4 in both dev and production builds | Upgrade `tailwindcss` + `@tailwindcss/postcss` from `4.0.0-alpha.25` to `4.2.2`; verified against official npm registry |
| FND-02 | All CSS custom properties use `hsl()` wrappers and `@theme inline` so teal tokens apply correctly across light and dark mode | shadcn/ui official Tailwind v4 docs specify exact migration: move `:root`/`.dark` outside `@layer base`, wrap HSL values, switch `@theme` to `@theme inline` |
| FND-03 | Seed script can be run multiple times without creating duplicate hotels, bookings, or config rows | Hotel row-count guard pattern + upsert-by-stable-UUID for hotels; FK-safe skip for bookings; upsert with singleton constraint for config |
| FND-04 | `dotenv` is listed in devDependencies so seed script loads env vars reliably | `dotenv` is called via `require('dotenv')` in seed.ts but absent from package.json devDependencies — confirmed by direct package.json inspection |
| DAT-01 | Settings page loads without error regardless of how many rows exist in `feedback_config` | Replace `.single()` with `.maybeSingle()` — verified against Supabase JS reference; `.single()` throws PGRST116 on 0 or 2+ rows |
| DAT-02 | Saving settings uses upsert so no duplicate config rows are ever created | `update-config.ts` currently uses `.update().eq("id", formData.id)` — rewrite to `.upsert({ onConflict: 'singleton' })` |
| DAT-03 | `feedback_config` has a DB-level uniqueness constraint preventing multiple rows | Add `singleton BOOLEAN NOT NULL DEFAULT TRUE` column + `UNIQUE (singleton)` constraint in new migration file `basic/10_singleton_constraint.sql` |
| DAT-04 | Database contains 12–15 pre-submitted feedback rows with real names, scores, and comments | Add `feedback` insert block to seed.ts; must use stable booking UUIDs to reference correct FK; scores must match hotel `avg_score` distribution |
</phase_requirements>

---

## Summary

Phase 6 is a pure infrastructure repair phase — no new features, no visual redesign. Three compounding bugs currently make the app unreliable on fresh environments: `tailwindcss@4.0.0-alpha.25` (pre-stable with documented build failures), `:root`/`.dark` CSS variables placed inside `@layer base` (silently breaks Tailwind v4 token resolution), and a non-idempotent seed script that creates duplicate `feedback_config` rows (crashing the Settings page via PGRST116 error). All three must be fixed before any feature or design work can proceed.

Direct code inspection confirms the current state of each bug. The `globals.css` file uses `@theme {}` (not `@theme inline {}`) and places all `:root`/`.dark` blocks inside `@layer base` — this is the v3 pattern that breaks in v4. The `seed.ts` file uses raw `.insert()` for every table, meaning every `npm run seed` call creates new rows rather than updating existing ones, and `feedback_config` accumulates duplicates. The `settings/page.tsx` uses `.single()` which throws on those duplicates. The `package.json` shows `dotenv` called via `require('dotenv')` in the seed script but absent from `devDependencies`.

All fixes are well-documented with high-confidence official sources and require zero new npm packages beyond `dotenv` (devDependency). The migration to stable Tailwind v4.2.2 is a one-line version bump plus a targeted `globals.css` rewrite. The DB singleton constraint is a standard PostgreSQL boolean-sentinel pattern. The seed rewrite uses stable UUID constants with upsert-by-id.

**Primary recommendation:** Fix in dependency order — Tailwind upgrade first (build tool must be stable before CSS changes are meaningful), CSS token migration second, then DB migration + settings fix + seed rewrite in parallel (no dependencies between them after Tailwind is stable).

---

## Standard Stack

### Core (no new packages — all already installed)

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 4.2.2 (upgrade from alpha.25) | CSS utility framework | Latest stable; eliminates documented alpha build bugs |
| @tailwindcss/postcss | 4.2.2 (upgrade from alpha.25) | PostCSS integration for Next.js | Must match tailwindcss version exactly |
| @supabase/supabase-js | ^2.45.4 (already installed) | Seed script DB client | Service-role upsert for seed; `.maybeSingle()` for settings read |
| @supabase/ssr | ^0.5.1 (already installed) | Server Component DB client | Used in settings/page.tsx for server-side reads |

### New devDependency (one addition)

| Library | Version | Purpose | Why Needed |
|---------|---------|---------|------------|
| dotenv | ^16.x | Load `.env.local` in seed script | Already `require()`d in seed.ts; missing from devDependencies causes silent failure on clean install |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `singleton BOOLEAN UNIQUE` constraint | Trigger-based enforcement | Boolean sentinel is simpler, requires no PL/pgSQL, idiomatic for single-row config tables |
| Stable UUID constants in seed | Generated UUIDs with lookup | Stable UUIDs allow deterministic FK references — bookings and feedback rows can reference hotel UUIDs without a lookup step |
| Row-count guard for idempotency | `ON CONFLICT DO NOTHING` on all tables | Row-count guard is simpler for hotels; upsert is correct for config (must update if values changed) |

**Installation:**
```bash
# Version upgrade (run from project root)
npm install tailwindcss@4.2.2 @tailwindcss/postcss@4.2.2

# New devDependency
npm install --save-dev dotenv
```

---

## Architecture Patterns

### Pattern 1: Tailwind v4 CSS Token Migration (`globals.css`)

**What:** Move `:root`/`.dark` blocks outside `@layer base`, wrap bare HSL values in `hsl()`, switch `@theme {}` to `@theme inline {}`.

**Why this order matters in v4:** `@layer base` is a Tailwind-managed cascade layer. In v4, custom properties declared inside `@layer base` can be overridden by utility classes, breaking token resolution when a utility class has equal or higher specificity. Moving `:root`/`.dark` outside any layer gives them normal specificity and lets Tailwind utility classes reference them correctly.

**`@theme inline` vs `@theme`:** Without `inline`, Tailwind v4 converts token values to OKLCH during the build. If the value is a CSS variable (`var(--primary)`) rather than a literal color, OKLCH conversion fails silently and the token resolves to an empty string. `@theme inline` tells the engine to leave the value as-is and emit a direct CSS variable reference — this is the correct pattern when your `@theme` tokens point to `:root` CSS variables.

**Before (current — broken pattern):**
```css
@theme {
  --color-primary: var(--primary);  /* OKLCH conversion attempted — fails silently */
}

@layer base {
  :root {
    --primary: 171 53% 64%;          /* bare HSL — missing hsl() wrapper */
  }
}
```

**After (correct v4 pattern):**
```css
/* Source: https://ui.shadcn.com/docs/tailwind-v4 */
:root {
  --primary: hsl(171 53% 64%);      /* hsl() wrapper applied once here */
}

.dark {
  --primary: hsl(171 53% 64%);
}

@theme inline {
  --color-primary: var(--primary);  /* inline: no OKLCH conversion, emits var() reference */
}
```

**Scope of change in Phase 6:** Apply the structural migration (move blocks, add wrappers, change `@theme` to `@theme inline`) but do NOT change any HSL values. Visual regressions in components are acceptable — Phase 8 will fix them.

**The second `@layer base` block** (lines 102–109 in current `globals.css`) containing `* { @apply border-border }` and `body { @apply bg-background text-foreground antialiased }` stays inside `@layer base` — that block is correct and should not be moved.

### Pattern 2: PostgreSQL Singleton Row Constraint

**What:** Add a boolean sentinel column with a `UNIQUE` constraint to enforce exactly one row.

**When to use:** Config tables where the application logic requires a single authoritative row. This is a standard PostgreSQL pattern.

```sql
-- Source: PostgreSQL docs — UNIQUE constraint on computed/constant value
-- File: basic/10_singleton_constraint.sql

-- Step 1: Remove duplicates first (keep newest row)
DELETE FROM feedback_config
WHERE id NOT IN (
  SELECT id FROM feedback_config ORDER BY created_at DESC LIMIT 1
);

-- Step 2: Add singleton column with default
ALTER TABLE feedback_config
  ADD COLUMN IF NOT EXISTS singleton BOOLEAN NOT NULL DEFAULT TRUE;

-- Step 3: Add unique constraint (enforces max one row where singleton = TRUE)
CREATE UNIQUE INDEX IF NOT EXISTS feedback_config_singleton_idx
  ON feedback_config (singleton);
```

**Why `UNIQUE INDEX` over `UNIQUE` constraint:** Functionally identical; `UNIQUE INDEX` is slightly more explicit in intent when created after the fact via `ALTER TABLE`. Both create the same B-tree index.

**After migration, upsert pattern in application code:**
```typescript
// Source: https://supabase.com/docs/reference/javascript/upsert
const { error } = await supabase
  .from('feedback_config')
  .upsert(
    { singleton: true, ...formData },
    { onConflict: 'singleton' }
  )
```

### Pattern 3: Idempotent Seed Script

**What:** Seed that is safe to run N times. Uses a hotel row-count guard to skip entirely, stable UUID constants for deterministic FK references, and upsert-by-UUID for all managed tables.

**Key structural decisions:**
1. **Hotel count guard first** — if `count > 0`, print skip message and return. This makes the script exit-on-existing-data rather than no-op-on-conflict, which is the user's decision.
2. **Stable UUID constants** — define hotel UUIDs as `const` at the top of the script. Booking rows reference these constants directly rather than relying on the insert return value. This survives the idempotency guard without needing a DB lookup.
3. **Feedback rows reference booking UUIDs** — same pattern: stable booking UUID constants allow feedback inserts to reference correct FKs without cross-table reads.
4. **`feedback_config` upsert** — use `{ onConflict: 'singleton' }` so the single config row is updated (not duplicated) on every seed run.
5. **Do NOT touch `feedback` table on reseed** — per locked decision, submitted feedback survives reseed. The seed only inserts the initial 12–15 demo rows if the hotel count guard passes (i.e., fresh DB).

```typescript
// Source: Supabase JS reference — upsert with onConflict
// Stable UUID pattern for FK determinism

const HOTEL_IDS = {
  grandRoyalBangalore: 'a1b2c3d4-0001-0001-0001-000000000001',
  marineDriveSuites:   'a1b2c3d4-0001-0001-0001-000000000002',
  delhiResidency:      'a1b2c3d4-0001-0001-0001-000000000003',
  budgetStayKoramangala:'a1b2c3d4-0001-0001-0001-000000000004',
  airportExpressInn:   'a1b2c3d4-0001-0001-0001-000000000005',
  gatewayPalace:       'a1b2c3d4-0001-0001-0001-000000000006',
}

// Guard: exit early if data exists
const { count } = await supabase
  .from('hotels')
  .select('*', { count: 'exact', head: true })

if (count && count > 0) {
  console.log(`${count} hotels already exist — skipping seed`)
  return
}
```

### Pattern 4: `.maybeSingle()` for Singleton Table Read

**What:** Use `.maybeSingle()` instead of `.single()` when reading from a table that should have exactly one row but may have zero (empty DB) or more than one (pre-migration DB).

**Behavior difference:**
- `.single()`: throws PGRST116 error if 0 or 2+ rows returned — crashes the Settings page
- `.maybeSingle()`: returns `null` if 0 rows; returns first row if 1+ rows — no error thrown

```typescript
// Source: https://supabase.com/docs/reference/javascript/maybesingle
const { data: config, error } = await supabase
  .from('feedback_config')
  .select('*')
  .maybeSingle()

// config is null on empty DB — handle gracefully
if (!config) {
  // show empty state or default config UI, not an error page
}
```

### Anti-Patterns to Avoid

- **Do not use `@theme {}` (without `inline`) when tokens reference `var()`**: The engine attempts OKLCH conversion and silently emits an empty string. Always use `@theme inline {}` in shadcn/ui setups.
- **Do not place `:root` inside `@layer base`**: The v3 pattern that shadcn/ui shipped in earlier versions. In v4, this causes color utilities to be overridden by the layer cascade.
- **Do not use `.single()` on a config table**: Any table that might be empty or have duplicates (before migration runs) will crash the page. Use `.maybeSingle()` always.
- **Do not use `.insert()` in seed scripts**: Raw insert creates a new row every run. Use `.upsert()` with `onConflict` specifying the natural key.
- **Do not generate booking/feedback FK references from insert return values**: If the hotel insert is skipped by the guard, the return value is null. Use stable UUID constants instead.
- **Do not run `TRUNCATE` cascade before checking the guard**: If the guard exits early, you never reach the TRUNCATE — but if guard logic is reversed, TRUNCATE cascade could wipe the `feedback` table (child of `bookings`). The locked decision prohibits wiping feedback rows. Guard-first, insert-second.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CSS token OKLCH conversion | Custom CSS variable bridge | `@theme inline {}` | The engine handles it; manual bridges create two-source-of-truth |
| Singleton enforcement | Application-level count check before insert | PostgreSQL `UNIQUE` constraint on boolean sentinel | DB constraint is atomic and survives concurrent requests; application checks race |
| Seed idempotency | Custom diff-and-patch logic | Supabase `.upsert({ onConflict: 'column' })` | Upsert is a single atomic operation; diff logic has edge cases on partial state |
| PGRST116 error handling | Try/catch around `.single()` | `.maybeSingle()` | Semantic API: `.maybeSingle()` expresses "zero or one is fine"; `.single()` expresses "exactly one required" — use the right primitive |

**Key insight:** All four "don't hand-roll" problems have exact primitives in the existing stack. The bugs exist because earlier implementations used the wrong primitive (`.single()`, `.insert()`, `@theme` without `inline`), not because the stack was missing capability.

---

## Common Pitfalls

### Pitfall 1: `@theme` Without `inline` — Silent Empty Token

**What goes wrong:** `bg-primary`, `text-primary`, and all other color utilities render transparent or inherit instead of applying the teal color.

**Why it happens:** `@theme {}` (without `inline`) triggers OKLCH color space conversion. When the value is `var(--primary)` (a CSS variable reference) rather than a literal color like `oklch(0.7 0.1 178)`, the conversion receives an unresolvable value at build time and emits an empty token. The CSS compiles without error but the token is effectively undefined.

**How to avoid:** Always use `@theme inline {}` when the token values are CSS variable references (the shadcn/ui pattern). Only use plain `@theme {}` when values are literal color values.

**Warning signs:** `bg-primary` renders as transparent; elements inheriting background color show through. No build error — silent.

### Pitfall 2: `:root` Inside `@layer base` — Token Override by Utilities

**What goes wrong:** Some utility classes override color tokens unexpectedly. Dark mode may not switch colors. The symptom is inconsistent — works in `next dev`, broken in `next build`, or works on first load but breaks after hydration.

**Why it happens:** In Tailwind v4, `@layer base` has lower specificity in the cascade than utility classes. If `:root` CSS variables are declared inside `@layer base`, they can be overridden when a utility class from a higher layer references the same property. In v3 this was fine because the cascade order was different.

**How to avoid:** Move all `:root { }` and `.dark { }` blocks to the top of `globals.css`, outside any `@layer` block.

**Warning signs:** `bg-background` in `next dev` differs from `next build`; dark mode toggle has no effect on background color.

### Pitfall 3: PGRST116 — `.single()` on Empty or Multi-Row Table

**What goes wrong:** Settings page returns a full-page error: "Error Loading Configuration — JSON object requested, multiple (or no) rows returned".

**Why it happens:** Supabase's `.single()` method is strict — it expects exactly one row. On a fresh environment (zero rows) or after multiple seed runs (multiple rows), the DB returns 0 or 2+ rows, and PostgREST returns PGRST116.

**How to avoid:** Use `.maybeSingle()` for all reads of `feedback_config`. Apply the DB singleton migration (`10_singleton_constraint.sql`) to prevent future duplicates. These are two independent fixes — both are required because `.maybeSingle()` handles existing duplicates gracefully, while the constraint prevents new ones.

**Warning signs:** Settings page shows error state in any environment that wasn't set up in a single session.

### Pitfall 4: tsconfig / ts-node Incompatibility for CommonJS Seed

**What goes wrong:** `npm run seed` fails with `SyntaxError: Cannot use import statement in a module` or `Unknown file extension ".ts"`.

**Why it happens:** The root `tsconfig.json` sets `"module": "esnext"` and `"moduleResolution": "node"`. These settings are correct for Next.js but incompatible with `ts-node` running a CommonJS script (which uses `require()`). When `ts-node` picks up the root tsconfig, it tries to compile the seed as ESM.

**How to avoid:** The seed script already uses CommonJS `require()` syntax — this is the right choice for a Node.js script outside the Next.js compilation pipeline. Ensure `ts-node` is invoked with a flag that overrides the module setting:

```json
// package.json seed script
"seed": "ts-node --compiler-options '{\"module\":\"commonjs\"}' src/scripts/seed.ts"
```

Or create `src/scripts/tsconfig.json`:
```json
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "module": "commonjs",
    "moduleResolution": "node"
  }
}
```

**Warning signs:** `npm run seed` fails immediately with a module error before any DB connection is attempted.

### Pitfall 5: FK Violation on Feedback Insert — Missing Booking Reference

**What goes wrong:** Seed script fails partway through with a foreign key constraint violation when inserting feedback rows.

**Why it happens:** `feedback.booking_id` references `bookings.id` with `ON DELETE CASCADE`. If the seed's feedback insert uses a hardcoded booking UUID that doesn't exist in `bookings` (wrong stable UUID, or bookings were skipped by an earlier error), the insert fails.

**How to avoid:** Define stable UUID constants for bookings (same as hotels). Ensure feedback rows reference the exact booking UUID constants that were used in the bookings insert. Verify FK chain: `feedback.booking_id → bookings.id`, `feedback.hotel_id → hotels.id`.

**Warning signs:** Seed runs successfully up to bookings but errors on feedback with "violates foreign key constraint".

### Pitfall 6: `feedback` Unique Constraint on `booking_id`

**What goes wrong:** Re-running seed (even after the hotel-count guard) inserts duplicate feedback rows if the guard somehow passes on a DB with existing bookings but no hotels.

**Why it happens:** The `feedback` table has `booking_id uuid not null unique` — this means each booking can only have one feedback row. Upsert on feedback should use `onConflict: 'booking_id'`. But since the locked decision says the guard exits before any inserts if hotels exist, this only matters on truly fresh DBs.

**How to avoid:** Even though the guard prevents re-insertion, defensive coding says: insert feedback with `upsert({ onConflict: 'booking_id' })` rather than plain insert. This is consistent with the overall idempotency philosophy.

---

## Code Examples

Verified patterns from official sources:

### Correct `globals.css` Structure (Tailwind v4 + shadcn/ui)
```css
/* Source: https://ui.shadcn.com/docs/tailwind-v4 */
@import "tailwindcss";

/* 1. CSS variables — OUTSIDE any @layer */
:root {
  --background: hsl(180 10% 98%);
  --foreground: hsl(180 5% 10%);
  --primary: hsl(171 53% 64%);
  --primary-foreground: hsl(0 0% 100%);
  /* ... all other tokens ... */
  --radius: 0.75rem;
}

.dark {
  --background: hsl(180 5% 5%);
  --primary: hsl(171 53% 64%);
  /* ... */
}

/* 2. Theme token mapping — @theme inline, not @theme */
@theme inline {
  --color-border: var(--border);
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  /* ... all other mappings ... */
  --radius-lg: var(--radius);
  --radius-md: calc(var(--radius) - 2px);
  --radius-sm: calc(var(--radius) - 4px);
}

/* 3. Base layer — stays inside @layer base, no change */
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
}
```

### Singleton Migration SQL
```sql
-- Source: PostgreSQL docs — CREATE UNIQUE INDEX
-- File: basic/10_singleton_constraint.sql

-- Remove duplicate rows (keep newest)
DELETE FROM feedback_config
WHERE id NOT IN (
  SELECT id FROM feedback_config ORDER BY created_at DESC LIMIT 1
);

-- Add sentinel column
ALTER TABLE feedback_config
  ADD COLUMN IF NOT EXISTS singleton BOOLEAN NOT NULL DEFAULT TRUE;

-- Enforce uniqueness (only one row where singleton = true)
CREATE UNIQUE INDEX IF NOT EXISTS feedback_config_singleton_idx
  ON feedback_config (singleton);
```

### Idempotent Seed — Hotel Guard + Upsert Pattern
```typescript
// Source: https://supabase.com/docs/reference/javascript/upsert

// Stable UUIDs — defined at top of seed.ts
const HOTEL_IDS = {
  grandRoyalBangalore:   'a1b2c3d4-e5f6-0001-0001-000000000001',
  marineDriveSuites:     'a1b2c3d4-e5f6-0001-0001-000000000002',
  delhiResidency:        'a1b2c3d4-e5f6-0001-0001-000000000003',
  budgetStayKoramangala: 'a1b2c3d4-e5f6-0001-0001-000000000004',
  airportExpressInn:     'a1b2c3d4-e5f6-0001-0001-000000000005',
  gatewayPalace:         'a1b2c3d4-e5f6-0001-0001-000000000006',
}

async function seed() {
  // Guard: exit early if data exists
  const { count } = await supabase
    .from('hotels')
    .select('*', { count: 'exact', head: true })

  if (count && count > 0) {
    console.log(`${count} hotels already exist — skipping seed`)
    return
  }

  // Hotels — upsert by stable UUID
  await supabase.from('hotels').upsert([
    { id: HOTEL_IDS.grandRoyalBangalore, name: 'Grand Royal Bangalore', ... },
    // ...
  ], { onConflict: 'id' })

  // Config — upsert by singleton
  await supabase.from('feedback_config').upsert(
    { singleton: true, trigger_delay_hours: 1, cleanliness_weight: 0.30, ... },
    { onConflict: 'singleton' }
  )

  // Feedback — 12-15 rows, upsert by booking_id (unique constraint in schema)
  await supabase.from('feedback').upsert([
    { booking_id: BOOKING_IDS.priyaGrandRoyal, ... },
    // ...
  ], { onConflict: 'booking_id' })
}
```

### Settings Page — `.maybeSingle()` with null guard
```typescript
// Source: https://supabase.com/docs/reference/javascript/maybesingle
const { data: config, error } = await supabase
  .from('feedback_config')
  .select('*')
  .maybeSingle()

// null = empty DB (fresh environment) — show friendly empty state
if (!config) {
  return <EmptyConfigState />
}
// error = actual DB error — show error state
if (error) {
  return <ErrorState message={error.message} />
}
```

### Settings Action — Upsert Instead of Update
```typescript
// Source: https://supabase.com/docs/reference/javascript/upsert
const { error } = await supabase
  .from('feedback_config')
  .upsert(
    { singleton: true, ...validatedFormData },
    { onConflict: 'singleton' }
  )
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@theme {}` with CSS variable values | `@theme inline {}` with CSS variable values | Tailwind v4.0 (Jan 2025) | Without `inline`, var() references undergo OKLCH conversion and silently produce empty tokens |
| `:root` inside `@layer base` | `:root` outside all layers | Tailwind v4.0 (Jan 2025) | In v4, base layer has lower cascade priority than utility classes; tokens must live outside layers |
| Bare HSL values: `--primary: 171 53% 64%` | Wrapped HSL: `--primary: hsl(171 53% 64%)` | shadcn/ui Tailwind v4 migration (2025) | v4 does not auto-wrap; value is used literally — bare HSL is not a valid CSS color value |
| `tailwindcss@4.0.0-alpha.25` | `tailwindcss@4.2.2` | Latest stable as of March 2026 | Eliminates alpha-stage hot-reload crashes, `@apply` failures, prod/dev style divergence |
| `.single()` for singleton reads | `.maybeSingle()` | Supabase JS v2 (existing) | `.maybeSingle()` has always existed; using `.single()` was the wrong choice from the start |

**Deprecated/outdated in this codebase:**
- `@theme {}` without `inline` when token values are CSS variable references — wrong for v4
- `:root` and `.dark` inside `@layer base` — correct in v3, wrong in v4
- Bare HSL numbers without `hsl()` wrapper — Tailwind v4 requires proper CSS color syntax
- `.single()` on `feedback_config` — should be `.maybeSingle()`

---

## Open Questions

1. **ts-node `module` flag compatibility**
   - What we know: `tsconfig.json` has `"module": "esnext"`, and the seed uses `require()` (CommonJS). `ts-node` respects the root tsconfig by default.
   - What's unclear: Whether the existing `ts-node` version installed (`^10.9.2`) supports the `--compiler-options` flag cleanly, or whether a separate `src/scripts/tsconfig.json` is preferable.
   - Recommendation: Create `src/scripts/tsconfig.json` extending root with `"module": "commonjs"`. This is explicit, version-agnostic, and doesn't require changing the npm script string.

2. **DB migration delivery mechanism**
   - What we know: The migration SQL should live in `basic/10_singleton_constraint.sql`. The existing schema files in `basic/` are plain SQL files, not an automated migration system.
   - What's unclear: Whether Supabase project already has a `singleton` column from a prior manual migration (would cause `ADD COLUMN IF NOT EXISTS` to succeed silently rather than fail).
   - Recommendation: Use `ADD COLUMN IF NOT EXISTS` and `CREATE UNIQUE INDEX IF NOT EXISTS` — both are idempotent. The planner should note that this migration must be run manually against the Supabase project (not auto-applied).

3. **Stable UUID format validation**
   - What we know: Supabase uses UUID v4; the `hotels.id` column is `uuid primary key default gen_random_uuid()`.
   - What's unclear: Whether providing manually-crafted UUID strings (like `a1b2c3d4-e5f6-0001-0001-000000000001`) is accepted by the PostgreSQL UUID type without validation errors.
   - Recommendation: Use valid UUID v4 format strings (8-4-4-4-12 hex). The example UUIDs above use a deterministic pattern that is syntactically valid. PostgreSQL validates format only, not v4 randomness.

---

## Sources

### Primary (HIGH confidence)
- https://ui.shadcn.com/docs/tailwind-v4 — `@theme inline` syntax, `:root` outside `@layer base`, `hsl()` wrapper requirement
- https://tailwindcss.com/blog/tailwindcss-v4 — v4.0 stable release (January 22, 2025), CSS-first configuration
- https://supabase.com/docs/reference/javascript/maybesingle — `.maybeSingle()` null-safe singleton read
- https://supabase.com/docs/reference/javascript/upsert — `onConflict` option behavior
- Direct codebase read: `src/app/globals.css` (current broken state confirmed), `src/scripts/seed.ts` (non-idempotent `.insert()` confirmed), `src/app/(dashboard)/settings/page.tsx` (`.single()` confirmed), `src/features/admin/actions/update-config.ts` (`.update().eq()` confirmed), `basic/09_database_schema.sql` (no singleton column/constraint confirmed), `package.json` (`dotenv` absent from devDependencies confirmed)
- npm registry: `tailwindcss@4.2.2` and `@tailwindcss/postcss@4.2.2` confirmed as latest stable

### Secondary (MEDIUM confidence)
- https://github.com/tailwindlabs/tailwindcss/releases — release history confirming v4.2.2 as latest
- https://supabase.com/docs/guides/api/rest/postgrest-error-codes — PGRST116 error on `.single()` failure modes

### Tertiary (LOW confidence — not required, existing knowledge sufficient)
- PostgreSQL docs on `CREATE UNIQUE INDEX` — standard SQL, no ambiguity

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — All packages verified against npm registry; no new dependencies except dotenv
- Architecture: HIGH — All patterns verified against official shadcn/ui Tailwind v4 docs and Supabase JS reference; codebase read confirmed current broken state
- Pitfalls: HIGH — Each pitfall verified against direct codebase inspection; root causes confirmed with official documentation

**Research date:** 2026-03-26
**Valid until:** 2026-04-25 (stable APIs — 30 days)
