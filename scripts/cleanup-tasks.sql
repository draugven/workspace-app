-- Cleanup script to remove all task-related data
-- Run this to start with a clean slate before importing new todos

-- Remove task-tag assignments first (foreign key constraints)
DELETE FROM task_tag_assignments;

-- Remove all tasks
DELETE FROM tasks;

-- Remove all task tags
DELETE FROM task_tags;

-- Reset sequences (if using PostgreSQL with sequences)
-- This ensures IDs start from 1 again
ALTER SEQUENCE IF EXISTS tasks_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS task_tags_id_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS task_tag_assignments_id_seq RESTART WITH 1;

-- Verify cleanup
SELECT 'Tasks remaining:' as status, COUNT(*) as count FROM tasks
UNION ALL
SELECT 'Task tags remaining:' as status, COUNT(*) as count FROM task_tags
UNION ALL
SELECT 'Task tag assignments remaining:' as status, COUNT(*) as count FROM task_tag_assignments;