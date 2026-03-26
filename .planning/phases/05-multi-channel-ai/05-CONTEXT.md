# Phase 5: Multi-channel & AI - Context

**Gathered:** Wednesday, 25 March 2026
**Status:** Ready for planning

<domain>
## Phase Boundary
Expanding communication capabilities and qualitative feedback intelligence. This includes a notification preview center for multiple channels (Email, WhatsApp, Slack, Teams) and basic sentiment/category analysis for feedback comments.

</domain>

<decisions>
## Implementation Decisions

### Notification Preview Center (`/notifications`)
- **Multi-channel Display**: Tabs or scrollable section showing Email, WhatsApp (Quick/Detailed), Slack, and Teams mocks.
- **Dynamic Content**: Use sample booking data (e.g., "Grand Royal Bangalore", "Riyan Khan") to populate the previews.
- **Visual Style**: Match the platform's UI (shadcn/ui cards) for the previews.

### AI Intelligence (Sentiment & Category)
- **Sentiment Analysis**: Mocked/Simplified rule-based sentiment (Positive, Neutral, Negative) based on keywords and scores.
- **Issue Categorization**: Tag comments into categories like "Cleanliness", "Service", "Value", "Amenities", "Other".
- **Trigger**: Process analysis during `submitFeedback` action.

### Data Flow
- Update `feedback` table with `sentiment_label`, `sentiment_score`, and `issue_category`.
- Update `submitFeedback` server action to include analysis logic.

</decisions>

<specifics>
## Specific Ideas
- **Glow effect for Sentiment**: Positive (Green), Neutral (Slate), Negative (Red) indicators in the Admin Dashboard feed.
- **Keyword-based Category**: If comment contains "clean", "dirty", "towel" -> category = "Cleanliness".

</specifics>

<deferred>
## Deferred Ideas
- **Actual LLM Integration**: Real OpenAI/Anthropic API calls for deeper sentiment (out of scope for MVP).
- **Proactive Notification Sending**: Actual email/SMS sending logic (out of scope).

</deferred>

---

*Phase: 05-multi-channel-ai*
*Context gathered: Wednesday, 25 March 2026*
