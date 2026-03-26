create extension if not exists pgcrypto;

create table if not exists hotels (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  location text not null,
  avg_score numeric(3,2) not null default 0,
  total_feedbacks integer not null default 0,
  status_bucket text not null default 'stable',
  last_feedback_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  traveller_name text not null,
  traveller_email text,
  hotel_id uuid not null references hotels(id) on delete cascade,
  checkin_date timestamptz not null,
  checkout_date timestamptz not null,
  status text not null default 'booked',
  feedback_eligible boolean not null default false,
  feedback_sent boolean not null default false,
  feedback_submitted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references bookings(id) on delete cascade,
  hotel_id uuid not null references hotels(id) on delete cascade,
  value_for_money integer not null check (value_for_money between 1 and 5),
  service_quality integer not null check (service_quality between 1 and 5),
  room_cleanliness integer not null check (room_cleanliness between 1 and 5),
  amenities_provided integer not null check (amenities_provided between 1 and 5),
  repeat_stay_likelihood integer not null check (repeat_stay_likelihood between 1 and 5),
  recommend_to_colleagues integer not null check (recommend_to_colleagues between 1 and 5),
  comment text,
  computed_score numeric(3,2) not null,
  sentiment_label text,
  sentiment_score numeric(4,2),
  issue_category text,
  urgency_flag boolean default false,
  summary_text text,
  created_at timestamptz not null default now()
);

create table if not exists feedback_config (
  id uuid primary key default gen_random_uuid(),
  trigger_delay_hours integer not null default 1,
  reminder_enabled boolean not null default true,
  reminder_frequency_hours integer not null default 24,
  max_reminders integer not null default 2,
  reminder_cutoff_hours integer not null default 72,
  form_expiry_hours integer not null default 96,
  email_enabled boolean not null default true,
  whatsapp_enabled boolean not null default true,
  slack_enabled boolean not null default true,
  teams_enabled boolean not null default true,
  whatsapp_quick_feedback_enabled boolean not null default true,
  cleanliness_weight numeric(4,2) not null default 0.30,
  service_weight numeric(4,2) not null default 0.30,
  value_weight numeric(4,2) not null default 0.20,
  amenities_weight numeric(4,2) not null default 0.10,
  intent_weight numeric(4,2) not null default 0.10,
  boost_threshold numeric(3,2) not null default 4.50,
  neutral_threshold numeric(3,2) not null default 3.00,
  flagged_threshold numeric(3,2) not null default 2.00,
  created_at timestamptz not null default now()
);
