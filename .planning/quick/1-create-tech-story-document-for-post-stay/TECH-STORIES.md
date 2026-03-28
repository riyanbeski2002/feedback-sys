# Tech Stories: Post-Stay Feedback Intelligence System

**Product:** Corporate Travel Platform — Hotel Feedback Module
**Version:** 1.0 MVP
**Author:** Senior BA / Program Manager
**Date:** 2026-03-28
**Total Stories:** 13

---

## Tech Story 1: Booking Completion Detection

### 1. Objective
Detect when a hotel booking checkout date has passed and mark that booking as eligible for feedback collection. This is the entry point for the entire feedback intelligence loop.

### 2. Scope
**Included:**
- A scheduled job that runs daily and queries for bookings whose checkout date is in the past
- Marking eligible bookings with a status flag (`feedback_eligible`)
- Preventing duplicate eligibility marking for the same booking

**Excluded:**
- Sending notifications (handled in TS-3)
- Evaluating whether feedback has already been submitted
- Processing cancellations or no-show bookings

### 3. Functional Requirements
1. A scheduled job executes once every 24 hours (e.g., 01:00 UTC)
2. The job queries all confirmed bookings where `checkout_date < NOW()` and `feedback_eligible = false`
3. For each matched booking, the job sets `feedback_eligible = true` and records `eligible_at` timestamp
4. The job is idempotent: re-running it on already-processed bookings produces no side effects
5. Job execution is logged with booking count processed and any errors encountered

### 4. Non-Functional Requirements
- Job must complete within 60 seconds for up to 10,000 eligible bookings
- Database query uses an index on `checkout_date` and `feedback_eligible` to avoid full table scans
- Failures are logged to the application error log and do not silently swallow exceptions
- Job supports manual triggering via an admin CLI command for backfill scenarios

### 5. Inputs & Outputs
**Inputs:**
- Bookings table rows with `checkout_date`, `status = 'confirmed'`, `feedback_eligible = false`
- System clock (UTC)

**Outputs:**
- Updated bookings rows: `feedback_eligible = true`, `eligible_at = NOW()`
- Job execution log entry: timestamp, rows processed, errors

### 6. Dependencies
- Bookings database table (pre-existing)
- Job scheduler infrastructure (cron or task queue)

### 7. Acceptance Criteria
- [ ] Running the job sets `feedback_eligible = true` on all bookings with `checkout_date < NOW()`
- [ ] Running the job a second time does not modify already-eligible bookings
- [ ] Bookings with `checkout_date >= NOW()` are not modified
- [ ] Job completes within 60 seconds on a dataset of 10,000 eligible rows
- [ ] A log entry is written after each job run with a count of rows processed
- [ ] Manual trigger via CLI executes the same logic as the scheduled run

### 8. Edge Cases
- Bookings with `checkout_date` equal to today's date at midnight UTC: include only if `checkout_date` is strictly less than the current timestamp
- Cancelled or no-show bookings with past checkout dates: exclude by filtering on `status = 'confirmed'` only
- Database connectivity failure during job run: log error, exit without partial commit
- Zero eligible bookings: job completes successfully, logs zero rows processed

### 9. Estimated Effort
2 days (breakdown: 2 hours schema review + 8 hours implementation + 6 hours testing)

---

## Tech Story 2: Feedback Trigger System

### 1. Objective
Enqueue a feedback request task for each newly eligible booking at the configured delay after checkout. This story converts eligible bookings into actionable feedback request events.

### 2. Scope
**Included:**
- Reading the configured trigger delay (hours after checkout) from the configuration store
- Enqueuing a feedback request task for each eligible booking not yet triggered
- Tracking trigger state per booking to prevent duplicate triggers
- Support for configurable reminder count and interval

**Excluded:**
- Sending the actual notification (TS-3)
- Reading or writing the feedback form (TS-4, TS-5)
- Configuration management UI (TS-12)

### 3. Functional Requirements
1. After TS-1 marks bookings eligible, a trigger processor reads all bookings where `feedback_eligible = true` and `trigger_sent = false`
2. For each booking, compute the trigger fire time: `eligible_at + trigger_delay_hours`
3. If the fire time is in the past or present, enqueue a `SEND_FEEDBACK_REQUEST` task immediately
4. If the fire time is in the future, schedule the task for that time
5. After enqueuing, mark the booking `trigger_sent = true` and record `triggered_at`
6. For reminders: enqueue additional `SEND_FEEDBACK_REMINDER` tasks at configured intervals if `reminder_count > 0`

### 4. Non-Functional Requirements
- Task queue must support at-least-once delivery with deduplication by booking ID
- Trigger processor is idempotent: re-running on already-triggered bookings is a no-op
- Maximum latency between eligible detection and task enqueue: 5 minutes
- All enqueue operations are logged with booking ID and scheduled fire time

### 5. Inputs & Outputs
**Inputs:**
- Bookings with `feedback_eligible = true` and `trigger_sent = false`
- Configuration: `trigger_delay_hours`, `reminder_count`, `reminder_interval_hours`

**Outputs:**
- Enqueued tasks: `SEND_FEEDBACK_REQUEST` and zero or more `SEND_FEEDBACK_REMINDER` tasks
- Updated bookings: `trigger_sent = true`, `triggered_at = NOW()`

### 6. Dependencies
- TS-1: Booking Completion Detection (provides `feedback_eligible` flag)
- TS-12: Configuration System (provides trigger delay and reminder settings)
- Task queue infrastructure

