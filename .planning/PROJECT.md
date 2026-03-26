# Post-Stay Feedback Intelligence System

## What This Is

A feature layer for a corporate travel platform (Ziptrrip) that captures verified hotel stay feedback after checkout and uses that data to improve future hotel visibility, ranking, and decision quality. It creates a closed feedback loop to ensure platform trust and supplier accountability.

## Core Value

Create a reliable, automated feedback intelligence loop that improves hotel recommendation quality based on verified guest experiences.

## Current Milestone: v2.0 — Ziptrrip Design Fidelity & Full Functionality

**Goal:** Redesign the app to pixel-match Ziptrrip's visual identity, fix all known bugs, and make every feature fully functional end-to-end.

**Target features:**
- Pencil MCP design mockups for all screens (approved before coding)
- Ziptrrip teal palette (#72D3C4) applied throughout, replacing hardcoded colors
- Hotel/booking seed data visible without manual setup
- Settings page crash fixed (feedback_config singleton enforced)
- Notification previews populated from real feedback data (not static)
- Full E2E flow verified: checkout → feedback → score update → admin → notifications

## Requirements

### Validated

- ✓ **Feedback Loop**: Checkout simulation → feedback form → success page with duplicate prevention — v1.0
- ✓ **Weighted Scoring**: Hotel aggregate scores calculated with configurable weights — v1.0
- ✓ **Real-time Ranking**: Hotels grid updates live via Supabase Realtime after feedback — v1.0
- ✓ **Admin Dashboard**: Platform metrics, flagged hotels table, live activity feed — v1.0
- ✓ **AI Tagging**: Sentiment, category, and urgency classification on feedback text — v1.0
- ✓ **Notification Previews**: Static previews for Email, WhatsApp, Slack, Teams — v1.0

### Active

- [ ] **Design Fidelity**: All screens match Ziptrrip visual identity (teal, typography, layout density)
- [ ] **Seed Data**: Hotels and bookings visible in UI without manual setup steps
- [ ] **Settings Fix**: Settings page loads and saves correctly (no DB coercion error)
- [ ] **Dynamic Notifications**: Previews populated from actual recent feedback data
- [ ] **Full E2E**: Complete flow works reliably from checkout to notifications

### Out of Scope

- **Production Messaging**: Actual delivery via real Email/WhatsApp/Slack/Teams APIs (MVP uses mocks/previews).
- **Authentication**: Full user auth and permissioning system (MVP assumes verified context).
- **Advanced Fraud Models**: Beyond basic verified booking checks.
- **Analytics Warehouse**: Full-scale integration with external BI tools.

## Context

The system addresses the lack of reliable hotel quality data in travel platforms, which often leads to poor recommendations and repeated bookings of low-performing hotels. It focuses on verified bookings to ensure data integrity.

## Constraints

- **Stack**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui.
- **Database**: Supabase PostgreSQL.
- **Hosting**: Vercel.
- **Design**: Must align with Ziptrrip's B2B SaaS dashboard aesthetic (to be refined with screenshots).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router | Modern React patterns, server-side rendering, and easy routing. | — Pending |
| Supabase | Fast PostgreSQL setup with built-in auth/storage possibilities. | — Pending |
| Weighted Scoring | Prioritize baseline quality indicators (Cleanliness, Service). | — Pending |
| Abstracted AI | Allows swapping between different LLMs (Gemini, OpenAI, etc.) later. | — Pending |

---
*Last updated: Thursday, 26 March 2026 after v2.0 milestone start*
