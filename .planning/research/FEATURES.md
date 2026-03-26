# Feature Research

**Domain:** B2B SaaS corporate travel feedback intelligence — v2 milestone
**Researched:** 2026-03-26
**Confidence:** MEDIUM-HIGH (pattern research from SaaS design systems + notification platforms + data seeding practices)

---

## Scope

This research covers the three v2 feature areas:

1. **Ziptrrip brand design fidelity** — what makes a B2B SaaS dashboard feel branded vs generic
2. **Dynamic notification previews** — how notification preview centers work in SaaS; what each channel should show
3. **Seed data best practices** — what makes good demo data for a hotel feedback system

Existing v1 features (feedback form, hotel ranking grid, admin dashboard, AI tagging, static notification previews) are treated as the baseline. This research informs what v2 must add, what differentiates, and what to avoid.

---

## Feature Landscape

### 1. Ziptrrip Brand Design Fidelity

#### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Consistent primary color applied across all interactive elements | B2B SaaS products use one brand color for CTAs, active states, and highlights — not ad hoc accent colors | LOW | Ziptrrip teal `#72D3C4` must replace every hardcoded color; map to CSS variable `--primary` via shadcn/ui theming |
| Typography hierarchy that matches density of corporate tools | Enterprise dashboards (Navan, Concur) use tight line-height, small-to-medium base font sizes, clear heading scale | LOW | shadcn/ui defaults are close; review `text-sm` vs `text-base` balance; avoid consumer-app large text |
| Sidebar navigation with clear active state | All B2B SaaS uses sidebar; active route must be visually distinct, not ambiguous | LOW | Already using shadcn Sidebar component; verify `text-primary` / `bg-primary/10` active styling uses brand color |
| Empty states that are informative, not blank | Users land on hotel grid or bookings with no data → confusing; product feels broken | LOW-MEDIUM | Needs empty state components for hotels grid, bookings table, feedback feed; should prompt next action |
| Responsive table layout | Admin tables (flagged hotels, recent feedback) must not overflow on standard 1280px business laptops | LOW | Tailwind responsive classes; shadcn Table is already responsive-capable |
| Muted/surface color system that avoids clashing with brand | The primary teal must not compete with destructive reds, warning ambers — semantic color roles must be separate | LOW | Use shadcn CSS variables: `--primary`, `--destructive`, `--muted`, `--accent`; never hardcode hex in components |

#### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Teal-on-dark sidebar header | Corporate travel platforms (Navan, TripActions) use brand-colored or dark headers to separate nav from content — signals premium product vs generic app | LOW | Apply `bg-primary` or dark background to sidebar header/logo area; white/light text against it |
| Status bucket color coding consistent with brand palette | Top-rated = teal-adjacent, flagged = destructive red — but shades derived from brand system, not random colors | LOW | Define `status-top_rated`, `status-stable`, `status-flagged`, `status-needs_review` as semantic badge variants derived from Tailwind palette |
| Data density that signals "business tool" | Consumer apps use large cards with padding; B2B tools pack more into the same viewport (table rows, compact metrics) — this signals domain expertise | MEDIUM | Review metric-cards, hotel-card, feedback-feed: reduce padding, increase information density, smaller avatar/icon sizes |
| Branded feedback form header | The checkout-to-feedback flow should show Ziptrrip brand identity, not a generic form shell — builds traveller trust | LOW | Add Ziptrrip wordmark/logo lockup to feedback form page header; use teal CTA button |

#### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Dark mode toggle | Developers assume every SaaS needs dark mode | Doubles theming work; corporate travel users almost exclusively work in light mode; enterprise procurement demos are in light mode | Ship light mode only; add dark mode class scaffold but do not build it for v2 |
| Animated/particle backgrounds on dashboard | Looks modern in screenshots | Distracts from data; signals consumer app not enterprise tool; increases cognitive load | Static surfaces with subtle border/shadow elevation to distinguish card layers |
| Custom icon set | Product feels more "own" | Adds asset overhead; Lucide icons used by shadcn are already visually consistent | Stick with Lucide; use consistent size tokens (`size-4`, `size-5`) rather than mixing |
| Gradient buttons or CTAs | Trend in consumer SaaS | Clashes with data-forward B2B aesthetic; makes status colors harder to read | Solid `bg-primary` button with `hover:bg-primary/90`; reserve gradients for marketing pages only |

