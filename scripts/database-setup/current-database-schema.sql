-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.categories (
                                   id uuid NOT NULL DEFAULT uuid_generate_v4(),
                                   name text NOT NULL UNIQUE,
                                   type text DEFAULT 'both'::text CHECK (type = ANY (ARRAY['prop'::text, 'costume'::text, 'both'::text])),
                                   created_at timestamp with time zone DEFAULT now(),
                                   CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.characters (
                                   id uuid NOT NULL DEFAULT uuid_generate_v4(),
                                   name text NOT NULL UNIQUE,
                                   description text,
                                   created_at timestamp with time zone DEFAULT now(),
                                   CONSTRAINT characters_pkey PRIMARY KEY (id)
);
CREATE TABLE public.departments (
                                    id uuid NOT NULL DEFAULT uuid_generate_v4(),
                                    name text NOT NULL UNIQUE,
                                    description text,
                                    color text DEFAULT '#6b7280'::text,
                                    created_at timestamp with time zone DEFAULT now(),
                                    CONSTRAINT departments_pkey PRIMARY KEY (id)
);
CREATE TABLE public.item_characters (
                                        item_id uuid NOT NULL,
                                        character_id uuid NOT NULL,
                                        CONSTRAINT item_characters_pkey PRIMARY KEY (item_id, character_id),
                                        CONSTRAINT item_characters_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id),
                                        CONSTRAINT item_characters_character_id_fkey FOREIGN KEY (character_id) REFERENCES public.characters(id)
);
CREATE TABLE public.item_files (
                                   id uuid NOT NULL DEFAULT uuid_generate_v4(),
                                   item_id uuid,
                                   file_name text NOT NULL,
                                   file_path text NOT NULL,
                                   file_type text NOT NULL,
                                   file_size integer,
                                   uploaded_by uuid,
                                   created_at timestamp with time zone DEFAULT now(),
                                   CONSTRAINT item_files_pkey PRIMARY KEY (id),
                                   CONSTRAINT item_files_item_id_fkey FOREIGN KEY (item_id) REFERENCES public.items(id),
                                   CONSTRAINT item_files_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES auth.users(id)
);
CREATE TABLE public.items (
                              id uuid NOT NULL DEFAULT uuid_generate_v4(),
                              name text NOT NULL,
                              type text NOT NULL CHECK (type = ANY (ARRAY['prop'::text, 'costume'::text])),
                              scene text,
                              status text DEFAULT 'klären'::text CHECK (status = ANY (ARRAY['erhalten'::text, 'in progress'::text, 'bestellt'::text, 'verloren'::text, 'klären'::text, 'reparatur benötigt'::text, 'anpassung benötigt'::text])),
                              is_consumable boolean DEFAULT false,
                              needs_clarification boolean DEFAULT false,
                              needed_for_rehearsal boolean DEFAULT false,
                              source text CHECK (source = ANY (ARRAY['Staatstheater'::text, 'Gekauft'::text, 'Produziert'::text, 'Darsteller*in'::text])),
                              notes text,
                              category_id uuid,
                              created_by uuid,
                              created_at timestamp with time zone DEFAULT now(),
                              updated_at timestamp with time zone DEFAULT now(),
                              CONSTRAINT items_pkey PRIMARY KEY (id),
                              CONSTRAINT items_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id),
                              CONSTRAINT items_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.note_versions (
                                      id uuid NOT NULL DEFAULT uuid_generate_v4(),
                                      note_id uuid,
                                      content text NOT NULL,
                                      content_html text,
                                      version_number integer NOT NULL,
                                      created_by uuid,
                                      created_at timestamp with time zone DEFAULT now(),
                                      CONSTRAINT note_versions_pkey PRIMARY KEY (id),
                                      CONSTRAINT note_versions_note_id_fkey FOREIGN KEY (note_id) REFERENCES public.notes(id),
                                      CONSTRAINT note_versions_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);
CREATE TABLE public.notes (
                              id uuid NOT NULL DEFAULT uuid_generate_v4(),
                              title text NOT NULL,
                              content text,
                              content_html text,
                              is_locked boolean DEFAULT false,
                              locked_by uuid,
                              locked_at timestamp with time zone,
                              department_id uuid,
                              created_by uuid,
                              created_at timestamp with time zone DEFAULT now(),
                              updated_at timestamp with time zone DEFAULT now(),
                              CONSTRAINT notes_pkey PRIMARY KEY (id),
                              CONSTRAINT notes_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id),
                              CONSTRAINT notes_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
                              CONSTRAINT notes_locked_by_fkey FOREIGN KEY (locked_by) REFERENCES auth.users(id)
);
CREATE TABLE public.task_tag_assignments (
                                             task_id uuid NOT NULL,
                                             tag_id uuid NOT NULL,
                                             CONSTRAINT task_tag_assignments_pkey PRIMARY KEY (task_id, tag_id),
                                             CONSTRAINT task_tag_assignments_task_id_fkey FOREIGN KEY (task_id) REFERENCES public.tasks(id),
                                             CONSTRAINT task_tag_assignments_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.task_tags(id)
);
CREATE TABLE public.task_tags (
                                  id uuid NOT NULL DEFAULT uuid_generate_v4(),
                                  name text NOT NULL UNIQUE,
                                  color text DEFAULT '#6b7280'::text,
                                  created_at timestamp with time zone DEFAULT now(),
                                  category text CHECK (category = ANY (ARRAY['Bereich'::text, 'Typ'::text])),
                                  CONSTRAINT task_tags_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tasks (
                              id uuid NOT NULL DEFAULT uuid_generate_v4(),
                              title text NOT NULL,
                              description text,
                              status text DEFAULT 'not_started'::text CHECK (status = ANY (ARRAY['not_started'::text, 'in_progress'::text, 'done'::text, 'blocked'::text])),
                              priority text DEFAULT 'medium'::text CHECK (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'urgent'::text])),
                              due_date date,
                              department_id uuid,
                              assigned_to uuid,
                              created_by uuid,
                              created_at timestamp with time zone DEFAULT now(),
                              updated_at timestamp with time zone DEFAULT now(),
                              CONSTRAINT tasks_pkey PRIMARY KEY (id),
                              CONSTRAINT tasks_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id),
                              CONSTRAINT tasks_assigned_to_fkey FOREIGN KEY (assigned_to) REFERENCES auth.users(id),
                              CONSTRAINT tasks_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id)
);