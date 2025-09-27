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

## Version Management
**Current Version**: `0.2.0`

Follow semantic versioning (SemVer) when creating commits and updating package.json version:

**MAJOR.MINOR.PATCH** - Increment the:
- **MAJOR** version when you make incompatible API changes
- **MINOR** version when you add functionality in a backward compatible manner
- **PATCH** version when you make backward compatible bug fixes

**Version Update Guidelines**:
- Always update `package.json` version number when committing significant changes
- Update the "Current Version" in this CLAUDE.md file to match
- Use conventional commit messages with version context (feat:, fix:, BREAKING CHANGE:)

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
- `tasks/` - Task management (TaskBoard, TasksTable, TaskAddDialog, TaskEditDialog, PriorityBadge, TaskDescriptionEditor)
- `notes/` - Collaborative notes (NoteCard, NoteAddDialog, TiptapEditor + SSR wrapper)
- `files/` - File handling (FileUpload)
- `layout/` - Navigation, Footer (version display)
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
- **Database schema changes**: When adding/removing table columns, ALWAYS update both database schema AND TypeScript types in `src/types/database.ts`
- **Supabase typing workaround**: Use `(supabase as any)` for insert/update operations when TypeScript inference fails (temporary solution until better typing)

## TODO Backlog

### Active Tasks
1. **Archive legacy scripts** - Review and archive remaining obsolete data import/processing scripts
2. **Offline capabilities strategy** - Research and plan options for offline data access

### New Feature Requests
3. ~~**Private content functionality** - Add privacy toggle for notes and tasks (creator-only visibility) in add/edit dialogs~~ ✅ **COMPLETED**
4. ~~**Department assignment for notes** - Add department selection to note edit dialog~~ ✅ **COMPLETED**
5. ~~**Rename Items to Requisiten** - Change "Props" terminology to "Requisiten" throughout (Kostüme will be separate later)~~ ✅ **COMPLETED**
6. ~~**Remove Dashboard nav item** - Remove redundant navigation since logo already links to dashboard~~ ✅ **COMPLETED**
7. **Typography and styling updates** - General design improvements (requires input on preferences)
8. **Dark theme implementation** - Add dark mode support (requires input on design approach)
9. **Admin role and deletion** - Implement admin role with delete permissions for notes, tasks, and items
10. **Done task management** - Strategy for completed tasks (hide after X days, archive, etc.)
11. **Mobile UI optimization** - Improve mobile responsiveness across all views
12. **Note versioning review** - Investigate current note version saving and potential usage
13. ~~**Rich text link support** - Add hyperlink functionality to note editor~~ ✅ **COMPLETED**
14. ~~**Task description rich text** - Replace plain text task descriptions with rich text editor~~ ✅ **COMPLETED**
15. **Branding updates** - Replace logo and add custom favicon
16. **Deployment setup** - Prepare and deploy application
17. ~~**German localization** - Translate navigation bar items and dashboard text to German~~ ✅ **COMPLETED**
18. ~~**Improve sign up functionality** - Add display name to the sign in form and persist it to DB. Currently auth.users populates "Display name" property automatically by taking everything in the email before "@". Would be nice to be able to add a custom display name. Also if user is not logged in, display log in mask by default instead of sign up mask~~ ✅ **COMPLETED**
19. **Add task ranking within priority** - Add possibility to rank tasks within one priority. Currently they are ordered by created_at DESC by default. Would be cool to be able to drag and drop them within one column in Kanban view to change rank within one status and priority, and in the table within a priority and status
20. **Real-time data synchronization** - Implement automatic polling/refresh mechanism on Requisiten, Tasks, and Notes pages to display latest updates from other users without requiring manual page refresh. Currently only Notes has real-time updates via Supabase subscriptions
21. **German localization for authentication** - Translate sign in/sign up forms to German (currently in English). Update field labels, buttons, messages, and placeholder text to match the German localization used throughout the rest of the application

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

## 22:14 27.01.2025 – Compact Session

### CurrentFocus
Implemented private content functionality with creator-only privacy toggles and resolved UI/UX issues in task dialogs.

### SessionChanges
- Added `is_private` boolean fields to tasks/notes database schema with migration script
- Updated TypeScript interfaces to include `is_private` for Task and Note types
- Implemented privacy toggles in task-add-dialog and task-edit-dialog components
- Added privacy indicator badges (EyeOff icon) to task cards, table rows, and note cards
- Implemented privacy filtering in data queries to show private content only to creators
- Enhanced real-time notes functionality to handle privacy field changes
- Restricted privacy toggle visibility to content creators only (currentUser checks)
- Added currentUser prop propagation through TaskBoard, TasksTable, and parent components
- Created database population script to assign existing tasks/notes to authenticated user
- Fixed note privacy saving by updating handleSaveNote parameter signature
- Created MultiCombobox component for compact tag selection with search and color coding
- Replaced large scrollable checkbox lists with compact dropdown tag selection
- Fixed MultiCombobox scrolling with overflow-y-auto for proper dropdown navigation
- Fixed task privacy persistence by adding is_private to handleTaskCreate and handleTaskUpdate

## 12:19 27.09.2025 – Compact Session

### CurrentFocus
Resolved comprehensive TypeScript build errors and linting issues preventing production deployment.

### SessionChanges
- Fixed all ESLint warnings in file-upload.tsx, item-detail-drawer.tsx, and note-card.tsx
- Updated database types to include missing is_private fields for tasks and notes
- Resolved Supabase type inference issues with explicit type assertions
- Fixed spread operator errors by replacing with explicit property mapping
- Corrected null/undefined type mismatches throughout components and hooks
- Added character_ids property to function parameter types for item operations
- Fixed React Hook dependency arrays and function declaration ordering
- Resolved Set iteration compatibility issues for older TypeScript targets
- Updated form validation logic to handle undefined values properly
- Committed all TypeScript build fixes enabling successful production builds

## 13:13 27.09.2025 – Compact Session

### CurrentFocus
Implemented rich text editors with hyperlink support for notes and tasks, plus semantic versioning and deployment tracking.

### SessionChanges
- Added Tiptap Link extension with Cmd+K/Ctrl+K keyboard shortcut to notes editor
- Created TaskDescriptionEditor component with simplified rich text functionality for tasks
- Replaced plain text areas in task add/edit dialogs with rich text editors
- Updated task display components to render HTML with dangerouslySetInnerHTML and prose styling
- Added semantic versioning guidelines to CLAUDE.md with version tracking (bumped to v0.2.0)
- Created Footer component displaying version number from package.json for deployment verification
- Integrated Footer into root layout with flexbox sticky positioning
- Added .claude/ directory to .gitignore and removed from git tracking for local-only settings
- Completed todos 13 (rich text links) and 14 (task rich text), added todos 18-19
- Committed 4 feature commits with conventional commit messages and SemVer compliance