---

### 2. Dynamic Notification Previews

#### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Preview content drawn from real recent feedback | Any notification preview tool (Mailchimp, Courier, Knock) shows preview populated from actual data — static lorem ipsum signals prototype | MEDIUM | Fetch most recent `feedback` row from Supabase; pass `traveller_name`, `hotel_name`, `checkin_date`, `checkout_date` to preview components; fallback to placeholder if no data exists |
| "Sent X ago" or relative time in preview | Users expect to see when the notification was (or would be) sent — validates system timing logic | LOW | Calculate relative time from `feedback.created_at`; show "Sent 2 hours ago" in preview chrome |
| Channel-accurate visual fidelity | Each channel preview must look like that channel's actual UI — not a generic card with a channel label | MEDIUM | Currently implemented; verify accuracy: Slack uses dark `#1A1D21` bg + block kit layout; WhatsApp uses `#E5DDD5` bg + chat bubble; Teams uses card attachment pattern; Email uses header/CTA pattern |
| Visible "context variables" panel | Notification builder tools (Courier, Novu, SuprSend) show a sidebar of template variables alongside the preview — confirms which data drove this preview | LOW | Already exists in current UI as "Context Variables" card; needs to pull from live data instead of `SAMPLE_DATA` const |
| Feedback link present and contextually accurate | Preview must show a real-looking (or real) feedback URL — static `https://ziptrrip.com/f/bk-9283-xk` is obviously fake | LOW | Generate link from actual `booking_id`; format `/feedback/{bookingId}` as the preview URL |

#### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Booking selector — choose which booking to preview | Advanced notification builders (Courier, Novu) let you pick a specific record to preview against — shows system is data-driven, not templated | MEDIUM | Add a dropdown above channel selector showing recent completed bookings; selecting one updates all four channel previews simultaneously |
| "No feedback yet" vs "Awaiting feedback" state | Notification preview should distinguish between a booking where notification was sent but feedback not submitted vs one where feedback arrived — shows lifecycle awareness | MEDIUM | Check `feedback_submitted` on the booking; show "Awaiting response" badge if sent but not yet submitted |
| Channel-specific content differences exposed | WhatsApp quick mode (1–10 rating reply) vs detailed mode (link) vs Slack block kit vs Email CTA — showing these differences side-by-side is a product differentiator | LOW | WhatsApp already has quick/detailed toggle; Slack could show "block kit" label; Teams shows "Adaptive Card" label — surface the format name in preview chrome |
| Last-sent timestamp per channel | Enterprise notification tools show when each channel last triggered — reassures admin the system is active | MEDIUM | Would require a `notification_log` table; for v2, derive from `feedback.created_at` + config `trigger_delay_hours` as an estimate |

#### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Live send from preview panel | "Test send" button seems obvious next step | Out of scope per PROJECT.md — production messaging via real APIs is explicitly deferred; adds significant auth/API surface | Add disabled "Send test" button with tooltip "Live sending coming in v3" — communicates roadmap without building it |
| Template editor in preview panel | Notification builders (Courier, Mailchimp) have template editing | Doubles scope; this is a preview/monitoring tool, not a message builder; editing changes require UX for approval flow | Mark template body as read-only; Settings page controls weights/thresholds; template copy is fixed per v2 |
| Notification history / sent log table | Natural next feature request | Requires `notification_log` table, schema migration, and backfill logic — adds a phase of work | Add placeholder "Notification History" section in UI with "Coming soon" state; scaffolds expectation without blocking v2 |

---

### 3. Seed Data Best Practices

