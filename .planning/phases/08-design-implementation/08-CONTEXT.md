# Phase 8: Design Implementation - Context

**Gathered:** 2026-03-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Apply the approved Ziptrrip visual identity across all components. Four requirements: semantic badge color tokens (DSG-03), design system metric card colors (DSG-04), pill-shaped badges (DSG-05), and B2B sidebar/header density (DSG-06). No new features — this is purely visual identity alignment.

</domain>

<decisions>
## Implementation Decisions

### DSG-03 / DSG-04 / DSG-05 — Status
Already completed in the current dev session (prior to GSD planning). CSS variable tokens added to globals.css, all badge/chip components updated to `rounded-full`, metric cards updated to use token colors. The plan should audit and verify these are complete, then document in SUMMARY.md.

### DSG-06 — Sidebar & Header B2B Density
The Phase 7 Pencil designs are final and approved. The shell/dashboard frame (01-shell.png in `.planning/designs/`) is the reference for the sidebar and header layout. Implement exactly as shown in that mockup — no deviation, no discussion needed.

Key target behaviors inferred from Phase 7 mockup:
- Header should be compact B2B density (not the current 80px spacious height)
- Navigation items in the sidebar should be tight with minimal padding
- Active nav state should be visually distinct using Ziptrrip teal tokens
- Brand area at top of sidebar should be compact

### Claude's Discretion
- Exact pixel values for spacing (match visual feel of mockup, not pixel-perfect)
- How to handle the dark mode toggle placement in a more compact header
- Transition/animation details on sidebar collapse

</decisions>

<specifics>
## Specific Ideas

- **Source of truth**: `.planning/designs/01-shell.png` — the approved Phase 7 shell mockup is the definitive reference for sidebar/header layout and density
- The Business/Personal toggle currently in the header may need repositioning or restyling to fit the compact B2B header
- Sidebar uses shadcn `Sidebar` component with `collapsible="icon"` — keep this behavior, just tighten density

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 08-design-implementation*
*Context gathered: 2026-03-27*
