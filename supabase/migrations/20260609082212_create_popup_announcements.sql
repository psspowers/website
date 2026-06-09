
CREATE TABLE IF NOT EXISTS popup_announcements (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  image_url     TEXT,
  cta_label     TEXT NOT NULL DEFAULT 'Learn More',
  cta_url       TEXT NOT NULL DEFAULT '/news',
  is_active     BOOLEAN NOT NULL DEFAULT false,
  show_from     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  show_until    TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
  delay_seconds INTEGER NOT NULL DEFAULT 5,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE popup_announcements ENABLE ROW LEVEL SECURITY;

-- Public can read active popups (needed by the frontend without auth)
CREATE POLICY "popup_select_public" ON popup_announcements
  FOR SELECT TO anon, authenticated
  USING (true);

-- Only admins can write
CREATE POLICY "popup_insert_admin" ON popup_announcements
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "popup_update_admin" ON popup_announcements
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "popup_delete_admin" ON popup_announcements
  FOR DELETE TO authenticated
  USING (is_admin());

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_popup_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER popup_updated_at_trigger
  BEFORE UPDATE ON popup_announcements
  FOR EACH ROW EXECUTE FUNCTION update_popup_updated_at();
