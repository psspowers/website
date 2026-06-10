
-- Add gallery_urls column to projects
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS gallery_urls text[] NOT NULL DEFAULT '{}';

-- Create project-images storage bucket (public, 5 MB limit)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'project-images',
  'project-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Public read
CREATE POLICY "project_images_select_public" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'project-images');

-- Admin write
CREATE POLICY "project_images_insert_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images' AND is_admin());

CREATE POLICY "project_images_update_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images' AND is_admin());

CREATE POLICY "project_images_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'project-images' AND is_admin());
