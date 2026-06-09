-- ============================================================
-- Milestones table
-- ============================================================
CREATE TABLE public.milestones (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  year text NOT NULL,
  event text NOT NULL,
  logo_url text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "milestones_select_public" ON public.milestones
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "milestones_insert_admin" ON public.milestones
  FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "milestones_update_admin" ON public.milestones
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "milestones_delete_admin" ON public.milestones
  FOR DELETE TO authenticated USING (is_admin());

INSERT INTO public.milestones (year, event, logo_url, display_order) VALUES
  ('2012', 'APCA Powers invest in first 5.0 MW solar plant', null, 1),
  ('2015', 'PSS Powers founded with a vision for renewable energy', null, 2),
  ('2016', 'Completed first utility-scale solar project (5+1 MW)', null, 3),
  ('2017', 'Expanded operations into EPC Business', null, 4),
  ('2019', 'Started C&I Business', null, 5),
  ('2022', 'Expanded in to India with 60 MW under open access', null, 6),
  ('2024', 'Complete execution of 105 MW', null, 7),
  ('2025', 'Signed agreement to partner with I Squared Capital', '/i-squared-capital-logo.png', 8);

-- ============================================================
-- About stats table
-- ============================================================
CREATE TABLE public.about_stats (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  value integer NOT NULL,
  label text NOT NULL,
  format text NOT NULL DEFAULT '',
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.about_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "about_stats_select_public" ON public.about_stats
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "about_stats_insert_admin" ON public.about_stats
  FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "about_stats_update_admin" ON public.about_stats
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "about_stats_delete_admin" ON public.about_stats
  FOR DELETE TO authenticated USING (is_admin());

INSERT INTO public.about_stats (value, label, format, display_order) VALUES
  (450, 'Total Project Pipeline', 'MW', 1),
  (5, 'Countries Served', '+', 2),
  (70, 'Employees Worldwide', '+', 3),
  (100, 'Projects Completed', '+', 4);