### 7. Acceptance Criteria
- [ ] Each eligible booking generates exactly one `SEND_FEEDBACK_REQUEST` task
- [ ] Tasks are scheduled at `eligible_at + trigger_delay_hours`, not before
- [ ] `trigger_sent = true` is set only after successful enqueue
- [ ] Re-running the processor on already-triggered bookings produces no duplicate tasks
- [ ] Reminder tasks are enqueued per `reminder_count` and `reminder_interval_hours` values
- [ ] All enqueued tasks are logged with booking ID and fire time

### 8. Edge Cases
- Configuration not yet initialized: use safe defaults (24-hour delay, 1 reminder, 48-hour interval)
- Task queue unavailable: log error, leave `trigger_sent = false`, retry on next processor run
- Booking feedback already submitted before trigger fires: `SEND_FEEDBACK_REQUEST` task handler checks submission status and no-ops if already submitted
- `trigger_delay_hours = 0`: fire immediately upon eligibility

### 9. Estimated Effort
3 days (breakdown: 4 hours design + 12 hours implementation + 8 hours testing)

---

## Tech Story 3: Notification System

### 1. Objective
Deliver feedback request and reminder messages to guests across Email, WhatsApp, Slack, and Teams channels. This story handles all outbound communication for the feedback collection workflow.

### 2. Scope
**Included:**
- Channel adapters for Email, WhatsApp, Slack, and Microsoft Teams
- Message templating with booking reference, guest name, and feedback form link
- Delivery status tracking per notification attempt
- Retry logic for transient channel failures

**Excluded:**
- Deciding when to send notifications (TS-2)
- Generating the feedback form link (TS-4)
- Channel configuration UI (TS-12)

### 3. Functional Requirements
1. A notification worker consumes `SEND_FEEDBACK_REQUEST` and `SEND_FEEDBACK_REMINDER` tasks from the queue
2. For each task, the worker resolves the guest's preferred notification channels from the booking profile
3. The worker renders a message template for each channel using: guest name, hotel name, booking reference, feedback form URL
4. The worker dispatches the message via each channel adapter
5. Each dispatch attempt is recorded in a `notifications` log table with: booking ID, channel, status (`sent`/`failed`), timestamp
6. On transient failure (network timeout, rate limit), the worker retries up to 3 times with exponential backoff before marking the attempt as `failed`
7. A notification is never sent to a guest who has already submitted feedback for that booking

### 4. Non-Functional Requirements
- Email delivery via SMTP or transactional email provider (e.g., SendGrid, Mailgun)
- WhatsApp delivery via WhatsApp Business API
- Slack delivery via Slack Incoming Webhooks or Bot token
- Teams delivery via Teams Incoming Webhook connector
- Each channel dispatch must complete or time out within 10 seconds
- Notification log is retained for 90 days

### 5. Inputs & Outputs
**Inputs:**
- Task from queue: booking ID, task type (`request` or `reminder`), sequence number
- Guest profile: name, email, WhatsApp number, Slack webhook, Teams webhook
- Configuration: enabled channels, message templates

**Outputs:**
- Outbound messages dispatched to each configured channel
- `notifications` log entries: booking ID, channel, status, sent_at

### 6. Dependencies
- TS-2: Feedback Trigger System (produces tasks consumed here)
- TS-4: Feedback Form UI (provides the feedback URL embedded in messages)
- External channel APIs: email provider, WhatsApp Business API, Slack API, Teams Webhook

### 7. Acceptance Criteria
- [ ] A feedback request message is delivered to each enabled channel for the guest
- [ ] Message content includes guest name, hotel name, booking reference, and feedback form URL
- [ ] Delivery status (`sent`/`failed`) is recorded per channel per attempt
- [ ] A guest who has already submitted feedback does not receive additional notifications
- [ ] Transient failures trigger retry up to 3 times before final `failed` status is recorded
- [ ] Disabling a channel in configuration stops future dispatches to that channel

### 8. Edge Cases
- Guest has no channel contact info (no email, no WhatsApp): log a `skipped` record, do not error
- Channel API credentials expired: mark all dispatches via that channel as `failed`, raise an alert
- Duplicate task delivery (at-least-once queue): idempotency key on (booking_id, task_type, sequence) prevents duplicate sends
- Message template render failure (missing variable): fall back to a generic template, log warning

### 9. Estimated Effort
4 days (breakdown: 4 hours design + 18 hours implementation + 10 hours testing)

---

## Tech Story 4: Feedback Form UI

### 1. Objective
Provide a guest-facing web form where travelers can rate their hotel stay across five dimensions and optionally add free-text comments. The form is the primary data collection interface for the feedback intelligence system.

### 2. Scope
**Included:**
- Publicly accessible form URL parameterized by a signed booking token
- Five rating dimensions rendered as sliders: Cleanliness, Location, Service, Amenities, Value
- Optional free-text comment field (max 1000 characters)
- Token validation on load (expired, already submitted, invalid)
- Success screen displayed after submission
- Mobile-responsive layout (minimum 375px viewport support)

**Excluded:**
- Authentication or login requirement for guests
- Multi-language support (v1.0 English only)
- File attachment or photo upload
- Submission processing and storage (TS-5)

### 3. Functional Requirements
1. The form is accessible at `/feedback?token=<signed-token>`
2. On load, the form validates the token: expired tokens show an "expired" state, already-submitted tokens show a "thank you" state, invalid tokens show an "invalid" state
3. Five rating sliders are displayed, each with a 1–10 scale and labeled dimension name
4. All five dimensions are required before submission is enabled
5. The optional comment field accepts up to 1000 characters and displays a live character count
6. Submitting the form calls the Feedback Submission API (TS-5) and displays the success screen on 200 response
7. On API error, a visible error message is shown and the form remains interactive
8. Form is responsive: desktop layout (≥768px) and mobile layout (<768px)