#### Table Stakes (Users Expect These)

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Hotels visible in grid on first load, no manual setup | Any demo/staging environment must show populated UI immediately; blank grids on demo kill trust | LOW | Already in seed script; problem is the seed script must run successfully; see `feedback_config` singleton issue in PROJECT.md |
| Score distribution that showcases all status buckets | Demo must show top-rated, stable, needs_review, and flagged hotels — otherwise the ranking/alerting system looks trivial | LOW | Current seed has 6 hotels covering all 4 buckets; verify `status_bucket` values match DB enum expectations |
| At least one booking per hotel that is feedback-eligible | Booking table must show actionable rows the demo user can interact with; all "future bookings" makes the checkout simulation pointless | LOW | Current seed creates 1 completed booking per hotel per even-indexed traveller; verify `feedback_eligible: true` rows exist for each hotel |
| Comments that exercise AI tagging across all categories | Seed feedback must include comments that produce different `sentiment_label`, `issue_category`, and `urgency_flag` outputs | MEDIUM | Current seed script does NOT insert any `feedback` rows — only bookings; v2 needs pre-submitted feedback rows with realistic comments |
| Recent timestamps (within last 7 days) | Admin activity feed shows `created_at` timestamps; if seed data is 3 months old, the feed looks abandoned | LOW | Seed script uses `new Date()` relative dates; this is correct — just needs to run close to demo time, or use a "reseed on demand" script |

#### Differentiators (Competitive Advantage)

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Pre-submitted feedback rows with varied scores and realistic comments | Notification preview can pull from real feedback; admin dashboard shows live score history; AI tagging looks meaningful with real text | MEDIUM | Add ~12-15 `feedback` rows to seed script covering: positive (score 4+), mixed (score 3), negative with urgency (score <2.5), one per hotel type; see comment examples below |
| Feedback spread across 14 days (not all same day) | Activity feed looks like a live product, not a test run; trend charts (future) have real signal | LOW | Use `new Date(Date.now() - dayOffset * 86400000)` for `created_at` — offset by 0, 1, 2, 3, 5, 8, 13 days |
| Multiple travellers per hotel | Grid ranking becomes meaningful when hotels have 3-5 feedbacks each — single-feedback averages are misleading | LOW | Current seed: 1 feedback-eligible booking per hotel; v2 seed: 2-3 completed bookings + submitted feedback per hotel |
| One hotel with declining trend | Static avg_score is less interesting than a hotel that started at 3.8 and has recent feedback pulling it toward flagged — shows the system's alerting value | MEDIUM | Requires inserting feedback rows with `created_at` spread that, when averaged sequentially, show decline; update `avg_score` accordingly |

#### Anti-Features

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Hundreds of seed rows | "More data = more realistic demo" | Seed becomes slow; hard to reason about; small focused dataset is easier to control for demos | 6 hotels, 3 bookings per hotel (18 total), 12-15 feedback rows — enough to show every feature state |
| Random/faker-generated data | Reproducibility via libraries like Faker | Random data produces inconsistent demo states; a flagged hotel may sometimes have OK scores | Hand-curated seed with fixed scores and comments; deterministic every run |
| Seed as migration | Embedding seed in SQL schema migration | Data and schema are separate concerns; re-seeding becomes impossible without resetting migrations | Keep seed in `src/scripts/seed.ts` as a standalone script with idempotency check (`if count > 0, skip`) |

---

## Feature Dependencies

```
[Brand Theming (CSS variables)]
    └──required by──> [All UI components] (color tokens used throughout)
    └──required by──> [Feedback form branding]
    └──required by──> [Notification preview channel accuracy]

[Seed Data (pre-submitted feedback rows)]
    └──required by──> [Dynamic notification previews] (needs real feedback to populate)
    └──required by──> [Admin dashboard meaningfulness] (activity feed, metrics need data)
    └──enables──> [Booking selector in notification preview]

[Seed Data (completed bookings)]
    └──already exists in v1──> [Checkout simulation flow]

[Dynamic notification previews]
    └──depends on──> [Seed Data (pre-submitted feedback)]
    └──enhances──> [Settings page] (channel enable/disable toggles become testable)

[Settings page singleton fix]
    └──required by──> [Seed data running successfully] (seed inserts config; crash on read blocks demo)
```

### Dependency Notes

