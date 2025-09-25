-- Seed data for Theater Production App
-- Run this after creating the main schema

-- Insert departments
INSERT INTO departments (name, description, color) VALUES
('Props', 'Props and set pieces management', '#8b5cf6'),
('Costumes', 'Costume design and wardrobe', '#ec4899'),
('Set Design', 'Set design and construction', '#f59e0b'),
('Administrative', 'Production administration and planning', '#6b7280'),
('Tech', 'Technical production including lighting and sound', '#10b981');

-- Insert characters from CSV data
INSERT INTO characters (name, description) VALUES
('Dracula', 'The main antagonist'),
('Jonathan Harker', 'Young lawyer'),
('Mina Murray', 'Jonathan''s fiancée, later wife'),
('Lucy Westenra', 'Mina''s best friend'),
('Arthur Holmwood', 'Lucy''s fiancé'),
('Jack Seward', 'Doctor and Lucy''s suitor'),
('Quincey Morris', 'American cowboy and Lucy''s suitor'),
('Van Helsing', 'Dutch professor and vampire hunter'),
('Renfield', 'Dracula''s devoted servant'),
('Wirtin', 'Innkeeper'),
('Vampirellas', 'Dracula''s vampire brides'),
('Ensemble', 'Chorus members');

-- Insert categories based on CSV Tag column
INSERT INTO categories (name, type) VALUES
('Taschen & Koffer', 'both'),
('Möbel', 'prop'),
('Floristik', 'prop'),
('Religiös', 'prop'),
('Accessoires', 'both'),
('Schreibgeräte', 'prop'),
('Papierwaren', 'prop'),
('Schmuck', 'costume'),
('Diverse', 'both'),
('Essen & Trinken', 'prop'),
('Waffen', 'prop'),
('Medizinisch', 'prop'),
('FX-Requisiten', 'prop'),
('Textilien', 'both');

-- Insert task tags from markdown analysis
INSERT INTO task_tags (name, color) VALUES
('kostüme', '#ec4899'),
('props', '#8b5cf6'),
('technik', '#10b981'),
('administrative', '#6b7280'),
('maske', '#f97316'),
('licht', '#eab308'),
('audio', '#06b6d4'),
('av', '#8b5cf6'),
('reparatur', '#ef4444'),
('bestellung', '#3b82f6'),
('anprobe', '#ec4899'),
('organisation', '#6b7280'),
('finanzen', '#059669'),
('dokumentation', '#6366f1'),
('kommunikation', '#06b6d4'),
('handwerk', '#f59e0b'),
('transport', '#84cc16'),
('planung', '#8b5cf6'),
('casting', '#ec4899'),
('aufführung', '#ef4444'),
('spezialeffekte', '#8b5cf6'),
('neu-besetzt', '#f97316'),
('dringend', '#ef4444');

-- Sample users (passwords would be hashed in real implementation)
INSERT INTO users (email, password_hash, full_name) VALUES
('liza@theater.com', '$2a$10$dummy_hash_for_liza', 'Liza'),
('tanja@theater.com', '$2a$10$dummy_hash_for_tanja', 'Tanja'),
('werner.d@theater.com', '$2a$10$dummy_hash_for_werner_d', 'Werner D.'),
('werner.k@theater.com', '$2a$10$dummy_hash_for_werner_k', 'Werner K.'),
('elisa@theater.com', '$2a$10$dummy_hash_for_elisa', 'Elisa');

-- Assign users to departments
INSERT INTO user_departments (user_id, department_id)
SELECT u.id, d.id
FROM users u, departments d
WHERE (u.full_name = 'Liza' AND d.name IN ('Props', 'Costumes'))
   OR (u.full_name = 'Tanja' AND d.name = 'Props')
   OR (u.full_name = 'Werner D.' AND d.name IN ('Administrative', 'Set Design'))
   OR (u.full_name = 'Werner K.' AND d.name = 'Tech')
   OR (u.full_name = 'Elisa' AND d.name IN ('Administrative', 'Costumes'));

-- Create a sample note
INSERT INTO notes (title, content, content_html, department_id, created_by)
SELECT
  'Production Notes - Dracula',
  '# Dracula Musical Production Notes

## Key Dates
- Performance: January 14-15, 2026

## Important Reminders
- Focus on mobile-responsive design for venue use
- Keep track of borrowed items from Staatstheater
- Maintain version control for all changes

## Next Steps
- Complete props inventory
- Schedule final costume fittings
- Confirm technical requirements',
  '<h1>Dracula Musical Production Notes</h1><h2>Key Dates</h2><ul><li>Performance: January 14-15, 2026</li></ul><h2>Important Reminders</h2><ul><li>Focus on mobile-responsive design for venue use</li><li>Keep track of borrowed items from Staatstheater</li><li>Maintain version control for all changes</li></ul><h2>Next Steps</h2><ul><li>Complete props inventory</li><li>Schedule final costume fittings</li><li>Confirm technical requirements</li></ul>',
  d.id,
  u.id
FROM departments d, users u
WHERE d.name = 'Administrative' AND u.full_name = 'Liza';

-- Note: Items and tasks will be populated through a separate script that parses the CSV files
-- This is because the CSV data has complex relationships that need proper parsing