### 4. Non-Functional Requirements
- Initial page load under 2 seconds on a 4G connection
- Slider controls meet WCAG 2.1 AA touch target requirements (≥44px)
- Form state is preserved on API error (ratings and comment not cleared)
- No PII other than the signed token is transmitted in the URL

### 5. Inputs & Outputs
**Inputs:**
- Signed booking token (URL parameter)
- Guest interactions: slider values, comment text, submit action

**Outputs:**
- Rendered form or error/expired/already-submitted state screen
- POST request to Feedback Submission API on submit
- Success screen on confirmed submission

### 6. Dependencies
- TS-5: Feedback Submission API (endpoint called on submit)
- TS-2: Feedback Trigger System (produces the signed token embedded in the notification link)

### 7. Acceptance Criteria
- [ ] Form loads and validates the token; expired/invalid/already-submitted states render correctly
- [ ] All five rating sliders are present, labeled, and accept values 1–10
- [ ] Submit button is disabled until all five dimensions have a value
- [ ] Comment field enforces 1000-character maximum with visible character count
- [ ] Successful submission displays the success screen
- [ ] API error displays an inline error message without clearing form state
- [ ] Form is usable and visually correct at 375px and 1280px viewport widths

### 8. Edge Cases
- Token missing from URL: render "invalid link" state, no API call made
- Token valid but booking hotel no longer in system: render a generic "thank you for your stay" form without hotel name
- Slow API response (>5 seconds): display a loading indicator on the submit button
- User submits twice (double-click): disable button immediately on first click, ignore second click

### 9. Estimated Effort
3 days (breakdown: 4 hours design alignment + 12 hours implementation + 8 hours testing)

---

## Tech Story 5: Feedback Submission API

### 1. Objective
Receive, validate, and persist guest feedback submissions. This API is the single write path for all guest feedback data and must ensure data integrity and idempotency.

### 2. Scope
**Included:**
- `POST /api/feedback` endpoint accepting rating values and optional comment
- Token validation (signature, expiry, already-used check)
- Persistence of the submission record to the database
- Idempotency: duplicate submissions for the same booking are rejected with a clear response

**Excluded:**
- Score computation (TS-7)
- Ranking updates (TS-8)
- Notification logic (TS-3)

### 3. Functional Requirements
1. `POST /api/feedback` accepts: `token`, `cleanliness`, `location`, `service`, `amenities`, `value` (all integer 1–10), and optional `comment` (string ≤1000 chars)
2. The endpoint validates the token signature and rejects expired or tampered tokens with HTTP 401
3. If a submission already exists for the booking in the token, return HTTP 409 with `{"error": "already_submitted"}`
4. All five rating fields are required; missing or out-of-range values return HTTP 422 with field-level error details
5. On valid submission: persist the record, mark the booking as `feedback_submitted = true`, and return HTTP 201 with the submission ID
6. After successful persistence, enqueue a `COMPUTE_SCORE` task for the hotel (TS-7)

### 4. Non-Functional Requirements
- Endpoint responds within 500ms at p95 under normal load
- All writes are wrapped in a database transaction; partial writes are not possible
- Rate limit: maximum 5 submission attempts per token per hour
- Input sanitization: comment field is stripped of HTML/script content before storage

### 5. Inputs & Outputs
**Inputs:**
- HTTP POST body: `token`, five integer ratings, optional `comment`

**Outputs:**
- HTTP 201: `{"submission_id": "..."}` on success
- HTTP 401: invalid or expired token
- HTTP 409: already submitted
- HTTP 422: validation errors with field details
- Persisted `feedback_submissions` row
- Enqueued `COMPUTE_SCORE` task

### 6. Dependencies
- TS-4: Feedback Form UI (calls this endpoint)
- TS-6: Data Storage (defines the schema this endpoint writes to)
- TS-7: Scoring Engine (consumes the `COMPUTE_SCORE` task)

### 7. Acceptance Criteria
- [ ] Valid submission returns HTTP 201 and persists all five ratings and optional comment
- [ ] Duplicate submission returns HTTP 409 with `already_submitted` error
- [ ] Expired token returns HTTP 401
- [ ] Missing or out-of-range rating field returns HTTP 422 with field name in error body
- [ ] Comment exceeding 1000 characters returns HTTP 422
- [ ] A `COMPUTE_SCORE` task is enqueued after every successful submission
- [ ] Booking is marked `feedback_submitted = true` after successful submission

### 8. Edge Cases
- Race condition (two simultaneous submissions for same booking): database unique constraint on `booking_id` ensures only one succeeds; second returns HTTP 409
- `COMPUTE_SCORE` enqueue failure after successful DB write: log the failure; a reconciliation job retries enqueuing for submissions without a score
- Token valid but hotel has been deleted: persist submission with `hotel_id = NULL`, log warning
- Comment with only whitespace: treat as no comment (set `comment = NULL`)

### 9. Estimated Effort
3 days (breakdown: 2 hours design + 14 hours implementation + 8 hours testing)

---

## Tech Story 6: Data Storage (Database Schema)

### 1. Objective
Define and migrate the complete database schema that underpins the Post-Stay Feedback Intelligence System. This story is the foundation all other stories read from and write to.

### 2. Scope
**Included:**
- Schema definition for all new tables: `feedback_submissions`, `hotel_scores`, `notifications`, `feedback_triggers`, `flagged_hotels`, `feedback_config`
- Index definitions for all query-critical columns
- Migration scripts (up and down)
- Seed data for feedback_config defaults

**Excluded:**
- Application logic that uses these tables (covered in respective stories)
- Changes to the pre-existing `bookings` or `hotels` tables beyond adding columns

