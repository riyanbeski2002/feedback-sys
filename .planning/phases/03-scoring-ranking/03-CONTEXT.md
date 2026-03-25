# Phase 3: Scoring & Ranking - Context

**Gathered:** Wednesday, 25 March 2026
**Status:** Ready for planning

<domain>
## Phase Boundary

Integrating feedback intelligence into the discovery layer. This includes building the hotel search/listing interface, implementing sophisticated ranking logic based on both quality scores and review volume, and ensuring the UI reflects data changes in real-time.

</domain>

<decisions>
## Implementation Decisions

### Hotel Listing UI
- **Layout**: Grid Cards (large cards with high-impact visibility).
- **Score Display**: Numeric Score (precise 2-decimal numbers, e.g., 4.25).
- **Information Hierarchy**: Prioritize Hotel Name, Score, Location, and Review Count.

### Ranking Logic
- **Primary Sort**: Weighted Reliability Ranking (a calculation that balances high `avg_score` with `total_feedbacks` volume to prevent 1-review bias).
- **Flagged Behavior**: Deprioritize/Hide flagged (hotels < 2.0 are moved to the bottom or filtered from main results to protect travellers).

### Visual Status Indicators
- **Color Mapping**: 4-Tier Colors:
  - Green (> 4.5): Top Rated
  - Slate (3.0 - 4.5): Stable / Reliable
  - Orange (2.0 - 3.0): Needs Review
  - Red (< 2.0): Flagged

### Real-time Connectivity
- **Update Mode**: Full Real-time Sync (scores and rankings update instantly without page refresh).
- **Visual Feedback**: Flash Highlight (updated cards briefly glow to show live activity).

### Claude's Discretion
- **Weighted Ranking Formula**: Claude can decide on a standard reliability formula (e.g., Bayesian average or a simple score + (count * factor) approach).
- **Highlight Duration**: Claude can choose the appropriate glow duration (e.g., 1-2 seconds).

</decisions>

<specifics>
## Specific Ideas

- **Live Ranking Shift**: If a hotel's score changes enough to move its position in the list, the cards should animate their reordering (if possible with Framer Motion or simple CSS).
- **Review Count Emphasis**: Show "(15 reviews)" next to the score to build trust.

</specifics>

<deferred>
## Deferred Ideas

- **Personalized Ranking**: User-preference-based sorting (belongs in v2).
- **Advanced Filtering**: Filtering by specific score sub-categories (e.g., "Cleanliness > 4").

</deferred>

---

*Phase: 03-scoring-ranking*
*Context gathered: Wednesday, 25 March 2026*
