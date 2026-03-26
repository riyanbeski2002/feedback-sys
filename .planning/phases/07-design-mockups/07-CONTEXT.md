# Phase 7: Design Mockups - Context

**Gathered:** 2026-03-26
**Status:** Ready for planning

<domain>
## Phase Boundary

Create Pencil MCP-approved mockups for every app screen and all 4 notification channel formats before any UI code is written or changed. This phase produces the visual reference set that Phase 8 implements. No code changes in this phase.

</domain>

<decisions>
## Implementation Decisions

### Screen Scope
- All 7 screens get full mockups — no exceptions: Hotels, Bookings, Feedback Form, Success, Admin, Settings, Notifications
- App shell (sidebar + header) designed as a standalone shared component frame first, then reused/embedded in all screen mockups as the single source of truth

### Screen Design Order
- Claude determines the order based on design dependency logic (Shell establishes the chrome that all screens inherit)
- Suggested dependency order: App Shell → Hotels → Bookings → Admin → Settings → Notifications → Feedback Form → Success

### Responsive Variants
- Desktop-only for all screens **except** the Feedback Form
- Feedback Form gets a mobile variant at 375px width (travellers fill this on their phone)

### Design Fidelity
- High-fidelity, pixel-accurate — real colors, exact spacing, real typography
- Phase 8 implements to match; no creative freedom on visual details
- Exact clone of Ziptrrip aesthetic: same teal (#72D3C4), same sidebar density, same typography weight, same card style

### Content & Data
- Realistic data throughout — use the Indian corporate travel context from seed data
  - Names: Priya Sharma, Arjun Mehta, Kavitha Nair, Rohan Verma
  - Hotels: Grand Hyatt Mumbai, The Leela Delhi, Taj Bangalore, etc.
  - Scores that match the seeded distribution
- No Lorem Ipsum — every screen should look reviewable as the real product

### States Required
- Happy path (primary state) for every screen
- Empty states — Hotels with no feedback, empty bookings list, Settings with no config saved
- Error states — Settings save failed, feedback submission error
- Feedback Form validation state — form with validation errors shown

### Notification Format Designs
- **Data fields per notification:** Hotel name + traveller name, feedback comment excerpt (~120 chars), weighted score + category breakdown, sentiment tag + urgency flag (e.g., ⚠️ URGENT — Negative, Cleanliness)
- **Channel chrome:** Realistic — Email looks like a real email client UI, Slack looks like Slack, Teams like Teams, WhatsApp like WhatsApp (actual channel context, not stylized cards)
- **Example submissions:** Both a positive (top-rated hotel, glowing comment) AND a negative (flagged/URGENT hotel, alarming comment) example for each channel — shown side by side or as alternate states
- **Notifications page layout:** 2×2 grid of channel preview cards (Email + Slack on top, Teams + WhatsApp on bottom)

### Approval & Handoff
- Approval is implicit — if no issues are raised on a screen, Phase 8 can proceed with it
- Phase 8 runs in parallel — implementation starts on approved screens while remaining screens are still being designed
- One revision round maximum per screen — design, review, revise once, lock
- Handoff format: both live Pencil .pen files (Phase 8 reads via Pencil MCP) AND exported PNGs saved to `.planning/designs/` as the frozen visual index

### Claude's Discretion
- Exact order of screen design within the dependency logic
- Exact spacing values and grid dimensions within the Ziptrrip aesthetic
- Which exact Slack/Teams/WhatsApp UI chrome elements to replicate (channel header, message bubble style, timestamp format)
- How to handle the Success page (confirmation card design)

</decisions>

<specifics>
## Specific Ideas

- Ziptrrip reference: teal #72D3C4 as the primary accent, white card backgrounds, Inter font, rounded-full pill buttons, B2B sidebar density
- The flagged hotel notification should be "genuinely alarming enough to make the URGENT flag feel earned" (same bar as the seed feedback comments)
- The 375px Feedback Form variant should feel like a native mobile form — consider single-column layout, larger touch targets
- Notifications page 2×2 grid: each card should show the channel logo prominently so the user instantly knows which format they're looking at

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope.

</deferred>

---

*Phase: 07-design-mockups*
*Context gathered: 2026-03-26*