### 3. Functional Requirements
1. `feedback_submissions`: columns — `id`, `booking_id` (FK, UNIQUE), `hotel_id` (FK), `cleanliness`, `location`, `service`, `amenities`, `value` (integers 1–10), `comment` (TEXT nullable), `submitted_at`
2. `hotel_scores`: columns — `id`, `hotel_id` (FK, UNIQUE), `score` (DECIMAL), `submission_count` (INTEGER), `last_computed_at`
3. `notifications`: columns — `id`, `booking_id` (FK), `channel` (ENUM: email/whatsapp/slack/teams), `task_type` (ENUM: request/reminder), `status` (ENUM: sent/failed/skipped), `sent_at`
4. `feedback_triggers`: columns — `id`, `booking_id` (FK, UNIQUE), `trigger_sent` (BOOLEAN), `triggered_at`, `feedback_eligible` (BOOLEAN), `eligible_at`
5. `flagged_hotels`: columns — `id`, `hotel_id` (FK, UNIQUE), `flag_type` (ENUM: flagged/blacklisted), `reason` (TEXT), `flagged_by` (user ID), `flagged_at`, `resolved_at` (nullable)
6. `feedback_config`: columns — `id`, `singleton` (BOOLEAN, UNIQUE TRUE), `trigger_delay_hours`, `reminder_count`, `reminder_interval_hours`, `active` (BOOLEAN), `updated_at`
7. Existing `bookings` table gains columns: `feedback_eligible` (BOOLEAN DEFAULT FALSE), `feedback_submitted` (BOOLEAN DEFAULT FALSE)
8. All foreign keys have appropriate ON DELETE behavior defined
9. Indexes on: `bookings(checkout_date, feedback_eligible)`, `feedback_submissions(booking_id)`, `hotel_scores(hotel_id)`, `notifications(booking_id, channel)`

### 4. Non-Functional Requirements
- Migrations are reversible (down migration provided for each up migration)
- Schema uses explicit column types and constraints (no unconstrained TEXT for enum fields)
- All tables include `created_at` with a server-side default
- Migration scripts are idempotent (`CREATE TABLE IF NOT EXISTS` pattern or equivalent)

### 5. Inputs & Outputs
**Inputs:**
- Migration runner command
- Seed script for `feedback_config` defaults

**Outputs:**
- Database tables created with all columns, constraints, and indexes
- Default `feedback_config` row inserted

### 6. Dependencies
- Pre-existing `bookings` table
- Pre-existing `hotels` table
- Database migration tooling (e.g., Flyway, Liquibase, or ORM migration runner)

### 7. Acceptance Criteria
- [ ] All 6 new tables are created by running the up migration
- [ ] `bookings` table has `feedback_eligible` and `feedback_submitted` columns after migration
- [ ] `feedback_config` table contains exactly one default row after seed
- [ ] `feedback_submissions.booking_id` has a UNIQUE constraint
- [ ] Down migration drops all tables added by the up migration without errors
- [ ] All defined indexes exist after migration

### 8. Edge Cases
- Running migration on a database that already has some tables (partial migration): migration runner tracks applied migrations, skips already-applied steps
- `hotels` table has hotel IDs referenced by existing data: foreign key constraints are added after verifying referential integrity
- Seed script run multiple times: `feedback_config` upsert on `singleton = TRUE` prevents duplicate rows

### 9. Estimated Effort
2 days (breakdown: 4 hours schema design + 6 hours migration scripts + 6 hours testing and seed)

---

## Tech Story 7: Scoring Engine

### 1. Objective
Compute a weighted aggregate hotel score from all feedback submissions for a given hotel. The engine produces a single numeric score that drives hotel ranking and is recalculated on every new submission.

### 2. Scope
**Included:**
- A score computation worker that consumes `COMPUTE_SCORE` tasks
- Weighted average calculation across five rating dimensions (Cleanliness, Location, Service, Amenities, Value)
- Configurable per-dimension weights sourced from the configuration store
- Upsert of the computed score into `hotel_scores`

**Excluded:**
- Ranking order updates (TS-8)
- Sentiment analysis (TS-13)
- Configuration UI for weights (TS-12)

### 3. Functional Requirements
1. The worker consumes `COMPUTE_SCORE` tasks containing a `hotel_id`
2. The worker reads all `feedback_submissions` rows for that `hotel_id`
3. For each submission, compute a weighted average: `score = (w1*cleanliness + w2*location + w3*service + w4*amenities + w5*value) / (w1+w2+w3+w4+w5)`
4. Compute the hotel score as the mean of all individual submission scores
5. Weights are read from the configuration store; if unset, default to equal weights (1.0 each)
6. Upsert the result into `hotel_scores` with `score`, `submission_count`, and `last_computed_at`
7. The computation is deterministic: given the same inputs and weights, the output is always identical

### 4. Non-Functional Requirements
- Score computation for a hotel with up to 10,000 submissions must complete within 5 seconds
- Floating point precision: store score as DECIMAL(5,2)
- Worker is idempotent: reprocessing the same `COMPUTE_SCORE` task produces the same `hotel_scores` row
- Weights are validated: must be non-negative; if all weights are zero, fall back to equal weights

### 5. Inputs & Outputs
**Inputs:**
- `COMPUTE_SCORE` task: `hotel_id`
- `feedback_submissions` rows for the hotel
- Configuration: dimension weights (five decimal values)

**Outputs:**
- Upserted `hotel_scores` row: `hotel_id`, `score`, `submission_count`, `last_computed_at`

### 6. Dependencies
- TS-5: Feedback Submission API (produces `COMPUTE_SCORE` tasks and writes submission rows)
- TS-6: Data Storage (defines `feedback_submissions` and `hotel_scores` tables)
- TS-12: Configuration System (provides dimension weights)

