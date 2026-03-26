# Phase 4: Admin & Config - Context

**Gathered:** Wednesday, 25 March 2026
**Status:** Ready for planning

<domain>
## Phase Boundary
Providing tools for management and system configuration. This includes the main Admin Dashboard for operational monitoring and the Settings page for system-wide feedback configuration.

</domain>

<decisions>
## Implementation Decisions

### Admin Dashboard (`/admin`)
- **Summary Metrics**: Show Total Feedbacks, Avg Platform Score, Flagged Count.
- **Flagged Hotels List**: Dedicated section/table for hotels with score < 2.0.
- **Recent Feedbacks**: Activity feed of the latest feedback submissions.

### Settings Page (`/settings`)
- **Scoring Weights**: Form to adjust weights for Cleanliness, Service, Value, Amenities, Intent.
- **Thresholds**: Adjust what counts as "Top Rated" (> 4.5), "Neutral" (3.0), "Flagged" (< 2.0).
- **Communication Rules**: Toggle channels (Email, WhatsApp, Slack, Teams) and adjust trigger delays/reminders.

### Data Flow
- Use `feedback_config` table (singleton row).
- Implement server actions to update config.
- Fetch current config for feedback scoring calculation (optional: for now weights are hardcoded in `scoring.ts`, I might want to move them to use the DB config if possible, or just build the UI to update the DB).

</decisions>

<specifics>
## Specific Ideas
- **Metric Cards**: Large numbers with secondary labels.
- **Flagged Warning**: Red alert banner if new hotels are flagged recently.
- **Weight Validation**: Ensure scoring weights always sum to 1.0 (100%).

</specifics>

<deferred>
## Deferred Ideas
- **History of Config Changes**: Audit log of who changed weights.
- **A/B Testing Weights**: Running two different scoring models simultaneously.

</deferred>

---

*Phase: 04-admin-config*
*Context gathered: Wednesday, 25 March 2026*
