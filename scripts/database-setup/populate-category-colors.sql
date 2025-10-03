-- Populate category colors with distinct, meaningful colors
-- Run this script in Supabase SQL Editor

-- Update categories with thematic colors
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
  RAISE NOTICE 'Category colors populated successfully!';
  RAISE NOTICE 'All categories now have thematic colors for better visual organization.';
END $$;