### 7. Acceptance Criteria
- [ ] Score is computed as a weighted average of all submissions for the hotel
- [ ] Using equal weights produces a simple arithmetic mean across all dimensions and submissions
- [ ] `hotel_scores` row is upserted (created on first computation, updated on subsequent)
- [ ] `submission_count` accurately reflects the number of submissions included in the computation
- [ ] Changing weights and reprocessing produces an updated score reflecting new weights
- [ ] A hotel with zero submissions does not produce a `hotel_scores` row

### 8. Edge Cases
- Zero submissions for hotel: worker logs and no-ops, does not insert a row with null score
- All weight values set to zero: fall back to equal weights (1.0 each) and log a warning
- New submission arrives while computation is running: at-least-once queue ensures another `COMPUTE_SCORE` task will be enqueued for the next submission
- Integer overflow on large submission sets: use double-precision arithmetic during computation before rounding to DECIMAL(5,2)

### 9. Estimated Effort
3 days (breakdown: 4 hours design + 12 hours implementation + 8 hours testing)

---

## Tech Story 8: Ranking Update Logic

### 1. Objective
Reorder the hotel ranking list after each score computation, ensuring the hotels page always reflects the latest quality ordering. This story converts raw scores into a ranked sequence.

### 2. Scope
**Included:**
- A rank updater that runs after each `hotel_scores` upsert
- Assigning a rank integer to each hotel based on descending score
- Writing the rank to a `hotel_rankings` view or column
- Handling ties (hotels with identical scores share the same rank)

**Excluded:**
- Score computation itself (TS-7)
- Displaying rankings on the listing page (TS-9)
- Manual overrides (TS-10)

### 3. Functional Requirements
1. After each `hotel_scores` upsert, a `RERANK_HOTELS` task is enqueued
2. The ranker reads all rows from `hotel_scores` ordered by `score DESC`
3. Each hotel is assigned a `rank` integer starting at 1; hotels with equal scores receive the same rank and the next rank increments accordingly (dense or standard ranking — standard by default)
4. Hotels without a score entry are ranked last (rank = total_hotels + 1 group)
5. The rank is written to a `hotel_rankings` table with columns: `hotel_id`, `rank`, `score`, `ranked_at`
6. The full ranking list is replaced atomically (delete + insert in a transaction or an upsert keyed on `hotel_id`)

### 4. Non-Functional Requirements
- Ranking update for up to 5,000 hotels must complete within 3 seconds
- The ranking table is updated atomically: no partial state visible to readers during update
- `ranked_at` is set to the current UTC timestamp on each update
- Rank update is triggered only after a confirmed `hotel_scores` upsert, not on failed computations

### 5. Inputs & Outputs
**Inputs:**
- `RERANK_HOTELS` task (triggered by TS-7)
- All `hotel_scores` rows

**Outputs:**
- Fully replaced `hotel_rankings` table rows with `hotel_id`, `rank`, `score`, `ranked_at`

### 6. Dependencies
- TS-7: Scoring Engine (triggers ranking update and provides updated `hotel_scores`)
- TS-6: Data Storage (defines `hotel_rankings` table — add to schema in TS-6 migration)

### 7. Acceptance Criteria
- [ ] After a score update, the `hotel_rankings` table reflects current descending score order
- [ ] Hotels with equal scores receive the same rank
- [ ] Hotels without a score entry appear at the bottom of the ranking
- [ ] The ranking table is fully replaced per update (no stale rows from deleted hotels)
- [ ] `ranked_at` is updated on every ranking computation

### 8. Edge Cases
- Only one hotel in the system: assigned rank 1, no errors
- All hotels have the same score: all assigned rank 1
- Hotel deleted from system but still has a `hotel_scores` row: skip deleted hotels by joining against the active `hotels` table
- Score computation and ranking run concurrently for different hotels: ranking reads a consistent snapshot; stale reads are acceptable as the next `RERANK_HOTELS` task will correct them

### 9. Estimated Effort
2 days (breakdown: 2 hours design + 8 hours implementation + 6 hours testing)

---

## Tech Story 9: Hotel Listing Integration

### 1. Objective
Surface hotel rankings and scores on the hotel listing page so corporate travelers can see quality-ordered results based on verified post-stay feedback. This story connects the backend intelligence to the end-user interface.

### 2. Scope
**Included:**
- Reading rank and score from `hotel_rankings` and displaying them on each hotel card
- Sorting the hotel listing by rank by default
- Displaying a score badge (numeric score + star or tier label) on each card
- Status badges for flagged or blacklisted hotels (TS-11)

**Excluded:**
- Filtering or searching hotels (pre-existing feature)
- Score computation and ranking logic (TS-7, TS-8)
- Admin controls (TS-10)

### 3. Functional Requirements
1. The hotel listing page query joins `hotels` with `hotel_rankings` to retrieve `rank` and `score` per hotel
2. Hotels are sorted by `rank ASC` by default; hotels without a rank appear at the end
3. Each hotel card displays the numeric score (e.g., "8.4 / 10") and submission count (e.g., "42 reviews")
4. A tier badge is shown based on score thresholds: Top Rated (≥8.0), Reliable (6.0–7.9), Needs Review (4.0–5.9), no badge below 4.0 or with fewer than 3 submissions
5. Flagged or blacklisted hotels (TS-11) display a visible status badge on the card
6. Hotels with no score data display "No reviews yet" in place of the score badge

### 4. Non-Functional Requirements
- Hotel listing page renders in under 1.5 seconds for up to 200 hotels
- Join query uses indexed columns (`hotel_id` in `hotel_rankings`)
- SSR cache is invalidated when rankings are updated (TS-8 triggers revalidation)
- Score and rank data shown are never stale by more than the ranking update cycle (24 hours max)

### 5. Inputs & Outputs
**Inputs:**
- `hotels` table rows
- `hotel_rankings` rows: `hotel_id`, `rank`, `score`
- `flagged_hotels` rows for badge display

