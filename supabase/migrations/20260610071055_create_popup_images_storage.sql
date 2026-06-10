
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'popup-images',
  'popup-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "popup_images_select_public" ON storage.objects
  FOR SELECT TO public
  USING (bucket_id = 'popup-images');

CREATE POLICY "popup_images_insert_admin" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'popup-images' AND is_admin());

CREATE POLICY "popup_images_update_admin" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'popup-images' AND is_admin());

CREATE POLICY "popup_images_delete_admin" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'popup-images' AND is_admin());
