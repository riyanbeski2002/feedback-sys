-- Migration: feedback_config singleton constraint
-- Purpose: Enforce exactly one row in feedback_config
-- Safe to run multiple times (all statements are idempotent)
--
-- IMPORTANT: This migration must be applied manually via the Supabase SQL Editor
-- or Supabase CLI before deploying the corresponding application code changes.
-- Steps:
--   1. Open Supabase dashboard > SQL Editor
--   2. Paste and run the full contents of this file
--   3. Verify feedback_config has a `singleton` column and at most 1 row

-- Step 1: Remove duplicate rows, keep newest
DELETE FROM feedback_config
WHERE id NOT IN (
  SELECT id FROM feedback_config ORDER BY created_at DESC LIMIT 1
);

-- Step 2: Add boolean sentinel column
ALTER TABLE feedback_config
  ADD COLUMN IF NOT EXISTS singleton BOOLEAN NOT NULL DEFAULT TRUE;

-- Step 3: Enforce uniqueness at DB level
CREATE UNIQUE INDEX IF NOT EXISTS feedback_config_singleton_idx
  ON feedback_config (singleton);