- **Seed data (feedback rows) required for dynamic notification previews:** The notification page currently hardcodes `SAMPLE_DATA`; dynamic population requires at least one `feedback` row with a completed `booking` to pull from. Without seed feedback, the preview falls back to static placeholder — acceptable but not differentiated.
- **Brand theming is independent:** CSS variable changes do not require schema or data changes; can be done in parallel with or before data work.
- **Settings fix gates everything:** If the Settings page crashes on load (DB coercion error with `feedback_config` singleton), it blocks admin from changing weights, which blocks correct score calculation on newly seeded feedback. Fix Settings before seeding feedback.

---

## MVP Definition for v2

### Launch With (v2.0)

These are required for the milestone goal ("pixel-match Ziptrrip visual identity, fix all known bugs, make every feature fully functional end-to-end"):

- [ ] **Brand color tokens** — `--primary` maps to `#72D3C4` teal in `globals.css`; all components use CSS variable not hardcoded hex
- [ ] **Settings singleton fix** — `feedback_config` row enforced as singleton; page loads and saves without crash
- [ ] **Seed feedback rows** — 12-15 pre-submitted `feedback` rows with varied scores, realistic comments, spread dates; inserted by seed script
- [ ] **Dynamic notification preview** — notification page fetches most recent `feedback` + `booking` from Supabase; populates channel previews with real traveller/hotel/date data; fallback to placeholder if empty
- [ ] **Empty state components** — hotel grid, bookings table, and admin feed each have a styled empty state with next-action prompt
- [ ] **Status badge color system** — `top_rated`, `stable`, `needs_review`, `flagged` badges use consistent semantic colors derived from brand palette

### Add After Validation (v2.x)

- [ ] **Booking selector in notification preview** — dropdown to choose which booking drives the preview; adds demo interactivity
- [ ] **Declining-trend hotel in seed data** — a hotel with sequential feedback showing score decline; showcases alerting intelligence
- [ ] **Data density pass on admin dashboard** — reduce padding on metric-cards, tighten flagged-hotels table row height

### Future Consideration (v3+)

- [ ] **Notification history log table** — requires `notification_log` schema; scaffolded as placeholder in v2
- [ ] **Live send / test send** — production API integration for Email/WhatsApp/Slack/Teams; explicitly out of scope per PROJECT.md
- [ ] **Dark mode** — double theming work; defer until enterprise client requests it

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Brand teal color tokens applied everywhere | HIGH | LOW | P1 |
| Settings singleton crash fix | HIGH | LOW | P1 |
| Seed feedback rows (pre-submitted with comments) | HIGH | LOW-MEDIUM | P1 |
| Dynamic notification previews from real data | HIGH | MEDIUM | P1 |
| Empty state components | MEDIUM | LOW | P1 |
| Status badge color system | MEDIUM | LOW | P1 |
| Booking selector in notification preview | MEDIUM | MEDIUM | P2 |
| Data density visual pass | LOW-MEDIUM | MEDIUM | P2 |
| Declining-trend hotel in seed | LOW | LOW | P2 |
| Notification history placeholder | LOW | LOW | P3 |
| Dark mode | LOW | HIGH | P3 |

**Priority key:**
- P1: Required for v2.0 milestone completion
- P2: Adds quality; include if time allows in v2
- P3: Future milestone; do not scope into v2

---

## Channel-Specific Content Analysis

### What each notification preview should show from real data

| Channel | Key Fields from Feedback/Booking | Current State | v2 Change |
|---------|----------------------------------|---------------|-----------|
| Email | `traveller_name`, `hotel_name`, `checkin_date`, `checkout_date`, expiry derived from `form_expiry_hours` config | Hardcoded `SAMPLE_DATA` const | Fetch latest eligible booking; derive expiry from `created_at + form_expiry_hours` |
| WhatsApp | `traveller_name`, `hotel_name`, `feedbackLink` (constructed from `booking_id`) | Hardcoded | Same fetch; construct link as `/feedback/{bookingId}` |
| Slack | `hotel_name`, `checkin_date`, `checkout_date`, `feedbackLink` | Hardcoded | Same fetch; Slack block kit border color should use brand teal |
| Teams | `hotel_name`, `checkin_date`, `checkout_date` | Hardcoded (no link shown) | Same fetch; add feedback link as button label text |

