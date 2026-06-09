CREATE TABLE IF NOT EXISTS partner_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  partnership_type TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  country TEXT,
  message TEXT,
  project_type TEXT,
  geography TEXT,
  investment_size TEXT,
  collaboration_goals TEXT,
  target_returns TEXT,
  investment_thesis TEXT,
  capabilities TEXT,
  regions_of_interest TEXT,
  relevant_experience TEXT,
  products_services TEXT,
  scale_of_supply TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE partner_inquiries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_inquiries_insert_public" ON partner_inquiries
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "partner_inquiries_select_admin" ON partner_inquiries
  FOR SELECT TO authenticated
  USING (is_admin());

CREATE POLICY "partner_inquiries_delete_admin" ON partner_inquiries
  FOR DELETE TO authenticated
  USING (is_admin());
