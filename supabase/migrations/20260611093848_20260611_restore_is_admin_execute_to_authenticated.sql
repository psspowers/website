-- Restore EXECUTE on is_admin() for the authenticated role.
-- Migration 20260610072851 over-revoked this, breaking all admin
-- write policies on projects, news_posts, offices, team_members,
-- popup_announcements, contact_submissions, and partner_inquiries.
-- anon and PUBLIC remain revoked intentionally.
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
