-- =====================================================================
-- Kakatong v3.12.8 Migration — Legal disclaimer audit trail
-- =====================================================================
-- Run this in Supabase → SQL Editor → New query → paste → Run
--
-- What this does:
--   Creates a `disclaimer_acks` table that records each time a paid
--   member acknowledges the legal disclaimer before revealing an aide's
--   contact info. Provides a strong audit trail for any liability dispute.
--
-- What is captured on each acknowledgment:
--   - Who agreed (member_id + denormalized name/email so it stays readable
--     even if the member later deletes their account)
--   - Which caregiver they were about to contact
--   - When they agreed (created_at)
--   - Which version of the disclaimer text (v1 today; bump if text changes)
--   - Browser user agent (extra audit signal — was it a real browser?)
--
-- What is NOT captured (deliberate — privacy/simplicity):
--   - IP address (PII, requires GDPR consent, low legal value)
--   - Screen resolution / device fingerprint (creepy without upside)
--
-- SAFE TO RE-RUN — uses IF NOT EXISTS.
-- =====================================================================

CREATE TABLE IF NOT EXISTS disclaimer_acks (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id      text,                              -- links to members.user_id (nullable if session lost)
  member_name    text,                              -- denormalized: survives member deletion
  member_email   text,                              -- denormalized: same reason
  caregiver_id   text,                              -- which aide's contact they were revealing
  caregiver_name text,                              -- denormalized
  disclaimer_version text NOT NULL DEFAULT 'v1',    -- bump if the disclaimer text changes
  user_agent     text,                              -- extra audit signal
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_disclaimer_acks_member    ON disclaimer_acks(member_id);
CREATE INDEX IF NOT EXISTS idx_disclaimer_acks_caregiver ON disclaimer_acks(caregiver_id);
CREATE INDEX IF NOT EXISTS idx_disclaimer_acks_created   ON disclaimer_acks(created_at DESC);

-- =====================================================================
-- Allow anonymous inserts (the JS client uses the anon/publishable key)
-- =====================================================================
ALTER TABLE disclaimer_acks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anyone can insert disclaimer acks" ON disclaimer_acks;
CREATE POLICY "anyone can insert disclaimer acks"
  ON disclaimer_acks FOR INSERT
  WITH CHECK (true);

-- Read policy: admin only (uses the same pattern as your other admin-only tables).
-- If your admin uses the service-role key to read tables, no read policy is needed;
-- if you read via the anon key from the admin panel, uncomment the block below.
--
-- DROP POLICY IF EXISTS "read acks (admin only)" ON disclaimer_acks;
-- CREATE POLICY "read acks (admin only)"
--   ON disclaimer_acks FOR SELECT
--   USING (true);

-- =====================================================================
-- VERIFY: table exists and structure is right
-- =====================================================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'disclaimer_acks'
ORDER BY ordinal_position;

-- =====================================================================
-- Sample query (once real data exists):
-- =====================================================================
-- SELECT created_at, member_name, member_email, caregiver_name, disclaimer_version
-- FROM disclaimer_acks
-- ORDER BY created_at DESC
-- LIMIT 20;
