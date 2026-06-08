
-- ============================================================
-- Step 1: Admin users table
-- ============================================================
CREATE TABLE IF NOT EXISTS admin_users (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can only see their own row (prevents enumeration)
CREATE POLICY "admin_users_select_own" ON admin_users
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Seed the existing admin user
INSERT INTO admin_users (user_id)
  SELECT id FROM auth.users WHERE email = 'admin@psspowers.com'
  ON CONFLICT DO NOTHING;

-- ============================================================
-- Step 2: is_admin() helper — SECURITY DEFINER bypasses RLS
-- ============================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
$$;

-- ============================================================
-- Step 3: news_posts — drop all write policies, recreate admin-only
-- ============================================================
DROP POLICY IF EXISTS "delete_news"                       ON news_posts;
DROP POLICY IF EXISTS "news_posts_delete_authenticated"   ON news_posts;
DROP POLICY IF EXISTS "insert_news"                       ON news_posts;
DROP POLICY IF EXISTS "news_posts_insert_authenticated"   ON news_posts;
DROP POLICY IF EXISTS "update_news"                       ON news_posts;
DROP POLICY IF EXISTS "news_posts_update_authenticated"   ON news_posts;

CREATE POLICY "news_posts_insert_admin" ON news_posts
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "news_posts_update_admin" ON news_posts
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "news_posts_delete_admin" ON news_posts
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- Step 4: projects — drop all write policies, recreate admin-only
-- ============================================================
DROP POLICY IF EXISTS "delete_projects"                     ON projects;
DROP POLICY IF EXISTS "projects_delete_authenticated"       ON projects;
DROP POLICY IF EXISTS "insert_projects"                     ON projects;
DROP POLICY IF EXISTS "projects_insert_authenticated"       ON projects;
DROP POLICY IF EXISTS "update_projects"                     ON projects;
DROP POLICY IF EXISTS "projects_update_authenticated"       ON projects;

CREATE POLICY "projects_insert_admin" ON projects
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "projects_update_admin" ON projects
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "projects_delete_admin" ON projects
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- Step 5: offices — drop all write policies, recreate admin-only
-- ============================================================
DROP POLICY IF EXISTS "delete_offices"                    ON offices;
DROP POLICY IF EXISTS "offices_delete_authenticated"      ON offices;
DROP POLICY IF EXISTS "insert_offices"                    ON offices;
DROP POLICY IF EXISTS "offices_insert_authenticated"      ON offices;
DROP POLICY IF EXISTS "update_offices"                    ON offices;
DROP POLICY IF EXISTS "offices_update_authenticated"      ON offices;

CREATE POLICY "offices_insert_admin" ON offices
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "offices_update_admin" ON offices
  FOR UPDATE TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "offices_delete_admin" ON offices
  FOR DELETE TO authenticated
  USING (is_admin());

-- ============================================================
-- Step 6: contact_submissions
-- Public INSERT is intentional (contact form — no user ownership possible).
-- Fix SELECT to restrict to admins only (leads are sensitive).
-- ============================================================
DROP POLICY IF EXISTS "insert_contact_submissions"      ON contact_submissions;
DROP POLICY IF EXISTS "select_contact_submissions"      ON contact_submissions;

-- Intentionally public — no user_id column exists on this table
CREATE POLICY "contact_submissions_insert_public" ON contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Only admins may read contact submissions
CREATE POLICY "contact_submissions_select_admin" ON contact_submissions
  FOR SELECT TO authenticated
  USING (is_admin());

-- Only admins may delete contact submissions
CREATE POLICY "contact_submissions_delete_admin" ON contact_submissions
  FOR DELETE TO authenticated
  USING (is_admin());
