-- Theater Production Collaboration Tool - Complete Database Setup
-- Run this entire script in Supabase SQL Editor to set up everything

-- Step 1: Create Extensions and Tables
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Note: Using Supabase Auth (auth.users) instead of custom users table
-- No need to create users table - Supabase handles authentication

-- Departments table
CREATE TABLE departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6b7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Characters table
CREATE TABLE characters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('prop', 'costume', 'both')) DEFAULT 'both',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Items table (props and costumes)
CREATE TABLE items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('prop', 'costume')) NOT NULL,
  scene TEXT,
  status TEXT CHECK (status IN ('erhalten', 'in progress', 'bestellt', 'verloren', 'klären', 'reparatur benötigt', 'anpassung benötigt')) DEFAULT 'klären',
  is_consumable BOOLEAN DEFAULT FALSE,
  needs_clarification BOOLEAN DEFAULT FALSE,
  needed_for_rehearsal BOOLEAN DEFAULT FALSE,
  source TEXT CHECK (source IN ('Staatstheater', 'Gekauft', 'Produziert', 'Darsteller*in')),
  notes TEXT,
  category_id UUID REFERENCES categories(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Item-Character relationships
CREATE TABLE item_characters (
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, character_id)
);

-- Item files
CREATE TABLE item_files (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('not_started', 'in_progress', 'done', 'blocked')) DEFAULT 'not_started',
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  due_date DATE,
  department_id UUID REFERENCES departments(id),
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task tags
CREATE TABLE task_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#6b7280',
  category TEXT CHECK (category IN ('Bereich', 'Typ')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task-Tag relationships
CREATE TABLE task_tag_assignments (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES task_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

-- Notes table
CREATE TABLE notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  content_html TEXT,
  is_locked BOOLEAN DEFAULT FALSE,
  locked_by UUID REFERENCES auth.users(id),
  locked_at TIMESTAMP WITH TIME ZONE,
  department_id UUID REFERENCES departments(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note versions
CREATE TABLE note_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_html TEXT,
  version_number INTEGER NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Create Indexes
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_department ON tasks(department_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_notes_department ON notes(department_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at);

-- Step 3: Create Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 4: Insert Initial Data

-- Insert departments
INSERT INTO departments (name, description, color) VALUES
('Requisiten', 'Requisiten management', '#8b5cf6'),
('Kostüme', 'Costume design and wardrobe', '#ec4899'),
('Set Design', 'Set design and construction', '#f59e0b'),
('Administrative', 'Production administration and planning', '#6b7280'),
('Tech', 'Technical production including lighting and sound', '#10b981');

-- Insert characters
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

-- Insert categories
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

-- Insert task tags
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

-- Note: Users are managed through Supabase Auth
-- Create users through the application interface or Supabase Dashboard
-- No need to insert sample users here

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully!';
  RAISE NOTICE 'Tables created, indexes added, and initial data inserted.';
  RAISE NOTICE 'You can now run the items and tasks seed scripts if desired.';
END $$;