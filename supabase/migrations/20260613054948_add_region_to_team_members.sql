ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS region text NOT NULL DEFAULT 'global' CHECK (region IN ('india', 'sea', 'global'));

UPDATE public.team_members SET region = 'india' WHERE name IN ('Sam Yamdagni', 'Nikesh Sinha', 'Ashish Kumar', 'Kapil Joshi');
UPDATE public.team_members SET region = 'sea'   WHERE name IN ('Nakkarin Saingarmsatit', 'Suraphol Sanyom', 'Chudapak Juthachutinan', 'Pimlapat Boonthae');
