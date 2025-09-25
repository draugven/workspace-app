# Claude Code Configuration

## Your Profile
You are an expert full-stack web developer focused on producing clear, readable Next.js code.
You always use the latest stable versions of Next.js 14, Supabase, TailwindCSS, and TypeScript.

## Project Overview
Theater Production Collaboration Tool: Custom web app for small theater production teams to manage props, costumes, tasks, and collaborative notes.

## Core Features

### Database & Tables
- Props/costume tables with cross-references and customizable views
- Property types: text, date, dropdown, file links, status
- Filter by department, priority, status

### Task Management
- Multi-status todos: Not Started → In Progress → Done/Blocked
- Department grouping (Bereich/Typ categorization), due dates
- Drag-and-drop Kanban board + table views
- NO user assignments (uses Supabase Auth for creators only)

### Collaborative Notes
- Real-time rich text editor with conflict detection
- User presence indicators and version tracking

## Tech Stack
- Next.js 14+ (App Router, TypeScript)
- Supabase (PostgreSQL, Auth, Storage, real-time)
- Tailwind CSS + Shadcn/ui
- Tiptap editor, @dnd-kit, Tanstack Table

## Implementation Status

### ✅ Completed Features
- **Authentication**: Supabase Auth with protected routes
- **Props & Costumes**: Complete CRUD with file uploads
- **Task Management**: Interactive Kanban + table with drag-and-drop
- **Collaborative Notes**: Real-time Tiptap editor with SSR fixes
- **Data Import**: Dracula production markdown parser (54 tasks imported)
- **Database**: Clean schema using Supabase Auth users (no custom user tables)

### 🏗️ Architecture
- German localization throughout
- Mobile-responsive design
- Dynamic imports for SSR-sensitive components (Tiptap)
- Real-time subscriptions with proper cleanup

## Technical Preferences
- kebab-case component names (my-component.tsx)
- Favor React Server Components
- Minimize client components ('use client')
- Always add loading/error states
- Semantic HTML elements

## General Preferences
- Follow requirements to the letter
- Bug-free, fully functional code
- Readability over performance
- No todos, placeholders, or missing pieces
- Reference file names in responses
- Be concise
- If you do not know the answer, say so
- If you think the question is wrong, say so
- Be critical
- **ALWAYS update the Project Structure section in CLAUDE.md immediately after making any changes to project file organization, folder structure, or file locations**

## Project Structure

### Core App Routes (`src/app/`)
- `page.tsx` - Dashboard/home page
- `items/page.tsx` - Props & costumes management
- `tasks/page.tsx` - Task management (Kanban + table)
- `notes/page.tsx` - Collaborative notes
- `login/page.tsx` - Authentication
- `import/page.tsx` - Data import interface
- `api/import/dracula-todos/route.ts` - Import API endpoint
- `api/users/route.ts` - Users API endpoint (secure auth.users fetching)

### Components (`src/components/`)
- `auth/` - Authentication (AuthProvider, LoginForm, ProtectedRoute)
- `items/` - Props/costumes (ItemsTable, ItemForm, ItemDetailDrawer, StatusBadge)
- `tasks/` - Task management (TaskBoard, TasksTable, TaskAddDialog, TaskEditDialog, PriorityBadge)
- `notes/` - Collaborative notes (NoteCard, NoteAddDialog, TiptapEditor + SSR wrapper)
- `files/` - File handling (FileUpload)
- `layout/` - Navigation
- `ui/` - Shadcn/ui components (Button, Dialog, Select, etc.)

### Core Services (`src/`)
- `lib/supabase.ts` - Supabase client configuration
- `lib/utils.ts` - Utility functions
- `lib/import-todos.ts` - Data import logic
- `hooks/use-realtime-notes.tsx` - Real-time notes hook
- `types/` - TypeScript definitions (database.ts, index.ts)

### Database & Scripts
- `scripts/database-setup/` - Schema and setup (database-schema.sql, supabase-storage-setup.sql, cleanup-migration.sql)
- `scripts/data-import/` - Seed data (seed-data.sql, items-seed-data.sql, tasks-seed-data.sql, update-departments.sql)
- `scripts/` - Processing utilities (parse-todos.js, parse-csv-data.js, run-import.mjs)

## Known Technical Solutions
- **Tiptap SSR**: Use dynamic imports with `ssr: false` and `immediatelyRender: false`
- **Drag-and-drop**: Use @dnd-kit with rectIntersection collision detection
- **Select validation**: Use 'none' placeholder values, convert for database
- **Real-time cleanup**: Avoid `channel.off()` - Supabase channels don't support it

## TODO Backlog

### Task Management Improvements
1. ✅ **Sort tags alphabetically** - COMPLETED: Tasks Kanban + table views now sort tags in ascending order within each task
2. ✅ **Table column sorting** - COMPLETED: Tasks table now has sortable "Abteilung" and "Tags" columns
3. ✅ **Restore assignee functionality** - COMPLETED: Full assignee system implemented:
   - ✅ Assignee dropdown in add/edit task dialogs (populated from auth.users via secure API, preselects current user)
   - ✅ Assignee display in Kanban task cards
   - ✅ Assignee column in table view (sortable, last position)
   - ✅ Assignee filter dropdown with "Unassigned" option
4. ✅ **Add text search** - COMPLETED: Tasks now have comprehensive text search functionality that searches titles, descriptions, and tags with real-time filtering

### Database & Scripts Maintenance
5. **Validate database setup scripts** - Check if scripts/database-setup/* are current with notes/tasks structure changes

### Notes Issues
6. **Fix "Gesperrt" counter** - Shows "1" when only one app instance is open

### Code Cleanup
7. **Remove import UI** - Clean up all todos import related UI code and components
8. **Remove test page** - Delete `src/app/test/page.tsx` and any related test logic not used elsewhere

### UI/UX Optimization
9. **Optimize page layouts** - Improve counter/filter/overview sections on Props & Costumes, Tasks, Notes pages (taking too much vertical space)
10. **Convert dropdowns to comboboxes** - Make "department" and "assignee" dropdowns searchable comboboxes for better UX

### Strategic Features
11. **Offline capabilities strategy** - Research and plan options for offline data access

## 18:23 25.09.2025 – Compact Session

### CurrentFocus
Implemented comprehensive assignee functionality for task management with secure auth.users integration.

### SessionChanges
- Sorted tags alphabetically in both Kanban and table task views
- Added sortable "Abteilung" and "Tags" columns to tasks table
- Created secure server-side API route `/api/users` for fetching auth.users data
- Added assignee dropdown to add/edit task dialogs with current user preselection
- Displayed assignee information in Kanban task cards with user lookup
- Added sortable assignee column to tasks table view (last position)
- Implemented assignee filter dropdown with "Unassigned" option
- Updated task creation/editing to handle assignee assignments properly
- Committed comprehensive assignee functionality (feat: 7 files, +225/-39 lines)
