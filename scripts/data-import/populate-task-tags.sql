-- Add category column to task_tags table
ALTER TABLE task_tags ADD COLUMN IF NOT EXISTS category TEXT CHECK (category IN ('Bereich', 'Typ'));

-- Populate task_tags with new tags from the updated todo structure

-- **Bereich** (Domain/Area) Tags
INSERT INTO task_tags (name, color, category) VALUES
('kostüme', '#ec4899', 'Bereich'),       -- Pink for costumes
('props', '#8b5cf6', 'Bereich'),         -- Purple for props
('technik', '#10b981', 'Bereich'),       -- Green for tech
('administrative', '#6b7280', 'Bereich'), -- Gray for admin
('av', '#3b82f6', 'Bereich');            -- Blue for audio/video

-- **Typ** (Type) Tags
INSERT INTO task_tags (name, color, category) VALUES
('bestellung', '#22c55e', 'Typ'),        -- Green for orders
('reparatur', '#f97316', 'Typ'),         -- Orange for repairs
('finanzen', '#059669', 'Typ'),          -- Teal for finances
('dokumentation', '#64748b', 'Typ'),     -- Slate for documentation
('kommunikation', '#3b82f6', 'Typ'),     -- Blue for communication
('sfx', '#be123c', 'Typ'),              -- Red for special effects
('marketing', '#dc2626', 'Typ'),         -- Red for marketing
('bühnenaufbau', '#84cc16', 'Typ'),      -- Lime for stage construction
('neu', '#06b6d4', 'Typ'),              -- Cyan for new items
('content', '#8b5cf6', 'Typ'),          -- Purple for content
('perücken', '#f59e0b', 'Typ'),         -- Amber for wigs
('schule', '#6366f1', 'Typ'),           -- Indigo for school
('location', '#0891b2', 'Typ');         -- Cyan for location

-- Verify the insert
SELECT
    category,
    COUNT(*) as count,
    array_agg(name ORDER BY name) as tags
FROM task_tags
WHERE category IS NOT NULL
GROUP BY category
ORDER BY category;