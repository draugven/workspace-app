-- Supabase Storage Setup for File Attachments
-- Run this in Supabase SQL Editor to set up storage bucket and policies

-- Step 1: Create the attachments bucket (via Dashboard or SQL)
-- Go to Storage > Create new bucket > Name: "attachments" > Public: true

-- Step 2: Storage policies for the attachments bucket

-- Policy 1: Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'attachments');

-- Policy 2: Allow public read access to files
CREATE POLICY "Allow public read access" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'attachments');

-- Policy 3: Allow users to delete their own uploaded files
CREATE POLICY "Allow users to delete their own files" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'attachments' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Alternative Policy 3: Allow file deletion for item file owners (more complex)
-- This requires checking the item_files table to verify ownership
CREATE OR REPLACE FUNCTION can_delete_file(file_path text)
RETURNS boolean AS $$
BEGIN
  -- Check if current user uploaded this file
  RETURN EXISTS (
    SELECT 1 FROM item_files
    WHERE file_path = can_delete_file.file_path
    AND uploaded_by = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Replace the simple delete policy with the ownership-based one
DROP POLICY IF EXISTS "Allow users to delete their own files" ON storage.objects;

CREATE POLICY "Allow file owners to delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'attachments' AND can_delete_file(name));

-- Step 3: Enable RLS on the item_files table
ALTER TABLE item_files ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to insert files
CREATE POLICY "Allow authenticated users to insert files" ON item_files
FOR INSERT TO authenticated
WITH CHECK (true);

-- Policy: Allow users to read all item files
CREATE POLICY "Allow users to read item files" ON item_files
FOR SELECT TO authenticated
USING (true);

-- Policy: Allow users to delete their own uploaded files
CREATE POLICY "Allow users to delete their own item files" ON item_files
FOR DELETE TO authenticated
USING (uploaded_by = auth.uid());