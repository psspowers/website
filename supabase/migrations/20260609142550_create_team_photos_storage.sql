-- Create the team-photos storage bucket (public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-photos',
  'team-photos',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Public can view all files in the bucket
CREATE POLICY "team_photos_select_public" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'team-photos');

-- Only admins can upload
CREATE POLICY "team_photos_insert_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'team-photos' AND is_admin());

-- Only admins can update
CREATE POLICY "team_photos_update_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'team-photos' AND is_admin());

-- Only admins can delete
CREATE POLICY "team_photos_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'team-photos' AND is_admin());
