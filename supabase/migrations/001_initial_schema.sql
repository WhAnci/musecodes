-- Muse Referral Codes schema

CREATE TYPE feedback_result AS ENUM ('worked', 'failed', 'ineligible', 'invalid');

CREATE TABLE referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_hidden BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT code_format CHECK (code ~ '^[A-Z0-9]{6}$')
);

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code_id UUID NOT NULL REFERENCES referral_codes(id) ON DELETE CASCADE,
  result feedback_result NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  anonymous_identifier TEXT NOT NULL,
  ip_hash TEXT,
  CONSTRAINT one_feedback_per_visitor UNIQUE (referral_code_id, anonymous_identifier)
);

CREATE TABLE rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL,
  action TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_feedback_referral_code_id ON feedback(referral_code_id);
CREATE INDEX idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX idx_rate_limits_lookup ON rate_limits(key, action, created_at DESC);
CREATE INDEX idx_referral_codes_featured ON referral_codes(is_featured) WHERE is_featured = true;
CREATE INDEX idx_referral_codes_created_at ON referral_codes(created_at DESC);

-- Aggregated stats view
CREATE VIEW referral_codes_with_stats
WITH (security_invoker = true)
AS
SELECT
  rc.id,
  rc.code,
  rc.display_name,
  rc.created_at,
  rc.is_featured,
  rc.is_hidden,
  COUNT(f.id) FILTER (WHERE f.result = 'worked')::int AS worked_count,
  COUNT(f.id) FILTER (WHERE f.result = 'failed')::int AS failed_count,
  COUNT(f.id) FILTER (WHERE f.result = 'ineligible')::int AS ineligible_count,
  COUNT(f.id) FILTER (WHERE f.result = 'invalid')::int AS invalid_count,
  MAX(f.created_at) FILTER (WHERE f.result = 'worked') AS last_worked_at,
  COUNT(f.id) FILTER (WHERE f.result = 'worked' AND f.created_at > now() - interval '7 days')::int AS recent_worked,
  COUNT(f.id) FILTER (WHERE f.result = 'failed' AND f.created_at > now() - interval '7 days')::int AS recent_failed,
  COUNT(f.id)::int AS total_feedback
FROM referral_codes rc
LEFT JOIN feedback f ON f.referral_code_id = rc.id
GROUP BY rc.id;

-- Seed featured site owner code
INSERT INTO referral_codes (code, display_name, is_featured)
VALUES ('S8D87N', 'Site Owner', true);

-- Row Level Security
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible codes"
  ON referral_codes FOR SELECT
  USING (is_hidden = false);

CREATE POLICY "Anyone can read feedback"
  ON feedback FOR SELECT
  USING (true);

-- Writes go through service role (API routes only)
