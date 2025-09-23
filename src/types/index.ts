// Application types based on database schema

export interface User {
  id: string
  email: string
  full_name: string
  created_at: string
}

export interface Department {
  id: string
  name: string
  description?: string
  color: string
  created_at: string
}

export interface Character {
  id: string
  name: string
  description?: string
  created_at: string
}

export interface Category {
  id: string
  name: string
  type: 'prop' | 'costume' | 'both'
  created_at: string
}

export interface Item {
  id: string
  name: string
  type: 'prop' | 'costume'
  scene?: string
  status: 'erhalten' | 'in progress' | 'bestellt' | 'verloren' | 'klären' | 'reparatur benötigt' | 'anpassung benötigt'
  is_consumable: boolean
  needs_clarification: boolean
  needed_for_rehearsal: boolean
  source?: 'Staatstheater' | 'Gekauft' | 'Produziert' | 'Darsteller*in'
  notes?: string
  category_id?: string
  created_by?: string
  created_at: string
  updated_at: string
  // Relations
  category?: Category
  characters?: Character[]
  files?: ItemFile[]
}

export interface ItemFile {
  id: string
  item_id: string
  file_name: string
  file_path: string
  file_type: string
  file_size?: number
  uploaded_by?: string
  created_at: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'not_started' | 'in_progress' | 'done' | 'blocked'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date?: string
  department_id?: string
  assigned_to?: string
  created_by?: string
  created_at: string
  updated_at: string
  // Relations
  department?: Department
  tags?: TaskTag[]
}

export interface TaskTag {
  id: string
  name: string
  color: string
  created_at: string
}

export interface Note {
  id: string
  title: string
  content?: string
  content_html?: string
  is_locked: boolean
  locked_by?: string
  locked_at?: string
  department_id?: string
  created_by?: string
  created_at: string
  updated_at: string
  // Relations
  department?: Department
  versions?: NoteVersion[]
}

export interface NoteVersion {
  id: string
  note_id: string
  content: string
  content_html?: string
  version_number: number
  created_by?: string
  created_at: string
}