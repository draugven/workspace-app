-- Theater Production Collaboration Tool - Database Schema
-- Based on Dracula Musical production requirements

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Departments table
CREATE TABLE departments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6b7280', -- Default gray color
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Characters table
CREATE TABLE characters (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prop/Costume Categories
CREATE TABLE categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('prop', 'costume', 'both')) DEFAULT 'both',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Props/Items table (combines props and costumes)
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

-- Item-Character relationships (many-to-many)
CREATE TABLE item_characters (
  item_id UUID REFERENCES items(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE CASCADE,
  PRIMARY KEY (item_id, character_id)
);

-- Item images/files
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

-- Task tags (for flexible categorization)
CREATE TABLE task_tags (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#6b7280',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Task-Tag relationships (many-to-many)
CREATE TABLE task_tag_assignments (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES task_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

-- Notes table (collaborative notes)
CREATE TABLE notes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT, -- Markdown content
  content_html TEXT, -- Rendered HTML for display
  is_locked BOOLEAN DEFAULT FALSE,
  locked_by UUID REFERENCES auth.users(id),
  locked_at TIMESTAMP WITH TIME ZONE,
  department_id UUID REFERENCES departments(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Note versions (for change tracking)
CREATE TABLE note_versions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_html TEXT,
  version_number INTEGER NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_department ON tasks(department_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_notes_department ON notes(department_id);
CREATE INDEX idx_notes_updated_at ON notes(updated_at);

-- Row Level Security (RLS) policies will be added after Supabase setup
-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_items_updated_at BEFORE UPDATE ON items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_notes_updated_at BEFORE UPDATE ON notes FOR EACH ROW EXECUTE FUNCTION update_notes_updated_at_column();