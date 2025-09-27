# Claude Code Configuration

## Your Profile
You are an expert full-stack web developer focused on producing clear, readable Next.js code.
You always use the latest stable versions of Next.js 14, Supabase, TailwindCSS, and TypeScript.

## Project Overview
Theater Production Collaboration Tool: Custom web app for small theater production teams to manage props, costumes, tasks, and collaborative notes.

## Core Features

### Database & Tables
- Requisiten tables with cross-references and customizable views
- Property types: text, date, dropdown, file links, status
- Filter by department, priority, status

### Task Management
- Multi-status todos: Not Started → In Progress → Done/Blocked
- Department grouping (Bereich/Typ categorization), due dates, assignees
- Drag-and-drop Kanban board + table views with searchable filters
- Text search across titles, descriptions, and tags

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
- **Requisiten**: Complete CRUD with file uploads
- **Task Management**: Interactive Kanban + table with drag-and-drop, assignees, search, department colors
- **Collaborative Notes**: Real-time Tiptap editor with SSR fixes and lock cleanup
- **Database**: Clean schema using Supabase Auth users
- **UI/UX**: Compact design, searchable comboboxes, collapsible filters

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
- `items/page.tsx` - Requisiten management
- `tasks/page.tsx` - Task management (Kanban + table)
- `notes/page.tsx` - Collaborative notes
- `login/page.tsx` - Authentication
- `api/users/route.ts` - Users API endpoint (secure auth.users fetching)

### Components (`src/components/`)
- `auth/` - Authentication (AuthProvider, LoginForm, ProtectedRoute)
- `items/` - Requisiten (ItemsTable, ItemForm, ItemDetailDrawer, StatusBadge)
- `tasks/` - Task management (TaskBoard, TasksTable, TaskAddDialog, TaskEditDialog, PriorityBadge)
- `notes/` - Collaborative notes (NoteCard, NoteAddDialog, TiptapEditor + SSR wrapper)
- `files/` - File handling (FileUpload)
- `layout/` - Navigation
- `ui/` - Shadcn/ui components (Button, Dialog, Select, Combobox, PageHeader, StatsBar, etc.)

### Core Services (`src/`)
- `lib/supabase.ts` - Supabase client configuration
- `lib/utils.ts` - Utility functions
- `hooks/use-realtime-notes.tsx` - Real-time notes hook
- `types/` - TypeScript definitions (database.ts, index.ts)

### Database & Scripts
- `scripts/database-setup/` - Schema and setup (database-schema.sql, database-setup-complete.sql, supabase-storage-setup.sql, current-database-schema.sql)
- `scripts/data-import/` - Active data utilities (populate-task-tags.sql, cleanup-tasks.sql)
- `scripts/archive/` - Archived/obsolete scripts (cleanup-migration.sql, update-departments.sql, legacy-seed-data/)
- `scripts/` - Processing utilities (parse-todos.js, parse-csv-data.js, run-import.mjs)

## Known Technical Solutions
- **Tiptap SSR**: Use dynamic imports with `ssr: false` and `immediatelyRender: false`
- **Drag-and-drop**: Use @dnd-kit with rectIntersection collision detection
- **Select validation**: Use 'none' placeholder values, convert for database
- **Real-time cleanup**: Avoid `channel.off()` - Supabase channels don't support it

## TODO Backlog

### Active Tasks
1. **Archive legacy scripts** - Review and archive remaining obsolete data import/processing scripts
2. **Offline capabilities strategy** - Research and plan options for offline data access

### New Feature Requests
3. **Private content functionality** - Add privacy toggle for notes and tasks (creator-only visibility) in add/edit dialogs
4. ~~**Department assignment for notes** - Add department selection to note edit dialog~~ ✅ **COMPLETED**
5. ~~**Rename Items to Requisiten** - Change "Props" terminology to "Requisiten" throughout (Kostüme will be separate later)~~ ✅ **COMPLETED**
6. ~~**Remove Dashboard nav item** - Remove redundant navigation since logo already links to dashboard~~ ✅ **COMPLETED**
7. **Typography and styling updates** - General design improvements (requires input on preferences)
8. **Dark theme implementation** - Add dark mode support (requires input on design approach)
9. **Admin role and deletion** - Implement admin role with delete permissions for notes, tasks, and items
10. **Done task management** - Strategy for completed tasks (hide after X days, archive, etc.)
11. **Mobile UI optimization** - Improve mobile responsiveness across all views
12. **Note versioning review** - Investigate current note version saving and potential usage
13. **Rich text link support** - Add hyperlink functionality to note editor
14. **Task description rich text** - Replace plain text task descriptions with rich text editor
15. **Branding updates** - Replace logo and add custom favicon
16. **Deployment setup** - Prepare and deploy application
17. ~~**German localization** - Translate navigation bar items and dashboard text to German~~ ✅ **COMPLETED**

## Recent Development History

### Major Features Completed
- **Assignee System**: Full user assignment functionality with auth.users integration
- **Search & Filters**: Comprehensive text search and searchable comboboxes
- **UI Optimization**: Compact design with collapsible filters and department color coding
- **Database Cleanup**: Archived obsolete scripts, fixed lock mechanisms
- **Navigation Cleanup**: Removed redundant Dashboard navigation item (logo already navigates home)
- **Note Department Assignment**: Added department selection to note editing with real-time updates
- **Terminology Update**: Changed "Props" to "Requisiten" throughout application for German terminology consistency
- **German Localization**: Translated navigation and dashboard to German (Tasks→Aufgaben, Notes→Notizen, etc.)
