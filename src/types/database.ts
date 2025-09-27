export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          color?: string
          created_at?: string
        }
      }
      user_departments: {
        Row: {
          user_id: string
          department_id: string
        }
        Insert: {
          user_id: string
          department_id: string
        }
        Update: {
          user_id?: string
          department_id?: string
        }
      }
      characters: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          type: 'prop' | 'costume' | 'both'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          type?: 'prop' | 'costume' | 'both'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'prop' | 'costume' | 'both'
          created_at?: string
        }
      }
      items: {
        Row: {
          id: string
          name: string
          type: 'prop' | 'costume'
          scene: string | null
          status: 'erhalten' | 'in progress' | 'bestellt' | 'verloren' | 'klären' | 'reparatur benötigt' | 'anpassung benötigt'
          is_consumable: boolean
          needs_clarification: boolean
          needed_for_rehearsal: boolean
          source: 'Staatstheater' | 'Gekauft' | 'Produziert' | 'Darsteller*in' | null
          notes: string | null
          category_id: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'prop' | 'costume'
          scene?: string | null
          status?: 'erhalten' | 'in progress' | 'bestellt' | 'verloren' | 'klären' | 'reparatur benötigt' | 'anpassung benötigt'
          is_consumable?: boolean
          needs_clarification?: boolean
          needed_for_rehearsal?: boolean
          source?: 'Staatstheater' | 'Gekauft' | 'Produziert' | 'Darsteller*in' | null
          notes?: string | null
          category_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'prop' | 'costume'
          scene?: string | null
          status?: 'erhalten' | 'in progress' | 'bestellt' | 'verloren' | 'klären' | 'reparatur benötigt' | 'anpassung benötigt'
          is_consumable?: boolean
          needs_clarification?: boolean
          needed_for_rehearsal?: boolean
          source?: 'Staatstheater' | 'Gekauft' | 'Produziert' | 'Darsteller*in' | null
          notes?: string | null
          category_id?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      item_characters: {
        Row: {
          item_id: string
          character_id: string
        }
        Insert: {
          item_id: string
          character_id: string
        }
        Update: {
          item_id?: string
          character_id?: string
        }
      }
      item_files: {
        Row: {
          id: string
          item_id: string
          file_name: string
          file_path: string
          file_type: string
          file_size: number | null
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          item_id: string
          file_name: string
          file_path: string
          file_type: string
          file_size?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          item_id?: string
          file_name?: string
          file_path?: string
          file_type?: string
          file_size?: number | null
          uploaded_by?: string | null
          created_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          status: 'not_started' | 'in_progress' | 'done' | 'blocked'
          priority: 'low' | 'medium' | 'high' | 'urgent'
          due_date: string | null
          department_id: string | null
          assigned_to: string | null
          created_by: string | null
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          status?: 'not_started' | 'in_progress' | 'done' | 'blocked'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          department_id?: string | null
          assigned_to?: string | null
          created_by?: string | null
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          status?: 'not_started' | 'in_progress' | 'done' | 'blocked'
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          due_date?: string | null
          department_id?: string | null
          assigned_to?: string | null
          created_by?: string | null
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      task_tags: {
        Row: {
          id: string
          name: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          color?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          created_at?: string
        }
      }
      task_tag_assignments: {
        Row: {
          task_id: string
          tag_id: string
        }
        Insert: {
          task_id: string
          tag_id: string
        }
        Update: {
          task_id?: string
          tag_id?: string
        }
      }
      notes: {
        Row: {
          id: string
          title: string
          content: string | null
          content_html: string | null
          is_locked: boolean
          locked_by: string | null
          locked_at: string | null
          department_id: string | null
          created_by: string | null
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          content_html?: string | null
          is_locked?: boolean
          locked_by?: string | null
          locked_at?: string | null
          department_id?: string | null
          created_by?: string | null
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string | null
          content_html?: string | null
          is_locked?: boolean
          locked_by?: string | null
          locked_at?: string | null
          department_id?: string | null
          created_by?: string | null
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      note_versions: {
        Row: {
          id: string
          note_id: string
          content: string
          content_html: string | null
          version_number: number
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          note_id: string
          content: string
          content_html?: string | null
          version_number: number
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          note_id?: string
          content?: string
          content_html?: string | null
          version_number?: number
          created_by?: string | null
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'user'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'user'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'user'
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}