**Outputs:**
- Ranked hotel listing page with score badges, tier labels, and flag indicators

### 6. Dependencies
- TS-8: Ranking Update Logic (provides `hotel_rankings` data)
- TS-11: Flagging and Blacklisting Logic (provides flag status for badge display)
- TS-6: Data Storage (defines `hotel_rankings` table)

### 7. Acceptance Criteria
- [ ] Hotel cards are displayed in rank order (rank 1 first)
- [ ] Each card shows score, submission count, and tier badge for hotels with ≥3 submissions
- [ ] Hotels with no score show "No reviews yet"
- [ ] Flagged and blacklisted hotels show the correct status badge
- [ ] Page renders correctly when all hotels have no score (all "No reviews yet")
- [ ] Page load time is under 1.5 seconds for 200 hotels

### 8. Edge Cases
- No hotels in system: render empty state with "No hotels available" message
- All hotels have zero submissions: listing shows hotels in original order with "No reviews yet" on all cards
- Hotel ranked 1 becomes blacklisted (TS-11): blacklisted badge is shown; hotel remains in list unless admin removes it
- `hotel_rankings` table is empty (rankings not yet computed): fall back to alphabetical order

### 9. Estimated Effort
3 days (breakdown: 2 hours design alignment + 12 hours implementation + 10 hours testing)

---

## Tech Story 10: Admin Dashboard

### 1. Objective
Provide an authenticated admin interface for oversight of the feedback system, displaying submission volume, average scores, flagged hotels, and enabling manual score overrides. This story gives operations teams full visibility and control.

### 2. Scope
**Included:**
- Protected admin route with role-based access control
- Summary metrics panel: total submissions, average system-wide score, count of flagged hotels
- Tabular view of hotels with their score, submission count, rank, and flag status
- Manual score override: admin can set a hotel's score directly, bypassing the computed value
- Override audit log: all manual overrides are recorded with admin user ID and timestamp

**Excluded:**
- Feedback configuration controls (TS-12)
- Flagging/blacklisting actions (TS-11)
- Individual submission detail view (v1.0 stretch)

### 3. Functional Requirements
1. Admin dashboard is accessible only to users with the `admin` role; unauthenticated or unauthorized access returns HTTP 403
2. Summary panel displays: total `feedback_submissions` count, average score across all `hotel_scores` rows, count of `flagged_hotels` with `flag_type = 'flagged'` or `'blacklisted'`
3. Hotel table columns: Hotel Name, Rank, Score, Submission Count, Flag Status, Actions
4. Hotel table supports sorting by Rank, Score, and Submission Count
5. Admin can enter a manual score (decimal 1.0–10.0) for any hotel; on save, `hotel_scores.score` is updated and `hotel_scores.override = true` is set
6. Each override is written to an `admin_overrides` log with: `hotel_id`, `previous_score`, `new_score`, `admin_user_id`, `overridden_at`
7. Overridden hotels display a visual indicator ("Manual Override") in the hotel table

### 4. Non-Functional Requirements
- Dashboard loads summary metrics within 2 seconds
- Hotel table is paginated at 50 rows per page for performance
- Admin actions (overrides) are logged for audit; logs are retained for 1 year
- Role check is enforced server-side; client-side hiding is supplementary only

### 5. Inputs & Outputs
**Inputs:**
- Admin user session with `admin` role claim
- Admin override inputs: hotel ID, new score value

**Outputs:**
- Rendered dashboard with summary metrics and hotel table
- Updated `hotel_scores` row on manual override
- `admin_overrides` audit log entry

### 6. Dependencies
- TS-6: Data Storage (defines `hotel_scores`, `flagged_hotels`, `feedback_submissions` tables; add `admin_overrides` table to migration)
- TS-8: Ranking Update Logic (hotel rank displayed in table)
- TS-11: Flagging and Blacklisting Logic (flag status displayed)
- Auth system (role-based access control)

### 7. Acceptance Criteria
- [ ] Unauthenticated request to admin dashboard returns HTTP 403
- [ ] Summary panel shows correct total submissions, average score, and flagged hotel count
- [ ] Hotel table displays all hotels with rank, score, submission count, and flag status
- [ ] Hotel table supports sorting by Rank, Score, and Submission Count
- [ ] Manual score override updates `hotel_scores.score` and sets `override = true`
- [ ] Each override is logged in `admin_overrides` with hotel ID, previous score, new score, admin ID, and timestamp
- [ ] Overridden hotels display "Manual Override" indicator in the table

### 8. Edge Cases
- Admin sets override score identical to computed score: still log the override, set `override = true`
- Admin with expired session submits override: return HTTP 401, no data mutation
- Hotel is deleted between page load and override submission: return 404, display inline error
- Dashboard accessed with zero submissions in system: summary panel shows zeros, hotel table shows all hotels with "No reviews yet"

### 9. Estimated Effort
4 days (breakdown: 4 hours design + 18 hours implementation + 10 hours testing)

---

## Tech Story 11: Flagging and Blacklisting Logic

### 1. Objective
Allow administrators to flag hotels of concern or blacklist those that consistently underperform, surfacing this status on the hotel listing and restricting blacklisted hotels from appearing in booking recommendations.

### 2. Scope
**Included:**
- API endpoints for flagging, blacklisting, and resolving hotel flags
- Storage of flag state in `flagged_hotels` table
- Propagating flag status to hotel listing display (TS-9 reads this)
- Audit trail of all flag actions

**Excluded:**
- Automated flagging based on score thresholds (v1.0 manual-only)
- Removing hotels from the platform entirely (separate hotel management feature)
- Admin UI for flagging (included as part of TS-10 Admin Dashboard actions)

