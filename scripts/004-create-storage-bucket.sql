-- Create storage bucket for activity photos
-- Note: This needs to be run after Supabase storage is enabled
INSERT INTO storage.buckets (id, name, public) 
VALUES ('activity-photos', 'activity-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload their own photos" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'activity-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access for activity photos
CREATE POLICY "Public read access for activity photos" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'activity-photos');

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos" ON storage.objects
FOR DELETE TO authenticated
USING (
  bucket_id = 'activity-photos' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
