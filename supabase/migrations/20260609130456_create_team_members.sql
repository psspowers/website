
CREATE TABLE public.team_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  role text NOT NULL,
  bio text NOT NULL DEFAULT '',
  image_url text,
  display_order integer NOT NULL DEFAULT 0,
  is_visible boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_select_public" ON public.team_members
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "team_insert_admin" ON public.team_members
  FOR INSERT TO authenticated WITH CHECK (is_admin());

CREATE POLICY "team_update_admin" ON public.team_members
  FOR UPDATE TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "team_delete_admin" ON public.team_members
  FOR DELETE TO authenticated USING (is_admin());

INSERT INTO public.team_members (name, role, bio, image_url, display_order, is_visible) VALUES
  ('Sam Yamdagni', 'CEO & JMD', 'Leading PSS Powers with strategic vision and extensive industry experience.', '/Team/Sam.jpg', 1, true),
  ('Nikesh Sinha', 'JMD', 'Leading PSS Powers with strategic vision and extensive industry experience.', '/Team/Nikesh.jpg', 2, true),
  ('Nakkarin Saingarmsatit', 'GM & Director', 'Overseeing Project Development & execution in Thailand.', '/Team/Nakkarin.jpg', 3, true),
  ('Suraphol Sanyom', 'Head, Construction O&M', 'Leading construction operations and maintenance with proven expertise.', '/Team/Suraphol.jpg', 4, true),
  ('Ashish Kumar', 'Head, Investment & Transac.', 'Leading investment strategies and transaction management.', '/Team/Ashish.jpg', 5, true),
  ('Chudapak Juthachutinan', 'Head, Finance & Accounts', 'Overseeing financial operations and accounting excellence in Thailand.', '/Team/Chudapak.jpg', 6, true),
  ('Kapil Joshi', 'Head, Finance & Accounts', 'Overseeing financial operations and accounting excellence in India.', '/Team/Kapil.jpg', 7, true),
  ('Pimlapat Boonthae', 'Renewable Energy Marketing Lead', 'Drives brand decarbonization engagement and Marketing.', '/Team/Pimlapat.jpg', 8, true);