### 3. Functional Requirements
1. `POST /api/admin/hotels/:id/flag` accepts `flag_type` (`flagged` or `blacklisted`) and `reason` (string, required); creates or updates a `flagged_hotels` row
2. `DELETE /api/admin/hotels/:id/flag` resolves a flag by setting `resolved_at = NOW()` on the active flag row
3. Only one active flag (unresolved) per hotel is allowed at a time
4. All flag and resolve actions are recorded with `flagged_by` (admin user ID) and timestamp
5. Blacklisted hotels are excluded from booking recommendation queries (a query filter on `hotel_id NOT IN (SELECT hotel_id FROM flagged_hotels WHERE flag_type = 'blacklisted' AND resolved_at IS NULL)`)
6. Flagged (non-blacklisted) hotels remain visible in listings but display a "Flagged" badge

### 4. Non-Functional Requirements
- Flag and resolve API calls respond within 300ms
- Flag status change is immediately visible on next hotel listing page load (no cache delay >1 minute)
- All admin actions require `admin` role; unauthorized requests return HTTP 403
- Flag reason is stored as-is; max 500 characters

### 5. Inputs & Outputs
**Inputs:**
- `POST /api/admin/hotels/:id/flag`: `flag_type`, `reason`, admin session
- `DELETE /api/admin/hotels/:id/flag`: admin session

**Outputs:**
- Created or updated `flagged_hotels` row
- HTTP 200/201 on success, HTTP 409 if hotel already has an active flag of the same type
- Resolved flag row (`resolved_at` set) on DELETE

### 6. Dependencies
- TS-6: Data Storage (defines `flagged_hotels` table)
- TS-9: Hotel Listing Integration (reads flag status for badge display)
- TS-10: Admin Dashboard (surfaces flag status; flag action may be triggered from dashboard UI)
- Auth system (admin role check)

### 7. Acceptance Criteria
- [ ] Flagging a hotel creates a `flagged_hotels` row with the correct `flag_type`, `reason`, and `flagged_by`
- [ ] Resolving a flag sets `resolved_at` on the active row; the hotel no longer displays a flag badge
- [ ] Attempting to flag an already-flagged hotel returns HTTP 409
- [ ] Blacklisted hotels are absent from booking recommendation query results
- [ ] Flagged (non-blacklisted) hotels remain in listing but show "Flagged" badge
- [ ] All flag and resolve actions are logged with admin user ID and timestamp

### 8. Edge Cases
- Admin flags a hotel that has no score data yet: permitted — flag is stored regardless of scoring state
- Hotel is flagged and then a new submission arrives: score is still computed normally; flag status is independent of scoring
- Resolving a flag that does not exist: return HTTP 404
- Concurrent flag requests for the same hotel: database UNIQUE constraint on active flags (`hotel_id WHERE resolved_at IS NULL`) prevents duplicate active flags

### 9. Estimated Effort
2 days (breakdown: 2 hours design + 8 hours implementation + 6 hours testing)

---

## Tech Story 12: Configuration System

### 1. Objective
Provide a persistent, admin-editable configuration store for the feedback system's operational parameters, including trigger timing, reminder settings, scoring weights, and active/inactive toggle.

### 2. Scope
**Included:**
- Admin settings UI panel for all configurable parameters
- `GET /api/admin/config` and `PUT /api/admin/config` endpoints
- Singleton configuration record in `feedback_config` table
- Validation of all configuration values before persistence
- Active/inactive toggle that halts feedback collection when disabled

**Excluded:**
- Per-hotel configuration (system-wide settings only in v1.0)
- Configuration history/versioning (single current state only)
- Notification channel credentials (managed via environment variables)

### 3. Functional Requirements
1. `GET /api/admin/config` returns the current configuration object
2. `PUT /api/admin/config` accepts a partial or full configuration update; validates and persists changes
3. Configurable fields: `trigger_delay_hours` (integer ≥0), `reminder_count` (integer 0–5), `reminder_interval_hours` (integer ≥1), `active` (boolean), `weight_cleanliness`, `weight_location`, `weight_service`, `weight_amenities`, `weight_value` (decimal 0.0–5.0 each)
4. `active = false` causes the Feedback Trigger System (TS-2) to skip enqueuing new tasks
5. Changes to scoring weights trigger a `RECOMPUTE_ALL_SCORES` task that re-runs TS-7 for all hotels with existing submissions
6. Config save responds within 500ms and returns the updated configuration object
7. Default values are applied on first read if no configuration exists

### 4. Non-Functional Requirements
- Validation errors return HTTP 422 with field-level error details
- Configuration reads are cached for up to 60 seconds to reduce DB load
- `PUT` requires `admin` role; `GET` may be accessible to the application internally
- Upsert on the singleton row ensures no duplicate configuration rows are created

### 5. Inputs & Outputs
**Inputs:**
- Admin PUT request body: configuration field values
- Internal GET calls from TS-2, TS-7

**Outputs:**
- HTTP 200 with current config on GET
- HTTP 200 with updated config on PUT
- HTTP 422 on validation failure
- Upserted `feedback_config` row
- Enqueued `RECOMPUTE_ALL_SCORES` task if weights changed

### 6. Dependencies
- TS-6: Data Storage (defines `feedback_config` table with singleton pattern)
- TS-2: Feedback Trigger System (reads `active`, `trigger_delay_hours`, `reminder_count`, `reminder_interval_hours`)
- TS-7: Scoring Engine (reads dimension weights; receives `RECOMPUTE_ALL_SCORES` task)

