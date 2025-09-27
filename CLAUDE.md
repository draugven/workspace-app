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

### ✅ Core System Complete
- **Authentication**: Supabase Auth with protected routes and admin role system
- **Requisiten Management**: Full CRUD with file uploads, search, and filtering
- **Task Management**: Kanban + table views with drag-and-drop, assignees, rich text descriptions
- **Collaborative Notes**: Rich text editor with hyperlink support and department assignment
- **Admin System**: App-level security with delete permissions (no RLS complexity)
- **UI/UX**: German localization, compact design, mobile-responsive

### ⚠️ Known Issues
- **Real-time Updates**: WebSocket connections fail, requiring manual refresh after changes
- **Mobile Optimization**: Needs improvement across all views

## Technical Preferences
- kebab-case component names (my-component.tsx)
- Favor React Server Components
- Minimize client components ('use client')
- Always add loading/error states
- Semantic HTML elements
- **ALWAYS run `npm run lint` and `npm run typecheck` after implementing large functionality or refactoring**

## Version Management
**Current Version**: `0.5.0`

Follow semantic versioning (SemVer) when creating commits and updating package.json version:

**MAJOR.MINOR.PATCH** - Increment the:
- **MAJOR** version when you make incompatible API changes
- **MINOR** version when you add functionality in a backward compatible manner
- **PATCH** version when you make backward compatible bug fixes

**Version Update Guidelines**:
- Follow SemVer: MAJOR.MINOR.PATCH for breaking/feature/fix changes
- Update both `package.json` and CLAUDE.md version before committing
- Use conventional commit messages (feat:, fix:, BREAKING CHANGE:)

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
- `api/admin/items/[id]/route.ts` - Admin-only item deletion endpoint
- `api/admin/tasks/[id]/route.ts` - Admin-only task deletion endpoint
- `api/admin/notes/[id]/route.ts` - Admin-only note deletion endpoint

### Components (`src/components/`)
- `auth/` - Authentication (AuthProvider, LoginForm, ProtectedRoute)
- `items/` - Requisiten (ItemsTable, ItemForm, ItemDetailDrawer, StatusBadge)
- `tasks/` - Task management (TaskBoard, TasksTable, TaskAddDialog, TaskEditDialog, PriorityBadge, TaskDescriptionEditor)
- `notes/` - Collaborative notes (NoteCard, NoteAddDialog, TiptapEditor + SSR wrapper)
- `files/` - File handling (FileUpload)
- `layout/` - Navigation, Footer (version display)
- `ui/` - Shadcn/ui components (Button, Dialog, Select, Combobox, PageHeader, StatsBar, etc.)

### Core Services (`src/`)
- `lib/supabase.ts` - Supabase client configuration
- `lib/auth-utils.ts` - Server-side admin utilities and role checking
- `lib/utils.ts` - Utility functions
- `hooks/use-admin-check.tsx` - Client-side admin role checking hook
- `hooks/use-realtime-notes.tsx` - Real-time notes hook
- `types/` - TypeScript definitions (database.ts, index.ts)

### Database & Scripts
- `scripts/database-setup/` - Schema and setup (database-schema.sql, database-setup-complete.sql, supabase-storage-setup.sql, current-database-schema.sql, disable-rls-simplify.sql, assign-admin-role.sql, setup-default-user-roles.sql, SETUP-SIMPLIFIED-ADMIN.md)
- `scripts/data-import/` - Active data utilities (populate-task-tags.sql, cleanup-tasks.sql)
- `scripts/archive/` - Archived/obsolete scripts (cleanup-migration.sql, update-departments.sql, legacy-seed-data/)
- `scripts/` - Processing utilities (parse-todos.js, parse-csv-data.js, run-import.mjs)

## Known Technical Solutions
- **Tiptap SSR**: Use dynamic imports with `ssr: false` and `immediatelyRender: false`
- **Drag-and-drop**: Use @dnd-kit with rectIntersection collision detection
- **Select validation**: Use 'none' placeholder values, convert for database
- **Real-time cleanup**: Avoid `channel.off()` - Supabase channels don't support it
- **Database schema changes**: When adding/removing table columns, ALWAYS update both database schema AND TypeScript types in `src/types/database.ts`
- **Supabase typing workaround**: Use `(supabase as any)` for insert/update operations when TypeScript inference fails (temporary solution until better typing)
- **Admin system architecture**: App-level security without RLS complexity. Client-side admin checks for UI, server-side validation in API routes using Authorization headers. No RLS policies needed for single-app use cases
- **Real-time issues**: WebSocket connections close before establishing. Use manual refresh after data changes until resolved

## TODO Backlog

### High Priority
1. **Real-time data synchronization** - Fix WebSocket connection issues preventing real-time updates. Critical for multi-user collaboration
2. **Task ranking within priority** - Add drag-and-drop ranking within status/priority columns for better task organization
3. **Mobile UI optimization** - Improve responsiveness across all views for mobile devices

### Medium Priority
4. **Done task management** - Strategy for completed tasks (archive, hide after X days, etc.)
5. **Typography and styling updates** - General design improvements
6. **Dark theme implementation** - Add dark mode support
7. **Branding updates** - Replace logo and add custom favicon
8. **Deployment setup** - Prepare and deploy application

### Low Priority
9. **Archive legacy scripts** - Clean up obsolete data import/processing scripts
10. **Note versioning review** - Investigate current note version saving potential
11. **Offline capabilities strategy** - Research offline data access options

## Recent Major Changes

### v0.5.0 - Simplified Admin System (Sept 2024)
- **BREAKING CHANGE**: Removed RLS policies in favor of app-level security
- Implemented admin delete functionality for all entity types
- Added Authorization header authentication for API routes

### v0.2.0 - Rich Text & Versioning (Sept 2024)
- Added Tiptap rich text editor with hyperlink support for notes and tasks
- Implemented semantic versioning workflow and deployment tracking
- Added privacy toggles for creator-only content visibility

## Development Sessions

### Sept 2024 - Admin System Overhaul
**Key Achievement**: Replaced complex RLS with simplified app-level admin security
- Resolved infinite recursion in authentication policies
- Created admin-only API routes with Authorization header validation
- Added admin delete functionality with confirmation dialogs across all entities
- Fixed authentication consistency and implemented manual refresh workarounds

### Sept 2024 - Rich Text & Build Fixes
**Key Achievement**: Enhanced editor functionality and resolved TypeScript issues
- Added Tiptap Link extension with Cmd+K/Ctrl+K shortcuts to notes
- Created TaskDescriptionEditor for rich text in task descriptions
- Fixed comprehensive TypeScript build errors and ESLint warnings
- Implemented privacy toggles for creator-only content visibility
