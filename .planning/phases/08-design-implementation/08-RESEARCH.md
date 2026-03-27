# Phase 8: Design Implementation - Research

**Researched:** 2026-03-27
**Domain:** Tailwind CSS v4 tokens, shadcn/ui Sidebar, Next.js layout components
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- DSG-03 / DSG-04 / DSG-05 already completed in the current dev session (prior to GSD planning). CSS variable tokens added to globals.css, all badge/chip components updated to `rounded-full`, metric cards updated to use token colors. The plan should audit and verify these are complete, then document in SUMMARY.md.
- DSG-06: The Phase 7 Pencil designs are final and approved. The shell/dashboard frame (01-shell.png in `.planning/designs/`) is the reference for the sidebar and header layout. Implement exactly as shown in that mockup — no deviation, no discussion needed.
- Key target behaviors: Header compact B2B density (not 80px spacious height), navigation items tight with minimal padding, active nav state visually distinct using Ziptrrip teal tokens, brand area compact.

### Claude's Discretion
- Exact pixel values for spacing (match visual feel of mockup, not pixel-perfect)
- How to handle the dark mode toggle placement in a more compact header
- Transition/animation details on sidebar collapse

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DSG-03 | Hotel status badges use teal-based color palette (not hardcoded green/slate/orange/red) | AUDIT: Already complete — `globals.css` has `--status-*` CSS variables; `hotel-card.tsx` uses `var(--status-*-bg/text/border)` correctly. One residual: flash animation in `hotel-card.tsx` uses `rgba(59, 130, 246, 0.5)` hardcoded blue — must be replaced with `var(--primary)`. |
| DSG-04 | Admin metric cards use design system colors (no hardcoded yellow or blue) | AUDIT: Already complete — `metric-cards.tsx` uses only `text-primary`, `bg-primary/10`, `var(--rating-fill)`, `var(--metric-highlight)`, `text-destructive`, `var(--metric-info)`, `var(--metric-info-bg)`. No hardcoded yellow or blue present. |
| DSG-05 | All badge/chip elements use `rounded-full` pill style matching Ziptrrip | AUDIT: Already complete — `badge.tsx` CVA base class has `rounded-full`. `hotel-card.tsx` uses Badge component. `recent-feedback-feed.tsx` uses `rounded-full` on inline spans. |
| DSG-06 | Sidebar and header match Ziptrrip B2B density, spacing, and navigation layout | NOT DONE — requires changes to `site-header.tsx` (reduce from h-20 to compact height) and `app-sidebar.tsx` (add NAVIGATION label, tighten item spacing). Detailed diff documented in Architecture Patterns section. |
</phase_requirements>

## Summary

The audit reveals DSG-03, DSG-04, and DSG-05 are substantively complete with one minor residual: `hotel-card.tsx` uses `rgba(59, 130, 246, 0.5)` hardcoded blue in its flash animation (lines 61-62). This must be replaced with the primary teal token. All badge shapes are `rounded-full`, all metric cards use CSS variables, and all status badge colors reference `var(--status-*)` tokens in `globals.css`.

DSG-06 is the primary implementation target. The mockup (`.planning/designs/01-shell.png`) shows a compact B2B shell with a ~48px header (versus the current 80px `h-20`), a flat non-blurred header with a "PROJECT / Feedback Intelligence" label pattern, and a sidebar with a "NAVIGATION" section label and tighter nav item spacing. The current implementation is close in structure but spacious in sizing.

The shadcn/ui Sidebar system uses CSS custom properties (`--sidebar-width`, `--sidebar-width-icon`) set by `SidebarProvider`. Nav item sizing is controlled by `SidebarMenuButton` size prop and className overrides. All changes are isolated to `site-header.tsx` and `app-sidebar.tsx` — no changes needed to the underlying `sidebar.tsx` UI primitive or `globals.css`.

**Primary recommendation:** Two files change — `site-header.tsx` (compact header) and `app-sidebar.tsx` (add NAVIGATION label, tighten spacing, fix nav item height). Verify the one hardcoded-blue residual in `hotel-card.tsx` as a bonus fix within DSG-03 audit task.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.2.2 (pinned) | Utility classes for layout/spacing | Already in project — pinned to exact version to avoid PostCSS failures |
| shadcn/ui Sidebar | local copy | Sidebar primitive with collapsible icon mode | Already in project — `collapsible="icon"` behavior must be preserved |
| next-themes | 0.3.0 | Dark mode toggle | Already in project |
| class-variance-authority (cva) | current | Variant management in badge.tsx | Already in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `cn()` utility | local | Merge Tailwind classes conditionally | All className merges in TSX files |
| CSS custom properties | native | Design tokens (`--status-*`, `--primary`, etc.) | All color references — never use raw Tailwind color classes |

