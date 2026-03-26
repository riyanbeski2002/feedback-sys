# Phase 7: Design Mockups - Research

**Researched:** 2026-03-26
**Domain:** Pencil MCP design tooling, UI mockup creation, notification channel chrome
**Confidence:** HIGH (Pencil MCP instructions from active MCP server; project codebase fully read)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Screen Scope**
- All 7 screens get full mockups — no exceptions: Hotels, Bookings, Feedback Form, Success, Admin, Settings, Notifications
- App shell (sidebar + header) designed as a standalone shared component frame first, then reused/embedded in all screen mockups as the single source of truth

**Screen Design Order**
- Claude determines the order based on design dependency logic (Shell establishes the chrome that all screens inherit)
- Suggested dependency order: App Shell → Hotels → Bookings → Admin → Settings → Notifications → Feedback Form → Success

**Responsive Variants**
- Desktop-only for all screens **except** the Feedback Form
- Feedback Form gets a mobile variant at 375px width (travellers fill this on their phone)

**Design Fidelity**
- High-fidelity, pixel-accurate — real colors, exact spacing, real typography
- Phase 8 implements to match; no creative freedom on visual details
- Exact clone of Ziptrrip aesthetic: same teal (#72D3C4), same sidebar density, same typography weight, same card style

**Content & Data**
- Realistic data throughout — use the Indian corporate travel context from seed data
  - Names: Priya Sharma, Arjun Mehta, Kavitha Nair, Rohan Verma
  - Hotels: Grand Hyatt Mumbai, The Leela Delhi, Taj Bangalore, etc.
  - Scores that match the seeded distribution
- No Lorem Ipsum — every screen should look reviewable as the real product

**States Required**
- Happy path (primary state) for every screen
- Empty states — Hotels with no feedback, empty bookings list, Settings with no config saved
- Error states — Settings save failed, feedback submission error
- Feedback Form validation state — form with validation errors shown

**Notification Format Designs**
- Data fields per notification: Hotel name + traveller name, feedback comment excerpt (~120 chars), weighted score + category breakdown, sentiment tag + urgency flag (e.g., URGENT — Negative, Cleanliness)
- Channel chrome: Realistic — Email looks like a real email client UI, Slack looks like Slack, Teams like Teams, WhatsApp like WhatsApp (actual channel context, not stylized cards)
- Example submissions: Both a positive (top-rated hotel, glowing comment) AND a negative (flagged/URGENT hotel, alarming comment) example for each channel — shown side by side or as alternate states
- Notifications page layout: 2×2 grid of channel preview cards (Email + Slack on top, Teams + WhatsApp on bottom)

**Approval & Handoff**
- Approval is implicit — if no issues are raised on a screen, Phase 8 can proceed with it
- Phase 8 runs in parallel — implementation starts on approved screens while remaining screens are still being designed
- One revision round maximum per screen — design, review, revise once, lock
- Handoff format: both live Pencil .pen files (Phase 8 reads via Pencil MCP) AND exported PNGs saved to `.planning/designs/` as the frozen visual index

### Claude's Discretion
- Exact order of screen design within the dependency logic
- Exact spacing values and grid dimensions within the Ziptrrip aesthetic
- Which exact Slack/Teams/WhatsApp UI chrome elements to replicate (channel header, message bubble style, timestamp format)
- How to handle the Success page (confirmation card design)

### Deferred Ideas (OUT OF SCOPE)
- None — discussion stayed within phase scope.
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| DSG-01 | All app screens have Pencil MCP-approved mockups before any UI code is written | Pencil MCP tool chain documented; 7 screens + states mapped; file/export workflow defined |
| DSG-02 | Pencil MCP mockups include pixel-accurate notification format designs for Email, Slack, Teams, and WhatsApp showing how feedback alerts appear in each channel | Notification data fields extracted from CONTEXT.md; existing channel components audited; 2×2 grid layout pattern documented |
</phase_requirements>

---

## Summary

Phase 7 is a pure design phase: no application code changes. Every deliverable is a Pencil MCP artifact (.pen file + exported PNGs). The Pencil MCP server is already active in this environment and provides direct tools for creating, reading, and exporting design files. All design decisions are locked in CONTEXT.md — this research focuses on the correct Pencil MCP workflow, design system mapping, and how to structure the .pen file so Phase 8 can consume it without ambiguity.

The project has a fully defined design language: teal `#72D3C4` as primary accent (CSS variable `--primary: hsl(171 53% 64%)`), Inter font, `rounded-full` pill buttons, white card backgrounds, B2B sidebar density. All these tokens are already encoded in `globals.css` and the existing component library (shadcn/ui components in `src/components/ui/`). The mockups must faithfully reflect the components that already exist in code — not invent new patterns.

The notifications screen is the most structurally distinct deliverable. The existing implementation uses a tab/selector pattern (one channel at a time), but the CONTEXT.md decision locks in a 2×2 grid showing all four channels simultaneously. The mockup must depict this new layout, and each channel card must carry both a positive and negative feedback example, using realistic Indian travel data (not the current static `Riyan Khan / Grand Royal Bangalore` placeholder data).

**Primary recommendation:** Use Pencil MCP tools in the sequence: `get_guidelines(web-app)` → `get_style_guide_tags` → `get_style_guide` → `set_variables` (Ziptrrip tokens) → design frames in dependency order → `export_nodes` to `.planning/designs/`. Keep all screens in a single .pen file with one page per screen for easy navigation.

---

## Standard Stack

### Core

| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Pencil MCP | Active in env | Create, read, and export .pen design files | Locked decision; only tool available for this workflow |
| `mcp__pencil__get_guidelines` | — | Fetch design rules for web-app pattern | Must call before designing to load correct layout rules |
| `mcp__pencil__get_style_guide` | — | Load a matching style guide for the design aesthetic | Ensures visual consistency without hand-tuning every value |
| `mcp__pencil__set_variables` | — | Store Ziptrrip color tokens and typography in the .pen file | Makes all frames reference the same token set |
| `mcp__pencil__batch_design` | — | Execute multi-operation design actions (insert, copy, update, replace, move, delete) | Core creation mechanism for all frames and nodes |
| `mcp__pencil__export_nodes` | — | Export finished frames to PNG in `.planning/designs/` | Required handoff format |

### Supporting

| Tool | Purpose | When to Use |
|------|---------|-------------|
| `mcp__pencil__get_editor_state` | Check currently active .pen file and selection | Always first call at session start |
| `mcp__pencil__open_document` | Open existing or create new .pen file | When no file is active |
| `mcp__pencil__get_screenshot` | Visual validation of a frame mid-design | After completing each screen frame, before moving on |
| `mcp__pencil__snapshot_layout` | Inspect computed layout rectangles | When inserting nodes and needing to know where space is |
| `mcp__pencil__find_empty_space_on_canvas` | Find free canvas space for new frames | Before placing a new screen frame |
| `mcp__pencil__batch_get` | Read existing nodes by pattern or ID | When resuming work or inspecting existing frames |
| `mcp__pencil__get_variables` | Read current token values | Before overwriting variables to confirm state |

### No Installation Required

All Pencil MCP tools are already active in the environment. No `npm install` needed.

---

## Architecture Patterns

### Recommended .pen File Structure

```
feedback-intel.pen
├── Page: Shell         # App shell frame (sidebar + header standalone)
├── Page: Hotels        # Hotels grid — happy path + empty state
├── Page: Bookings      # Bookings list — happy path + empty state
├── Page: Admin         # Admin dashboard — happy path
├── Page: Settings      # Settings — happy path + no-config state + save-error state
├── Page: Notifications # 2×2 channel grid (positive + negative examples per channel)
├── Page: Feedback-Form # Desktop happy path + desktop validation + 375px mobile
└── Page: Success       # Confirmation card
```

One page per screen. Each page can contain multiple frames (one per state). This structure ensures Phase 8 can open the file and navigate directly to the relevant screen.

### Recommended File Location

```
.planning/designs/
├── feedback-intel.pen          # Live editable file (Phase 8 reads via Pencil MCP)
├── 01-shell.png
├── 02-hotels-happy.png
├── 02-hotels-empty.png
├── 03-bookings-happy.png
├── 03-bookings-empty.png
├── 04-admin-happy.png
├── 05-settings-happy.png
├── 05-settings-no-config.png
├── 05-settings-save-error.png
├── 06-notifications-grid.png
├── 07-feedback-form-desktop.png
├── 07-feedback-form-validation.png
├── 07-feedback-form-mobile-375.png
└── 08-success.png
```

### Pattern 1: Design System Variable Setup

**What:** Before drawing any frames, register Ziptrrip design tokens as Pencil variables. This ensures every node referencing color/typography picks from the token set rather than raw values.

**When to use:** Immediately after opening/creating the .pen file, before any `batch_design` calls.

**Token set to register (from `globals.css`):**

```
primary:           #72D3C4  (hsl 171 53% 64%)
primary-foreground: #FFFFFF
background:        hsl(180 10% 98%)  ≈ #F8FAFA
foreground:        hsl(180 5% 10%)   ≈ #181A1A
card:              #FFFFFF
muted:             hsl(180 5% 96%)   ≈ #F2F4F4
muted-foreground:  hsl(180 2% 45%)   ≈ #717373
accent:            hsl(171 53% 94%)  ≈ #E8F9F7
accent-foreground: hsl(171 53% 34%)  ≈ #267268
destructive:       hsl(0 79% 72%)    ≈ #F08080
border:            hsl(180 5% 92%)   ≈ #E9ECEC
radius:            0.75rem = 12px
```

**Call:**
```
mcp__pencil__set_variables({
  variables: [
    { name: "primary", value: "#72D3C4" },
    { name: "primary-foreground", value: "#FFFFFF" },
    { name: "background", value: "#F8FAFA" },
    { name: "foreground", value: "#181A1A" },
    { name: "card", value: "#FFFFFF" },
    { name: "muted", value: "#F2F4F4" },
    { name: "muted-foreground", value: "#717373" },
    { name: "accent", value: "#E8F9F7" },
    { name: "accent-foreground", value: "#267268" },
    { name: "destructive", value: "#F08080" },
    { name: "border", value: "#E9ECEC" },
    { name: "radius", value: "12" }
  ]
})
```

### Pattern 2: App Shell as Reusable Component Frame

**What:** Design the sidebar + header combination as a single named frame first. Then use `batch_design` Copy (`C`) operations to embed it as a shared element in every subsequent screen frame.

**Why:** Sidebar and header are identical across all 7 screens. Designing them once and copying ensures pixel-accuracy and eliminates drift. If the shell is revised during one revision round, only one frame needs updating.

**Sidebar spec (from `app-sidebar.tsx`):**
- Width: 240px (expanded) / 56px (icon-collapsed)
- Use expanded state for all mockups
- Logo mark: 32×32 teal rounded-md square + "ziptrrip" bold + "FEEDBACK INTEL" 10px uppercase tracking-widest
- Nav items: Dashboard, Bookings, Hotels, Notifications, Settings — h-11 each, gap-1
- Active item: `bg-primary/10 text-primary` — teal-tinted background, teal icon + text
- Footer: 16px padded card, `bg-primary/5`, border `border-primary/10`, "Verified Stays Only" caption

**Header spec (from `site-header.tsx`):**
- Height: 80px (h-20), sticky, `bg-background/80 backdrop-blur`
- Left: SidebarTrigger + divider + "PROJECT / Feedback Intelligence" two-line label
- Right: Business/Personal pill toggle (rounded-full segmented) + theme toggle icon button (rounded-full, outline)

### Pattern 3: Notification 2×2 Grid Layout

**What:** The Notifications page redesign from tab-per-channel to simultaneous 2×2 grid. Each cell is a channel card containing two states (positive feedback and negative/URGENT feedback) shown as alternate states or side-by-side within the card.

**Layout:**
```
┌─────────────────────┬─────────────────────┐
│  EMAIL              │  SLACK              │
│  [Positive example] │  [Positive example] │
│  [Negative example] │  [Negative example] │
├─────────────────────┼─────────────────────┤
│  TEAMS              │  WHATSAPP           │
│  [Positive example] │  [Positive example] │
│  [Negative example] │  [Negative example] │
└─────────────────────┴─────────────────────┘
```

**Realistic data for notification mockups:**

Positive example:
- Hotel: Grand Hyatt Mumbai | Traveller: Priya Sharma
- Comment: "Exceptional stay — flawless service, the housekeeping was impeccable and the breakfast spread was outstanding. Would return without hesitation."
- Score: 4.7/5.0 | Cleanliness 5.0, Service 4.8, Value 4.2, Amenities 4.9
- Tag: POSITIVE — Cleanliness, Service

Negative example:
- Hotel: Hotel Raj Palace Jaipur | Traveller: Arjun Mehta
- Comment: "Room smelled of damp, AC was not functional for the first night, front desk was dismissive. The property does not match what was advertised."
- Score: 1.4/5.0 | Cleanliness 1.0, Service 1.2, Value 1.8, Amenities 1.5
- Tag: ⚠️ URGENT — Negative, Cleanliness

**Channel chrome specs (from existing component audit + Claude's Discretion per CONTEXT.md):**

Email chrome:
- Sender bar: `support@ziptrrip.com`, subject line visible
- Email client toolbar row (archive, reply, forward icons)
- White email body card, teal CTA button `rounded-full`

Slack chrome:
- Background: `#1A1D21` dark, header `#121016`
- Bot avatar: orange 'Z' square on left, "Ziptrrip Feedback" app badge, timestamp
- Left-border attachment block (4px teal `#72D3C4` left border, dark bg)
- For URGENT: left border switches to `#F08080` destructive red

Teams chrome:
- Light mode: white/grey Microsoft card layout
- Adaptive Card style: channel header with Teams logo, message bubble, action buttons

WhatsApp chrome:
- Background: `#ECE5DD` (WA green-beige pattern)
- Message bubble: white, left-aligned for incoming bot message
- Sender: "Ziptrrip Travel" with green checkmarks
- For URGENT: pill badge `URGENT` in coral/red above message content

### Pattern 4: Feedback Form Mobile Variant

**What:** At 375px, the form collapses to single-column layout. Touch targets must be minimum 44px tall.

**Desktop layout:** Two-column category sliders side by side
**Mobile layout:** Single column, full-width sliders, submit button full-width sticky at bottom

**Validation state fields to show:**
- Comment field: empty + red error message "Comment is required for scores below 3"
- At least one slider at 1/5 showing error state
- Submit button disabled/grey

### Anti-Patterns to Avoid

- **Using raw hex colors instead of variables:** Set Pencil variables first, then reference them. Raw hex values make revisions require find/replace across all nodes.
- **Designing notifications as generic cards:** The CONTEXT.md requires realistic channel chrome — the Slack preview must look like Slack (dark `#1A1D21` bg), not a styled app card.
- **Lorem Ipsum data:** Every screen must use the seeded Indian corporate travel data. The mockup is the review artifact.
- **Single-state frames:** Each frame must show one state clearly. Happy path and error state should be separate named frames, not overlaid.
- **Skipping `get_screenshot` validation:** After each completed frame, call `get_screenshot` before moving to the next. Visual drift is caught immediately, not after all 7 screens.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Color token management | Manual hex values inline on every node | `set_variables` before design starts | Token changes propagate; no find/replace across 30+ frames |
| Sidebar replication | Redraw sidebar chrome on every screen | Copy App Shell frame node into each screen | One source of truth; revision touches one frame |
| Style guide selection | Manually tune every spacing/color value | `get_style_guide_tags` + `get_style_guide` | Pencil provides a curated palette that matches the requested aesthetic |
| Visual validation | Trust that design looks correct without checking | `get_screenshot` after each frame | Pencil layout engine may place nodes unexpectedly; screenshot catches it |
| Layout positioning | Guess where to insert new frames | `find_empty_space_on_canvas` | Prevents frame overlap on the canvas |

**Key insight:** Pencil MCP's batch operation model (up to 25 ops per call) is designed for incremental construction. Structure each screen as multiple `batch_design` calls: one for the shell/chrome layer, one for the content layer, one for data/text nodes. This keeps each call reviewable and recoverable.

---

## Common Pitfalls

### Pitfall 1: Designing Notifications as App Cards Instead of Channel Chrome

**What goes wrong:** The current implementation in `src/features/notifications/` renders channel previews as shadcn Cards inside the app shell. The mockup requirement is different: each channel cell must look like the native channel UI (Slack dark theme, Teams adaptive card, WhatsApp chat view). If you design them as app-styled cards you produce the wrong reference for Phase 8.

**Why it happens:** It's easier to match the existing component code than to research what real channel chrome looks like.

**How to avoid:** For each channel cell, start with the channel's background color and font rendering, not the app's card component. Slack = `#1A1D21` bg. Teams = white Microsoft card. WhatsApp = `#ECE5DD` with bubble. Email = white email client viewport.

**Warning signs:** All four channel cells look visually similar in style — that's wrong; they should each look immediately identifiable.

### Pitfall 2: Missing States in Exported PNGs

**What goes wrong:** Happy path is designed and exported, but empty states and error states are left as mental notes and never committed as PNG files. Phase 8 has no visual reference for these states.

**Why it happens:** States feel "obvious" to design later, but Phase 7's gate is specifically about locking the visual reference before any code is written.

**How to avoid:** Track states in a checklist before calling a screen complete. The 14 PNG exports listed in the file structure above are the minimum deliverables.

**Warning signs:** The `.planning/designs/` directory has fewer than 14 PNG files when phase is declared complete.

### Pitfall 3: Teal as Body Text Color

**What goes wrong:** Using `#72D3C4` for body text or large text areas. This color fails WCAG AA contrast on white backgrounds (contrast ratio ~2.5:1 against white, requirement is 4.5:1 for normal text).

**Why it happens:** Primary teal is used for active nav items — it's tempting to use it broadly.

**How to avoid:** Reserve `#72D3C4` for: icons, focus rings, left-border accents, small pill backgrounds (`accent: #E8F9F7`), and active nav states with dark foreground text. All body text should use `--foreground: #181A1A`. The existing `STATE.md` explicitly documents this as a known decision.

**Warning signs:** Any text larger than 14px styled in `#72D3C4` is a violation.

### Pitfall 4: Batch Operations Exceeding 25 Per Call

**What goes wrong:** Attempting to build an entire screen in one `batch_design` call hits the tool's recommended limit of 25 operations, causing partial execution or errors.

**Why it happens:** A full screen with sidebar, header, and content can easily require 40+ insert/update operations.

**How to avoid:** Break each screen into layers: (1) frame + shell nodes, (2) content section, (3) data/text population. Each layer is a separate `batch_design` call with ≤25 operations.

**Warning signs:** Single `batch_design` call trying to insert more than 20 nodes at once.

### Pitfall 5: .pen File Not in `.planning/designs/`

**What goes wrong:** .pen file created at default location or project root. Phase 8 can't find it via Pencil MCP `open_document`.

**How to avoid:** On `open_document`, explicitly pass `.planning/designs/feedback-intel.pen` as the path. If opening a new file, move it there immediately.

---

## Code Examples

These are Pencil MCP operation patterns verified from the MCP server tool definitions.

### Session Start Sequence

```
1. mcp__pencil__get_editor_state()
   → check if .pen file is active

2. If no active file:
   mcp__pencil__open_document(".planning/designs/feedback-intel.pen")
   — or pass "new" if file does not yet exist

3. mcp__pencil__get_guidelines(topic="web-app")
   → load web-app layout rules

4. mcp__pencil__get_style_guide_tags()
   → identify relevant style tags

5. mcp__pencil__get_style_guide(tags=[...], name="...")
   → load a matching style guide

6. mcp__pencil__set_variables({ variables: [...Ziptrrip tokens...] })
   → register design system tokens
```

### Creating a Screen Frame

```
// batch_design operation script syntax (one operation per line)
shell=I("root", { type: "frame", name: "Shell", width: 240, height: 1024, x: 0, y: 0, background: "#F8FAFA" })
sidebar_logo=I(shell, { type: "rectangle", name: "logo-mark", width: 32, height: 32, x: 16, y: 16, background: "#72D3C4", borderRadius: 8 })
// ... up to 25 ops total
```

### Copying Shell Into a Screen Frame

```
// Copy App Shell frame into Hotels page frame
hotels_shell=C("shell-frame-id", "hotels-frame-id", { x: 0, y: 0 })
```

### Export Nodes to PNG

```
mcp__pencil__export_nodes({
  nodeIds: ["hotels-happy-frame-id", "hotels-empty-frame-id"],
  format: "PNG",
  folder: ".planning/designs/"
})
```

### Screenshot Validation

```
mcp__pencil__get_screenshot({ nodeId: "hotels-happy-frame-id" })
→ Returns visual. Inspect for: correct sidebar active state, teal accent on icons, card backgrounds white, data populated.
```

---

## Screen-by-Screen Design Checklist

### Frame 1: App Shell (standalone)
- [ ] Sidebar at 240px, collapsed icon variant not needed
- [ ] Logo: teal 32px square + "ziptrrip" bold + "FEEDBACK INTEL" subtext
- [ ] Nav items: Dashboard, Bookings, Hotels, Notifications, Settings (one active)
- [ ] Active state: teal bg tint + teal icon
- [ ] Footer: "Verified Stays Only" teal card
- [ ] Header: 80px, SidebarTrigger + breadcrumb + Business/Personal toggle + theme button

### Frame 2: Hotels (happy path)
- [ ] Shell embedded
- [ ] Page title: "Discovery Feed" with Hotel icon in teal
- [ ] 4-badge legend: Top Rated / Reliable / Needs Review / Flagged (colors per DSG-03 — use teal-based palette, not hardcoded green/slate/orange/red)
  - Note: DSG-03 badge redesign is Phase 8's implementation task, but Phase 7 mockup MUST show the new teal-based palette as the reference
- [ ] Hotel grid cards: 8+ hotels, realistic names, scores, status badges
- [ ] Data: Grand Hyatt Mumbai (4.8, Top Rated), The Leela Delhi (4.2, Reliable), Hotel Raj Palace Jaipur (1.4, Flagged)

### Frame 3: Hotels (empty state)
- [ ] Shell embedded
- [ ] Zero cards, centered empty state message, icon, CTA

### Frame 4: Bookings (happy path)
- [ ] Shell embedded
- [ ] Table layout: booking ID, hotel, traveller, dates, status, action
- [ ] Mix of statuses: confirmed, completed, pending
- [ ] "Submit Feedback" action visible on completed rows

### Frame 5: Bookings (empty state)
- [ ] Shell embedded
- [ ] Zero rows empty state

### Frame 6: Admin (happy path)
- [ ] Shell embedded
- [ ] Metric cards: Total Feedbacks, Platform Avg Score, Flagged Hotels, Total Hotels
- [ ] Flagged Hotels table (left 2/3): Hotel Raj Palace Jaipur prominent
- [ ] Live Activity feed (right 1/3): Recent feedback with sentiment labels
- [ ] Export Report + System Config buttons (rounded-full)

### Frame 7: Settings (happy path — config loaded)
- [ ] Shell embedded
- [ ] ConfigForm with current weights: Cleanliness 30%, Service 30%, Value 20%, Amenities 20%
- [ ] Trigger delay, reminder frequency fields
- [ ] Threshold field
- [ ] Save Changes button

### Frame 8: Settings (no config state)
- [ ] Shell embedded
- [ ] Empty state with seed command instruction

### Frame 9: Settings (save error state)
- [ ] Shell embedded
- [ ] Error toast or inline error: "Error Loading Configuration" in destructive style

### Frame 10: Notifications (2×2 grid)
- [ ] Shell embedded
- [ ] Page title: "Notification Center" with Bell icon
- [ ] 2×2 grid of channel cards (Email, Slack top row; Teams, WhatsApp bottom)
- [ ] Each card: channel logo + name prominently at top
- [ ] Each card shows positive AND negative example
- [ ] Positive: Grand Hyatt Mumbai / Priya Sharma / 4.7 / POSITIVE
- [ ] Negative: Hotel Raj Palace Jaipur / Arjun Mehta / 1.4 / URGENT
- [ ] Channel chrome: Slack dark bg, Teams MS card, WhatsApp ECE5DD, Email client viewport

### Frame 11: Feedback Form (desktop happy path)
- [ ] Full sidebar + header
- [ ] Hotel name: "Grand Hyatt Mumbai"
- [ ] 5 category sliders: Value, Service, Cleanliness, Amenities, Intent
- [ ] Optional comment textarea
- [ ] Submit button rounded-full primary teal

### Frame 12: Feedback Form (desktop validation)
- [ ] Same layout, at least one slider error + empty comment error message
- [ ] Submit button disabled

### Frame 13: Feedback Form (375px mobile)
- [ ] No sidebar, mobile-only header or none
- [ ] Single column, full-width sliders
- [ ] Touch targets ≥ 44px
- [ ] Submit sticky at bottom

### Frame 14: Success
- [ ] Confirmation card (Claude's discretion on design)
- [ ] Hotel name, checkmark icon in teal, "Thank you" message
- [ ] Score submitted summary

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| Notifications tab selector (one channel visible at a time) | 2×2 grid showing all 4 channels simultaneously | More scannable for admin review; Phase 8 must update the NotificationsPage layout |
| Generic shadcn Card wrappers for channel previews | Realistic native channel chrome per channel | Phase 8 component code will need per-channel styling, not generic card |
| Static placeholder data (Riyan Khan / Grand Royal Bangalore) | Real seeded Indian travel data | Mockup functions as the actual product review artifact |

---

## Open Questions

1. **Does Pencil MCP support a "component" or "symbol" concept for reusable frames?**
   - What we know: The Copy (`C`) operation in `batch_design` copies nodes, not links them. Changes to the original do not propagate.
   - What's unclear: Whether Pencil supports live-linked component instances (like Figma components).
   - Recommendation: Treat the App Shell as a reference frame; use `batch_get` to find it and `batch_design` Copy to embed it. If revision is needed, update all instances manually — acceptable given one revision round max per screen.

2. **Pencil .pen file page/artboard naming API**
   - What we know: `batch_design` Insert creates nodes with `name` property. The tool definition shows frames as a node type.
   - What's unclear: Whether "pages" are a distinct concept from "frames" in Pencil's model, or if pages are top-level frames on the canvas.
   - Recommendation: Design each screen as a top-level named frame. If pages are supported as a distinct concept, use them; otherwise named frames serve the same navigational purpose.

3. **`export_nodes` folder path — relative vs absolute**
   - What we know: The tool accepts a `folder` parameter.
   - What's unclear: Whether the path should be relative to the project root or absolute.
   - Recommendation: Use the absolute path `/Users/User/Documents/feedback-sys/.planning/designs/` to avoid ambiguity.

---

## Sources

### Primary (HIGH confidence)
- Pencil MCP server tool definitions (injected via MCP system instructions in this session) — all tool names, parameters, operation syntax verified directly
- `/Users/User/Documents/feedback-sys/src/app/globals.css` — all Ziptrrip color tokens, exact hex/hsl values
- `/Users/User/Documents/feedback-sys/src/components/layout/app-sidebar.tsx` — sidebar structure, nav items, active state classes
- `/Users/User/Documents/feedback-sys/src/components/layout/site-header.tsx` — header height, layout, Business/Personal toggle
- `/Users/User/Documents/feedback-sys/.planning/phases/07-design-mockups/07-CONTEXT.md` — all locked decisions
- `/Users/User/Documents/feedback-sys/.planning/STATE.md` — teal WCAG AA decision, Phase 6 decisions

### Secondary (MEDIUM confidence)
- `/Users/User/Documents/feedback-sys/src/features/notifications/components/` — existing channel preview components; used to understand current implementation vs required mockup design
- All existing page components read to audit content areas per screen

### Tertiary (LOW confidence)
- Slack dark theme color values (`#1A1D21`, `#121016`) from Claude training data — verify against actual Slack UI screenshots if high fidelity is critical
- WhatsApp background color (`#ECE5DD`) from Claude training data — same note

---

## Metadata

**Confidence breakdown:**
- Pencil MCP tool API: HIGH — tool definitions provided directly by MCP server in this session
- Design tokens / color values: HIGH — read directly from `globals.css`
- Existing component structure: HIGH — all relevant source files read
- Notification channel chrome details: MEDIUM — Slack/Teams/WA colors from training data, not live-verified
- Pencil page vs frame concept: LOW — not explicitly documented in available tool definitions

**Research date:** 2026-03-26
**Valid until:** 2026-04-25 (Pencil MCP tool definitions are session-injected; stable as long as MCP server version doesn't change)
