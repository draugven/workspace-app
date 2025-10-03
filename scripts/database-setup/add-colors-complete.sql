-- Complete color enhancement for Theater Production App
-- Run this script in Supabase SQL Editor to add colors to characters and categories

-- Step 1: Add color column to characters table
ALTER TABLE characters ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#6b7280';

-- Step 2: Update characters with distinct colors
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

-- Step 3: Update categories with thematic colors
UPDATE categories SET color = '#8b5cf6' WHERE name = 'Taschen & Koffer'; -- Purple (accessories)
UPDATE categories SET color = '#059669' WHERE name = 'Möbel'; -- Emerald (furniture)
UPDATE categories SET color = '#10b981' WHERE name = 'Floristik'; -- Green (plants/flowers)
UPDATE categories SET color = '#f59e0b' WHERE name = 'Religiös'; -- Amber (religious/sacred)
UPDATE categories SET color = '#ec4899' WHERE name = 'Accessoires'; -- Pink (fashion accessories)
UPDATE categories SET color = '#3b82f6' WHERE name = 'Schreibgeräte'; -- Blue (writing tools)
UPDATE categories SET color = '#64748b' WHERE name = 'Papierwaren'; -- Slate (paper goods)
UPDATE categories SET color = '#f97316' WHERE name = 'Schmuck'; -- Orange (jewelry)
UPDATE categories SET color = '#6b7280' WHERE name = 'Diverse'; -- Gray (miscellaneous)
UPDATE categories SET color = '#dc2626' WHERE name = 'Essen & Trinken'; -- Red (food/drink)
UPDATE categories SET color = '#7c2d12' WHERE name = 'Waffen'; -- Dark red (weapons)
UPDATE categories SET color = '#0ea5e9' WHERE name = 'Medizinisch'; -- Sky blue (medical)
UPDATE categories SET color = '#7c3aed' WHERE name = 'FX-Requisiten'; -- Violet (special effects)
UPDATE categories SET color = '#84cc16' WHERE name = 'Textilien'; -- Lime (textiles)

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Color enhancement completed successfully!';
  RAISE NOTICE '🎨 Characters now have distinct colors for badges';
  RAISE NOTICE '🏷️ Categories have thematic colors for organization';
  RAISE NOTICE '📊 Item table rows will show subtle category color backgrounds';
  RAISE NOTICE '🎯 Ready to use the enhanced colorful UI!';
END $$;