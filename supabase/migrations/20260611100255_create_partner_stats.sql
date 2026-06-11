CREATE TABLE public.partner_stats (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key        text UNIQUE NOT NULL,
  value      text NOT NULL,
  label      text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.partner_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partner_stats_select_public" ON public.partner_stats
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "partner_stats_insert_admin" ON public.partner_stats
  FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "partner_stats_update_admin" ON public.partner_stats
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "partner_stats_delete_admin" ON public.partner_stats
  FOR DELETE TO authenticated USING (is_admin());

INSERT INTO public.partner_stats (key, value, label, sort_order) VALUES
  ('aum',                 '$60B',      'Assets Under Management',     1),
  ('portfolio_employees', '110,000+',  'Portfolio Company Employees', 2),
  ('portfolio_companies', '100+',      'Portfolio Companies',         3),
  ('global_offices',      '9',         'Global Offices',              4),
  ('employees',           '360+',      'Employees',                   5),
  ('countries',           '115+',      'Countries with Investments',  6);
