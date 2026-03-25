# Phase 2: Feedback Loop - Context

**Gathered:** Wednesday, 25 March 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

The end-to-end feedback submission path. This includes simulating a hotel checkout from a booking table, triggering the feedback eligibility state, and collecting detailed guest ratings through a dedicated form.

</domain>

<decisions>
## Implementation Decisions

### Checkout Simulation UI
- **Trigger Location**: Inline Table Button (quick action in the booking row).
- **Confirmation**: Dialog Confirmation (blocking dialog to confirm checkout).
- **State Reflection**: Visual status update (status pill changes to 'completed' + eligibility indicator).
- **Access to Form**: Shortcut link ('Rate Now') appears next to the completed status.

### Feedback Form Flow
- **Layout**: Single Page (all questions in a clean, professional list).
- **Comments**: Always Visible (optional text box at the bottom of the form).

### Rating Input Style
- **Input Type**: Star Ratings (1-5 clickable stars, familiar pattern).
- **Iconography**: Icon-only UI (clean, professional stars without persistent text labels).

### Completion State
- **Success Behavior**: Success Page (full-page 'Thank you' screen).
- **Validation Check**: Admin update visible (show 'Last submitted' in admin view for demo).
- **Duplicate Prevention**: Clear error state (explicit warning if already submitted).
- **Redirect Flow**: Auto-redirect (3s delay) to the Hotels list.

### Claude's Discretion
- **Success Page Content**: Claude can choose a supportive message (e.g., "Your feedback helps colleagues make better choices").
- **Table Columns**: Claude can decide on the columns to include for the simulation view (Traveller, Hotel, Dates, Status).

</decisions>

<specifics>
## Specific Ideas

- **Booking Table**: A clean, sortable table to find bookings for simulation.
- **Feedback Form Header**: A summary card showing the hotel name, location, and stay dates for context.

</specifics>

<deferred>
## Deferred Ideas

- **Quick Feedback (WhatsApp)**: Postponed to Phase 5.
- **Background Scheduler**: Not for MVP (manual simulation only).

</deferred>

---

*Phase: 02-feedback-loop*
*Context gathered: Wednesday, 25 March 2026*
