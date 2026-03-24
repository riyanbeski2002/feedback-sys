# Post-Stay Feedback Intelligence System

## What This Is

A feature layer for a corporate travel platform (Ziptrrip) that captures verified hotel stay feedback after checkout and uses that data to improve future hotel visibility, ranking, and decision quality. It creates a closed feedback loop to ensure platform trust and supplier accountability.

## Core Value

Create a reliable, automated feedback intelligence loop that improves hotel recommendation quality based on verified guest experiences.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **Triggering**: Automatically detect completed checkouts and trigger feedback requests.
- [ ] **Multi-channel Notifications**: Design and preview feedback requests for Email, WhatsApp, Slack, and Teams.
- [ ] **Configurable Logic**: Admin control over trigger delays, reminders, frequency, and channel enablement.
- [ ] **Feedback Collection**: Support both detailed forms (primary) and WhatsApp quick scores (fallback).
- [ ] **Weighted Scoring**: Calculate hotel scores prioritizing Cleanliness (30%) and Service (30%).
- [ ] **Real-time Updates**: Immediately reflect feedback in hotel aggregate scores and status buckets.
- [ ] **Ranking Intelligence**: Adjust hotel visibility and search ranking based on weighted quality scores.
- [ ] **Admin Dashboard**: Provide visibility into hotel performance, flagged low-performers, and configuration.
- [ ] **AI Analysis**: Abstracted sentiment and qualitative analysis layer for open text comments.

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
*Last updated: Tuesday, 24 March 2026 after initialization*
