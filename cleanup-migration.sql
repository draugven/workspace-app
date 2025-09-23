-- Migration to clean up user data and point tasks to auth.users
-- Run this in Supabase SQL Editor

-- 1. First, drop the user_departments table and its constraints
DROP TABLE IF EXISTS user_departments CASCADE;

-- 2. Drop the custom users table completely
DROP TABLE IF EXISTS users CASCADE;

-- 3. Update tasks table to use auth.users
-- First, set all assigned_to and created_by to null to avoid constraint issues
UPDATE tasks SET assigned_to = NULL, created_by = NULL;

-- 4. Drop old foreign key constraints on tasks table
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_assigned_to_fkey;
ALTER TABLE tasks DROP CONSTRAINT IF EXISTS tasks_created_by_fkey;

-- 5. Add new foreign key constraints pointing to auth.users
ALTER TABLE tasks ADD CONSTRAINT tasks_assigned_to_fkey
  FOREIGN KEY (assigned_to) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE tasks ADD CONSTRAINT tasks_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 6. Clean up items and item_files data that references non-existent users
UPDATE items SET created_by = NULL
WHERE created_by IS NOT NULL
AND created_by NOT IN (SELECT id FROM auth.users);

UPDATE item_files SET uploaded_by = NULL
WHERE uploaded_by IS NOT NULL
AND uploaded_by NOT IN (SELECT id FROM auth.users);

-- 7. Update items table constraints
ALTER TABLE items DROP CONSTRAINT IF EXISTS items_created_by_fkey;
ALTER TABLE items ADD CONSTRAINT items_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 8. Update item_files table constraints
ALTER TABLE item_files DROP CONSTRAINT IF EXISTS item_files_uploaded_by_fkey;
ALTER TABLE item_files ADD CONSTRAINT item_files_uploaded_by_fkey
  FOREIGN KEY (uploaded_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 9. Clean up notes data that references non-existent users
-- First, set created_by and locked_by to NULL where they don't exist in auth.users
UPDATE notes SET created_by = NULL
WHERE created_by IS NOT NULL
AND created_by NOT IN (SELECT id FROM auth.users);

UPDATE notes SET locked_by = NULL
WHERE locked_by IS NOT NULL
AND locked_by NOT IN (SELECT id FROM auth.users);

-- Clean up note_versions data
UPDATE note_versions SET created_by = NULL
WHERE created_by IS NOT NULL
AND created_by NOT IN (SELECT id FROM auth.users);

-- 10. Update notes table constraints
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_created_by_fkey;
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_locked_by_fkey;
ALTER TABLE notes ADD CONSTRAINT notes_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE notes ADD CONSTRAINT notes_locked_by_fkey
  FOREIGN KEY (locked_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 11. Update note_versions table constraints
ALTER TABLE note_versions DROP CONSTRAINT IF EXISTS note_versions_created_by_fkey;
ALTER TABLE note_versions ADD CONSTRAINT note_versions_created_by_fkey
  FOREIGN KEY (created_by) REFERENCES auth.users(id) ON DELETE SET NULL;

-- 12. Clean up any existing tasks that may have invalid user references
-- This ensures the database is in a clean state
DELETE FROM task_tag_assignments WHERE task_id IN (
  SELECT id FROM tasks WHERE created_by IS NOT NULL AND created_by NOT IN (SELECT id FROM auth.users)
);
DELETE FROM tasks WHERE created_by IS NOT NULL AND created_by NOT IN (SELECT id FROM auth.users);

-- 13. Update RLS policies to use auth.users instead of custom users table
-- Note: You'll need to review and update any existing RLS policies manually
-- as they may reference the old users table

COMMIT;