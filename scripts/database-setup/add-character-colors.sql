-- Add color field to characters table and populate with distinct colors
-- Run this script in Supabase SQL Editor

-- Add color column to characters table
ALTER TABLE characters ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#6b7280';

-- Update characters with distinct colors
UPDATE characters SET color = '#ef4444' WHERE name = 'Dracula'; -- Red
UPDATE characters SET color = '#3b82f6' WHERE name = 'Jonathan Harker'; -- Blue
UPDATE characters SET color = '#10b981' WHERE name = 'Mina Murray'; -- Green
UPDATE characters SET color = '#f59e0b' WHERE name = 'Lucy Westenra'; -- Amber
UPDATE characters SET color = '#8b5cf6' WHERE name = 'Arthur Holmwood'; -- Purple
UPDATE characters SET color = '#06b6d4' WHERE name = 'Jack Seward'; -- Cyan
UPDATE characters SET color = '#84cc16' WHERE name = 'Quincey Morris'; -- Lime
UPDATE characters SET color = '#f97316' WHERE name = 'Van Helsing'; -- Orange
UPDATE characters SET color = '#ec4899' WHERE name = 'Renfield'; -- Pink
UPDATE characters SET color = '#64748b' WHERE name = 'Wirtin'; -- Slate
UPDATE characters SET color = '#7c3aed' WHERE name = 'Vampirellas'; -- Violet
UPDATE characters SET color = '#059669' WHERE name = 'Ensemble'; -- Emerald

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Character colors added successfully!';
  RAISE NOTICE 'All characters now have distinct colors for better UI visualization.';
END $$;