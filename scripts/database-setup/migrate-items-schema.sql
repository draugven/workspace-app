-- Database Migration: Update Items Schema for CSV Import
-- Migrates items table to support new CSV format and requirements

-- Step 1: Add new columns to items table
ALTER TABLE items
ADD COLUMN is_used BOOLEAN DEFAULT FALSE,
ADD COLUMN is_changeable BOOLEAN DEFAULT TRUE;

-- Step 2: Remove obsolete columns
ALTER TABLE items
DROP COLUMN IF EXISTS needs_clarification,
DROP COLUMN IF EXISTS needed_for_rehearsal;

-- Step 3: Update status constraint with new values
ALTER TABLE items
DROP CONSTRAINT IF EXISTS items_status_check;

ALTER TABLE items
ADD CONSTRAINT items_status_check
CHECK (status IN ('in progress', 'klären', 'bestellt', 'erhalten', 'fehlt', 'reparatur', 'anpassung'));

-- Step 4: Update source constraint with new values
ALTER TABLE items
DROP CONSTRAINT IF EXISTS items_source_check;

ALTER TABLE items
ADD CONSTRAINT items_source_check
CHECK (source IN ('Staatstheater', 'Gekauft', 'Produziert', 'Ausleihe', 'Spende'));

-- Step 5: Update default status value
ALTER TABLE items
ALTER COLUMN status SET DEFAULT 'in progress';

-- Step 6: Add color column to categories table
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#6b7280';

-- Step 7: Update any existing data to match new constraints (if needed)
-- Convert old status values to new ones
UPDATE items SET status = 'reparatur' WHERE status = 'reparatur benötigt';
UPDATE items SET status = 'anpassung' WHERE status = 'anpassung benötigt';
UPDATE items SET status = 'fehlt' WHERE status = 'verloren';

-- Convert old source values to new ones
UPDATE items SET source = 'Ausleihe' WHERE source = 'Darsteller*in';

-- Step 8: Comment for business logic
COMMENT ON COLUMN items.is_changeable IS 'Only relevant for items with source Staatstheater or Ausleihe';
COMMENT ON COLUMN categories.color IS 'Hex color code for UI display, similar to task tags';

-- Verify migration
SELECT 'Migration completed successfully' as status;