### Realistic seed feedback comments (to include in seed script)

These drive meaningful AI tagging output in the admin dashboard:

| Hotel Type | Comment | Expected AI Output |
|------------|---------|-------------------|
| Top-rated | "Excellent stay — staff were attentive and room was spotless. Will definitely book again for future Bangalore trips." | Positive sentiment, category: service+cleanliness, urgency: false |
| Top-rated | "Clean modern room, great location. Breakfast could be more varied but overall very satisfied." | Positive sentiment, category: amenities, urgency: false |
| Stable | "Decent hotel for the price. AC was a bit noisy at night but nothing too serious." | Neutral sentiment, category: amenities, urgency: false |
| Stable | "Check-in was slow but the room was comfortable. Would book again if the price is right." | Neutral sentiment, category: service, urgency: false |
| Needs review | "Room was not cleaned properly when we arrived. Had to wait 30 minutes for housekeeping. Disappointing for the price." | Negative sentiment, category: cleanliness, urgency: false |
| Flagged | "Unacceptable — bathroom had mold, sheets appeared unwashed, and front desk was rude when we raised concerns." | Negative sentiment, category: cleanliness+service, urgency: true |
| Flagged | "This hotel should not be on the platform. Multiple complaints from our team about hygiene issues." | Negative sentiment, category: cleanliness, urgency: true |

---

## Competitor / Reference Pattern Analysis

| Feature | Navan / TripActions | Courier / Novu (notification infra) | Our Approach |
|---------|---------------------|--------------------------------------|--------------|
| Brand identity | Teal/green palette, modern sans-serif, high density admin tables | N/A (infra product) | Teal #72D3C4, tight typography scale, compact admin |
| Notification preview | Not exposed to admin (automated delivery) | Visual template editor with live data substitution sidebar | Preview-only (no editor); populate from latest real booking |
| Channel selector | N/A | Tab or dropdown per channel | Tab buttons (already implemented); keep as-is |
| Seed/demo data | Platform ships with demo account | N/A | Idempotent seed script; curated fixed dataset |
| Empty states | Illustrated empty states with CTAs | N/A | Icon + message + CTA button; matches Lucide + shadcn style |

---

## Sources

- [Design Guidelines For Better Notifications UX — Smashing Magazine](https://www.smashingmagazine.com/2025/07/design-guidelines-better-notifications-ux/)
- [Top Dashboard Design Trends for SaaS Products in 2025 — UITop](https://uitop.design/blog/design/top-dashboard-design-trends/)
- [Novu — Open-source notifications infrastructure](https://novu.co/)
- [Notification UX: How To Design For A Better Experience — Userpilot](https://userpilot.com/blog/notification-ux/)
- [Best Notification Infrastructure Software 2025 — Courier](https://www.courier.com/blog/best-notification-infrastructure-software-2025/)
- [Slack Block Kit — Official Docs](https://docs.slack.dev/block-kit/)
- [Theming — shadcn/ui](https://ui.shadcn.com/docs/theming)
- [Tailwind v4 — shadcn/ui](https://ui.shadcn.com/docs/tailwind-v4)
- [How to Build a Design Token System with Tailwind CSS — TheFrontKit](https://thefrontkit.com/blogs/tailwind-css-design-tokens-for-saas)
- [WhatsApp Business API Message Templates 2025 — Interakt](https://www.interakt.shop/whatsapp-business-api/whatsapp-message-templates-2025/)
- [Launching a New Brand on the Web: TripActions to Navan](https://navan.com/blog/navan-tech-blog/how-to-launch-a-new-brand-on-the-web-from-tripactions-to-navan)
- [SaaS Brand Identity: 15 Best Examples in 2025 — Arounda](https://arounda.agency/blog/branding-examples)
- [Sentiment Analysis on Hotel Reviews — DataHen](https://www.datahen.com/blog/sentiment-analysis-hotel-reviews/)
- [Master SaaS Demos 2026 — Reprise](https://www.reprise.com/resources/blog/saas-demo-complete-guide)

---
*Feature research for: Ziptrrip Feedback Intelligence System v2*
*Researched: 2026-03-26*
