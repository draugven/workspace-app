-- Migration: Add privacy functionality to tasks and notes
-- Run this script to add is_private fields to tasks and notes tables

-- Add is_private field to tasks table
ALTER TABLE public.tasks
ADD COLUMN is_private boolean DEFAULT false;

-- Add is_private field to notes table
ALTER TABLE public.notes
ADD COLUMN is_private boolean DEFAULT false;

-- Add comments to document the new fields
COMMENT ON COLUMN public.tasks.is_private IS 'When true, only the creator (created_by) can view this task';
COMMENT ON COLUMN public.notes.is_private IS 'When true, only the creator (created_by) can view this note';