**Installation:** No new packages required for Phase 8.

## Architecture Patterns

### Recommended File Change Map
```
src/
├── components/layout/
│   ├── site-header.tsx        # DSG-06: h-20 → compact header
│   └── app-sidebar.tsx        # DSG-06: add NAVIGATION label, tighter items
├── features/hotels/components/
│   └── hotel-card.tsx         # DSG-03 residual: fix flash animation color
└── app/globals.css            # No changes needed
```

### Pattern 1: Compact Header (DSG-06)

**What:** Reduce header from `h-20` (80px) to compact B2B density matching 01-shell.png.
**When to use:** This is the only header in the app.

Reading the mockup carefully:
- Header height: approximately 48px — use `h-12` (48px) or `h-14` (56px)
- Background: flat `bg-background` — remove `bg-background/80 backdrop-blur-md`
- Horizontal padding: the mockup shows tighter padding — use `px-4` (not `px-8`)
- Left side: SidebarTrigger + vertical separator + "PROJECT" caption label + "Feedback Intelligence" title
- Right side: Business/Personal toggle (plain text, no container background) + theme toggle button
- The "Business/Personal" pill toggle in the mockup is simplified — "Business" bold, pipe separator, "Personal" lighter — not the current rounded container with bg-muted/50

```tsx
// site-header.tsx — target structure
<header className="sticky top-0 z-30 flex h-12 w-full shrink-0 items-center justify-between border-b bg-background px-4 transition-all duration-300">
  <div className="flex items-center gap-3">
    <SidebarTrigger className="-ml-1 hover:bg-primary/10 hover:text-primary transition-colors" />
    <div className="h-4 w-px bg-border" />
    <div className="flex flex-col">
      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Project</span>
      <span className="text-sm font-bold tracking-tight text-foreground leading-none">Feedback Intelligence</span>
    </div>
  </div>
  <div className="flex items-center gap-3">
    {/* Business/Personal toggle — plain text style matching mockup */}
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-foreground">Business</span>
      <span className="text-border">|</span>
      <span className="text-xs font-medium text-muted-foreground">Personal</span>
    </div>
    {/* Theme toggle — keep existing icon button */}
    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full" onClick={...}>
      ...
    </Button>
  </div>
</header>
```

### Pattern 2: Sidebar Navigation Density (DSG-06)

**What:** Add "NAVIGATION" section label, tighten nav item spacing to match mockup.
**When to use:** The mockup shows a labeled navigation section.

Reading the mockup carefully:
- There is a "NAVIGATION" uppercase label above the nav items (like a `SidebarGroupLabel`)
- Nav items appear ~40px tall — slightly tighter than the current `h-11` (44px)
- Icon and text spacing is compact — `gap-2` (already correct)
- Active state: teal pill background with left-aligned label — `bg-primary/10 text-primary` (already correct)
- No footer inner padding box — the "Verified Stays Only" card uses less padding

```tsx
// app-sidebar.tsx — nav section with label
<SidebarContent className="px-2 pt-2">
  <div className="px-2 mb-1">
    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Navigation</span>
  </div>
  <SidebarMenu className="gap-0.5">
    {data.navMain.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          isActive={pathname === item.url}
          tooltip={item.title}
          className={`h-9 transition-all duration-150 rounded-lg ${
            pathname === item.url
              ? "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Link href={item.url} className="flex items-center gap-2.5">
            <item.icon className={`size-4 ${pathname === item.url ? "text-primary" : ""}`} />
            <span className="font-medium text-sm">{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))}
  </SidebarMenu>
</SidebarContent>
```

### Pattern 3: DSG-03 Residual — Flash Animation Color Fix

**What:** Replace hardcoded `rgba(59, 130, 246, 0.5)` blue in `hotel-card.tsx` with teal.
**Why it matters:** Framer Motion inline style bypasses Tailwind — must use CSS variable directly.

```tsx
// hotel-card.tsx lines 61-62 — before
boxShadow: isFlashing ? "0 0 20px rgba(59, 130, 246, 0.5)" : "none",
borderColor: isFlashing ? "rgba(59, 130, 246, 0.5)" : "inherit"