### 7. Acceptance Criteria
- [ ] `GET /api/admin/config` returns the current configuration or defaults if not yet set
- [ ] `PUT /api/admin/config` persists valid changes and returns the updated object
- [ ] Setting `active = false` causes TS-2 to stop enqueuing new feedback tasks
- [ ] Changing a weight value triggers recomputation of all hotel scores
- [ ] Invalid field values return HTTP 422 with the failing field identified
- [ ] Running PUT twice with the same values produces exactly one `feedback_config` row

### 8. Edge Cases
- All weights set to zero: API rejects with HTTP 422 ("at least one weight must be greater than zero")
- `RECOMPUTE_ALL_SCORES` task fails after successful config save: log the failure; admin can manually retrigger via a dashboard action
- Config read during cache interval after update: stale read acceptable within 60-second TTL
- Concurrent PUT requests: database upsert on singleton ensures last-write-wins; no duplicate rows

### 9. Estimated Effort
3 days (breakdown: 4 hours design + 12 hours implementation + 8 hours testing)

---

## Tech Story 13: Sentiment Analysis Layer (Optional / MVP-Stretch)

### 1. Objective
Enrich feedback submissions with automated sentiment classification by processing optional free-text comments to produce a sentiment label and confidence score. This story is explicitly scoped as optional and does not block any other stories.

### 2. Scope
**Included:**
- A sentiment processor that consumes `ANALYZE_SENTIMENT` tasks
- Classification of comment text into: `positive`, `neutral`, or `negative`
- A confidence score (0.0–1.0) for each classification
- Storage of sentiment results in the `feedback_submissions` row
- Sentiment distribution summary in the Admin Dashboard (TS-10 extension)

**Excluded:**
- Real-time sentiment (processed asynchronously after submission)
- Multi-language sentiment (English only in v1.0)
- Fine-grained emotion classification (happy/angry/disappointed)
- Sentiment influencing hotel score computation (TS-7 uses ratings only)

### 3. Functional Requirements
1. On successful feedback submission (TS-5), if `comment` is non-null and non-empty, enqueue an `ANALYZE_SENTIMENT` task with the submission ID
2. The sentiment processor retrieves the comment from `feedback_submissions` by submission ID
3. The processor classifies the comment as `positive`, `neutral`, or `negative` using a rule-based or statistical text classifier
4. The processor stores `sentiment_label` and `sentiment_confidence` on the `feedback_submissions` row
5. Processing failures are logged and the fields are left as NULL; they do not affect the submission record
6. The Admin Dashboard displays a sentiment distribution chart: count and percentage of positive/neutral/negative across all analyzed submissions

### 4. Non-Functional Requirements
- Sentiment processing must complete within 2 seconds per comment
- Classification is performed locally (no external API calls required in v1.0) using a lightweight NLP library
- Submissions without comments have `sentiment_label = NULL` (no processing attempted)
- Sentiment fields are additive: their absence does not break any existing query or feature

### 5. Inputs & Outputs
**Inputs:**
- `ANALYZE_SENTIMENT` task: `submission_id`
- `feedback_submissions.comment` text

**Outputs:**
- Updated `feedback_submissions` row: `sentiment_label` (ENUM: positive/neutral/negative), `sentiment_confidence` (DECIMAL 0.00–1.00)

### 6. Dependencies
- TS-5: Feedback Submission API (enqueues `ANALYZE_SENTIMENT` tasks, provides comment text)
- TS-6: Data Storage (add `sentiment_label` and `sentiment_confidence` columns to `feedback_submissions` migration)
- TS-10: Admin Dashboard (extended to show sentiment distribution — dependent on this story being implemented)

### 7. Acceptance Criteria
- [ ] Submissions with a non-empty comment produce a `sentiment_label` and `sentiment_confidence` value after processing
- [ ] Submissions with no comment have `sentiment_label = NULL` and `sentiment_confidence = NULL`
- [ ] Sentiment processing failure leaves submission record unmodified (no partial write)
- [ ] Admin Dashboard shows sentiment distribution counts when this story is active
- [ ] Disabling/not deploying this story has no impact on any other story's functionality

### 8. Edge Cases
- Comment is only punctuation or numbers: classify as `neutral` with low confidence (e.g., 0.40)
- Comment is extremely long (approaching 1000-character limit): truncate to first 500 characters for classification; store original comment in full
- Classifier returns confidence below 0.30: store label but flag it as low-confidence in a separate boolean column `sentiment_low_confidence = true`
- Processing queue backed up: sentiment tasks are lowest priority; delays up to 10 minutes are acceptable as results are not user-facing in real-time

### 9. Estimated Effort
4 days (breakdown: 4 hours research + design + 16 hours implementation + 12 hours testing)

---

## Story Summary

| # | Title | Effort | Dependencies |
|---|-------|--------|-------------|
| 1 | Booking Completion Detection | 2 days | — |
| 2 | Feedback Trigger System | 3 days | TS-1, TS-12 |
| 3 | Notification System | 4 days | TS-2, TS-4 |
| 4 | Feedback Form UI | 3 days | TS-5, TS-2 |
| 5 | Feedback Submission API | 3 days | TS-4, TS-6, TS-7 |
| 6 | Data Storage (Database Schema) | 2 days | — |
| 7 | Scoring Engine | 3 days | TS-5, TS-6, TS-12 |
| 8 | Ranking Update Logic | 2 days | TS-7, TS-6 |
| 9 | Hotel Listing Integration | 3 days | TS-8, TS-11, TS-6 |
| 10 | Admin Dashboard | 4 days | TS-6, TS-8, TS-11 |
| 11 | Flagging and Blacklisting Logic | 2 days | TS-6, TS-9, TS-10 |
| 12 | Configuration System | 3 days | TS-6, TS-2, TS-7 |
| 13 | Sentiment Analysis Layer (Optional) | 4 days | TS-5, TS-6, TS-10 |
