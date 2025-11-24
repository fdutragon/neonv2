-- Create storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('vehicle-images', 'vehicle-images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']);

-- Create storage policies for vehicle images
CREATE POLICY "Allow public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'vehicle-images');

CREATE POLICY "Allow authenticated users to upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'vehicle-images' AND auth.role() = 'authenticated');

-- Grant permissions to anon and authenticated roles
GRANT SELECT ON storage.objects TO anon;
GRANT ALL ON storage.objects TO authenticated;