// after — use primary teal (hsl 171 53% 64%)
boxShadow: isFlashing ? "0 0 20px hsl(171 53% 64% / 0.5)" : "none",
borderColor: isFlashing ? "hsl(171 53% 64% / 0.5)" : "inherit"
```

Note: Framer Motion `animate` prop receives computed values, not CSS variables. Using `hsl(171 53% 64%)` directly matches `var(--primary)` from `globals.css`.

### Anti-Patterns to Avoid

- **Overriding sidebar.tsx primitive:** Do not edit `src/components/ui/sidebar.tsx`. All sizing changes go in the consumer component (`app-sidebar.tsx`) via className props.
- **Removing `collapsible="icon"`:** The sidebar collapse behavior must be preserved. Only visual/spacing changes are in scope.
- **Using `backdrop-blur` on compact header:** The mockup shows a flat, non-blurred header. Remove the blur entirely.
- **Hardcoded color values in Framer Motion:** Framer Motion inline styles bypass Tailwind — use resolved HSL values matching the CSS variable, not `rgba(59, 130, 246)`.
- **Pixel-perfect matching:** The CONTEXT.md explicitly says "match visual feel, not pixel-perfect." Use standard Tailwind sizing values that approximate the mockup density.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sidebar collapse behavior | Custom collapse logic | `collapsible="icon"` on existing `<Sidebar>` | Already implemented, battle-tested |
| Theme toggle | Custom toggle | Existing `next-themes` `useTheme()` hook | Already wired |
| Active nav detection | Manual URL matching | Existing `usePathname()` pattern in app-sidebar.tsx | Already works |

## Common Pitfalls

### Pitfall 1: Tailwind v4 `border-l-[var(--color)]` Pattern
**What goes wrong:** In Tailwind v4 with `@theme inline`, using `border-l-[var(--metric-info)]` fails unless the color is registered in `@theme inline` as `--color-*`.
**Why it happens:** Tailwind v4 only generates utilities for registered `--color-*` tokens.
**How to avoid:** The current `globals.css` already registers `--color-metric-info`, `--color-metric-info-bg`, etc. via `@theme inline`. The `metric-cards.tsx` uses `border-l-[var(--rating-fill)]` with the raw CSS variable — this is acceptable for Tailwind v4 arbitrary value syntax.
**Warning signs:** Border color not rendering, or console warning about unknown utility.

### Pitfall 2: SidebarMenuButton Height Override vs. `group-data-[collapsible=icon]`
**What goes wrong:** The SidebarMenuButton has a hardcoded `group-data-[collapsible=icon]:!size-8` in `sidebar.tsx`. Overriding height via className on the button (e.g., `h-9`) conflicts with the `!size-8` when collapsed.
**Why it happens:** The `!` important modifier in `sidebar.tsx` line 514 overrides custom heights in collapsed icon mode.
**How to avoid:** The height override (`h-9`) only affects expanded mode. Collapsed icon mode will always use `size-8` (32px). This is the desired behavior — only change expanded-mode height.
**Warning signs:** Nav items appear correct in expanded mode but wrong size when collapsed.

### Pitfall 3: Header `h-12` vs SidebarInset Alignment
**What goes wrong:** The header height change from `h-20` to `h-12` doesn't affect the SidebarInset layout but may affect sticky positioning if content has hard-coded offsets.
**Why it happens:** The header uses `sticky top-0` — no other component hard-codes a top offset to match header height.
**How to avoid:** Search for `top-20` or `mt-20` in the codebase before finalizing header height.
**Warning signs:** Content overlap or unexpected gap below header.

### Pitfall 4: `--sidebar-width` Is Set in SidebarProvider, Not CSS
**What goes wrong:** Trying to change sidebar width in `globals.css` has no effect.
**Why it happens:** `SIDEBAR_WIDTH = "16rem"` is set as a JS constant and injected as an inline style on the `SidebarProvider` wrapper div.
**How to avoid:** Do not change sidebar width for DSG-06. The 16rem (256px) width matches the mockup well. No width change is needed.
**Warning signs:** If the sidebar looks too wide/narrow, check the constant at top of `sidebar.tsx` — not CSS.

## Code Examples

### Verifying DSG-03/04/05 Completion
```bash
# Search for any remaining hardcoded Tailwind color classes in badge/metric contexts
grep -rn "bg-green-\|bg-slate-\|bg-orange-\|bg-red-\|bg-yellow-\|bg-blue-\|text-green-\|text-red-" src/
# Expected: Only notification preview files (intentional UI mimicry) — NOT in badge or metric components
```

### Confirming rounded-full Coverage
```bash
# Confirm badge.tsx base class uses rounded-full
grep "rounded-full" src/components/ui/badge.tsx
# Expected: present in CVA base string
```

### Current Header Sizing (to be changed)
```tsx
// site-header.tsx line 15 — BEFORE
className="sticky top-0 z-30 flex h-20 w-full shrink-0 items-center justify-between border-b bg-background/80 px-8 backdrop-blur-md transition-all duration-300"
// AFTER (compact B2B density)
className="sticky top-0 z-30 flex h-12 w-full shrink-0 items-center justify-between border-b bg-background px-4 transition-all duration-300"
```

## State of the Art

| Old Approach | Current Approach | Applies To |
|--------------|------------------|------------|
| Hardcoded Tailwind colors (`bg-green-100`) | CSS variable tokens (`var(--status-top-rated-bg)`) | DSG-03 status badges |
| Hardcoded yellow/blue (`bg-yellow-100`) | Design token utilities (`bg-[var(--metric-highlight)]`) | DSG-04 metric cards |
| `rounded-md` or `rounded-lg` badges | `rounded-full` pill badges | DSG-05 all badges |

**Residual issues (confirmed via audit):**
- `hotel-card.tsx` lines 61-62: `rgba(59, 130, 246, 0.5)` hardcoded blue in Framer Motion flash animation — replace with `hsl(171 53% 64% / 0.5)` to use primary teal.
- `slack-preview.tsx`, `whatsapp-preview.tsx`: `text-blue-*` classes — intentional (UI mimics real Slack/WhatsApp brand colors), NOT in scope for DSG-03.

## Open Questions

1. **Business/Personal Toggle Interactivity**
   - What we know: The mockup shows a Business/Personal toggle in the header. The current implementation has a styled toggle with no actual routing behavior.
   - What's unclear: Does DSG-06 require the toggle to be functional (switch context) or just visually match the mockup?
   - Recommendation: Preserve existing behavior (visual only, Business active). Only restyle to match mockup density. Do not add routing logic — that is out of scope.

2. **Dark Mode Toggle Placement**
   - What we know: The compact header (`h-12`) has less horizontal space. The current toggle button with icon is small (`h-7 w-7`).
   - What's unclear: The mockup shows a sun/gear icon — it may be a settings button, not a theme toggle.
   - Recommendation: CONTEXT.md marks this as Claude's discretion. Keep the theme toggle button but use a smaller `ghost` variant button that fits the compact header. The icon in the mockup resembles a settings gear — consider swapping to `Settings2` or keeping `Sun/Moon` and trusting the behavior.

## Sources

### Primary (HIGH confidence)
- Direct codebase audit — `src/components/layout/app-sidebar.tsx`, `src/components/layout/site-header.tsx`, `src/components/ui/sidebar.tsx`, `src/components/ui/badge.tsx`, `src/features/admin/components/metric-cards.tsx`, `src/features/hotels/components/hotel-card.tsx`, `src/app/globals.css`
- `.planning/designs/01-shell.png` — approved Phase 7 shell mockup (viewed via Read tool)
- `08-CONTEXT.md` — user decisions

### Secondary (MEDIUM confidence)
- shadcn/ui sidebar.tsx source code — SidebarMenuButton sizing constants verified directly in file
- Tailwind CSS v4 `@theme inline` pattern — verified in `globals.css`

## Metadata

**Confidence breakdown:**
- DSG-03/04/05 audit: HIGH — direct codebase inspection, all files read
- DSG-06 mockup diff: HIGH — mockup image viewed, current code read, diff is specific
- Architecture (sidebar sizing): HIGH — shadcn sidebar.tsx source verified
- Pitfalls: HIGH — based on direct code analysis of the actual files

**Research date:** 2026-03-27
**Valid until:** 2026-04-27 (stable stack — Tailwind v4 pinned, shadcn local copy)
