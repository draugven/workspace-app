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
- **Mobile Optimization**: Needs improvement across all views
- **Next.js Image warning**: Console warning about aspect ratio for main logo (functional, cosmetic only)

### 🔄 Current Development Status (Sept 2024)
- **Version**: 0.8.1 (committed: 503b455)
- **Active**: Typography & branding system fully implemented
- **Dev Server**: Running on port 3001 (multiple background instances)
- **Fonts**: Lexend + Roboto loading correctly via Next.js Google Fonts
- **Colors**: Blue primary (#3A4D7A) + Red accent (#E74746) applied to all components
- **Next Steps**: Mobile optimization, assignee removal bug fix, console cleanup

## Technical Preferences
- kebab-case component names (my-component.tsx)
- Favor React Server Components
- Minimize client components ('use client')
- Always add loading/error states
- Semantic HTML elements
- **ALWAYS run `npm run lint`, `npm run typecheck`, and `npm run build` after implementing large functionality or refactoring** (build catches additional TypeScript errors that typecheck might miss)

## Version Management
**Current Version**: `0.8.1`

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
- `hooks/use-realtime-data.tsx` - Generic real-time hook for all entities with retry logic
- `hooks/use-realtime-items.tsx` - Real-time items hook
- `hooks/use-realtime-tasks.tsx` - Real-time tasks hook
- `hooks/use-realtime-notes.tsx` - Legacy real-time notes hook
- `hooks/use-realtime-notes-v2.tsx` - Improved real-time notes hook
- `types/` - TypeScript definitions (database.ts, index.ts)

### Database & Scripts
- `scripts/database-setup/` - Core schema and setup (database-schema.sql, database-setup-complete.sql, supabase-storage-setup.sql, disable-rls-simplify.sql, assign-admin-role.sql, add-task-ranking.sql, SETUP-SIMPLIFIED-ADMIN.md)
- `scripts/data-import/` - Active data utilities (populate-task-tags.sql, cleanup-tasks.sql)
- `scripts/archive/` - Archived/obsolete scripts (add-privacy-fields.sql, add-user-roles.sql, fix-rls-policies.sql, populate-created-by-fields.sql, setup-default-user-roles.sql, cleanup-migration.sql, update-departments.sql, legacy-seed-data/)
- `scripts/` - Processing utilities (parse-todos.js, parse-csv-data.js, run-import.mjs)

### Static Assets (`public/`)
- `back2stage_logo.svg` - Main logo with converted text outlines
- `b2s_curtain_logo.svg` - Curtain logo/favicon
- `site.webmanifest` - Web app manifest for PWA support
- Favicon files (favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png)

## Known Technical Solutions
- **Tiptap SSR**: Use dynamic imports with `ssr: false` and `immediatelyRender: false`
- **Drag-and-drop**: Use @dnd-kit with rectIntersection collision detection
- **Select validation**: Use 'none' placeholder values, convert for database
- **Real-time cleanup**: Avoid `channel.off()` - Supabase channels don't support it
- **Database schema changes**: When adding/removing table columns, ALWAYS update both database schema AND TypeScript types in `src/types/database.ts`
- **Supabase typing workaround**: Use `(supabase as any)` for insert/update operations when TypeScript inference fails (temporary solution until better typing)
- **Admin system architecture**: App-level security without RLS complexity. Client-side admin checks for UI, server-side validation in API routes using Authorization headers. No RLS policies needed for single-app use cases
- **Real-time data sync**: Implemented robust real-time hooks with retry logic for all entities (items, tasks, notes). Uses generic `useRealtimeData` hook with automatic reconnection and error handling
- **Task ranking system**: Use INTEGER field with 1000-unit spacing for drag-and-drop ranking. Avoid fractional values that cause PostgreSQL errors. Sort by priority → status → ranking for logical ordering
- **Drag-and-drop animations**: Use DragOverlay with full-size card preview, custom drop animations, and proper isOverlay prop handling for better UX
- **Typography system**: Lexend for headings, Roboto for body text. Custom CSS classes: .text-h1, .text-h2, .text-h3, .text-body, .text-button, .text-caption
- **Color scheme**: Blue primary (#3A4D7A), Red accent (#E74746), Light Gray background (#F7F7F7), Dark Gray text (#2C2C2E)
- **Font loading**: Next.js Google Fonts with CSS variables, Tailwind config extended for custom fonts
- **Branding consistency**: "Back2Stage" used throughout, informal German (du/dir) in auth forms

## TODO Backlog

### High Priority
1. ~~**Real-time data synchronization** - Fix WebSocket connection issues preventing real-time updates. Critical for multi-user collaboration~~ ✅ **COMPLETED**
2. **Clean up console output** - Remove excessive logging especially for tasks page to improve developer experience
3. ~~**Fix assignee removal bug** - Cannot select "Niemandem zugewiesen" to remove task assignee, last assignee persists~~ ✅ **COMPLETED**
4. ~~**Task ranking within priority** - Add drag-and-drop ranking within status/priority columns for better task organization~~ ✅ **COMPLETED**
5. **Debug task ranking drag-and-drop** - Fix remaining positioning bugs in Kanban view task reordering within priority groups
6. **Mobile UI optimization** - Improve responsiveness across all views for mobile devices

### Medium Priority
7. **Done task management** - Strategy for completed tasks (archive, hide after X days, etc.)
8. ~~**Typography and styling updates** - General design improvements~~ ✅ **COMPLETED**
9. **Dark theme implementation** - Add dark mode support
10. ~~**Branding updates** - Replace logo and add custom favicon~~ ✅ **COMPLETED**
11. **Deployment setup** - Prepare and deploy application

### Low Priority
12. **Archive legacy scripts** - Clean up obsolete data import/processing scripts
13. **Note versioning review** - Investigate current note version saving potential
14. **Offline capabilities strategy** - Research offline data access options

## Recent Major Changes

### v0.8.1 - Assignee Removal Bug Fix (Sept 2024)
- **BUG FIX**: Fixed assignee removal functionality in task management
- **BUG FIX**: Resolved Combobox toggle behavior preventing "Niemandem zugewiesen" selection
- **IMPROVEMENT**: Enhanced data persistence layer to properly handle undefined values
- **TECHNICAL**: Convert undefined values to null in useRealtimeData for proper Supabase field clearing
- **IMPACT**: Users can now successfully remove task assignees by selecting "Niemandem zugewiesen"

### v0.8.0 - Typography & Branding System (Sept 2024)
- **FEATURE**: Implemented comprehensive branding system with Lexend + Roboto font stack
- **FEATURE**: Updated color scheme with professional blue primary (#3A4D7A) and red accent (#E74746)
- **FEATURE**: Created typography hierarchy with custom CSS classes (text-h1, text-h2, text-h3, text-body, etc.)
- **IMPROVEMENT**: Updated all major components to use new typography system
- **IMPROVEMENT**: Replaced "Theater Production App" branding with "Back2Stage" throughout
- **IMPROVEMENT**: Converted login/signup forms to informal German language (du/dir)
- **IMPROVEMENT**: Enhanced web manifest with new theme colors for PWA support

### v0.7.0 - Task Ranking System & UI Enhancements (Sept 2024)
- **FEATURE**: Implemented comprehensive drag-and-drop task ranking within priority groups
- **FEATURE**: Added ranking field to database schema with proper indexing for performance
- **FEATURE**: Enhanced Kanban view with within-priority column ranking using @dnd-kit SortableContext
- **FEATURE**: Improved Table view default sorting: priority → status → ranking for logical task ordering
- **IMPROVEMENT**: Better drag-and-drop animations with full-size card preview and smooth drop effects
- **BUG FIX**: Fixed image aspect ratio warning for Back2Stage logo in navigation
- **IMPROVEMENT**: Task creation now automatically assigns ranking for proper positioning within priority groups

### v0.6.0 - Real-time Data Synchronization (Sept 2024)
- **FEATURE**: Implemented comprehensive real-time data sync for all entities (items, tasks, notes)
- **FEATURE**: Created generic `useRealtimeData` hook with retry logic and automatic reconnection
- **FEATURE**: Added specialized real-time hooks: `useRealtimeItems`, `useRealtimeTasks`, `useRealtimeNotesV2`
- **BUG FIX**: Resolved infinite subscription loop causing loading flicker in UI
- **BUG FIX**: Fixed Supabase query syntax errors preventing task data loading
- **IMPROVEMENT**: Task updates now reflect immediately without page refresh (privacy, assignee, status changes)

### v0.5.0 - Simplified Admin System (Sept 2024)
- **BREAKING CHANGE**: Removed RLS policies in favor of app-level security
- Implemented admin delete functionality for all entity types
- Added Authorization header authentication for API routes

### v0.2.0 - Rich Text & Versioning (Sept 2024)
- Added Tiptap rich text editor with hyperlink support for notes and tasks
- Implemented semantic versioning workflow and deployment tracking
- Added privacy toggles for creator-only content visibility

## Development Sessions

### Sept 2024 - Task Ranking System Implementation
**Key Achievement**: Implemented comprehensive drag-and-drop ranking within priority groups for better task organization
- Added `ranking` field to database schema with proper indexing for performance
- Updated TypeScript types and database schema files (database-schema.sql, database-setup-complete.sql)
- Created ranking migration script (add-task-ranking.sql) with automatic ranking initialization
- Enhanced Kanban view with within-priority column ranking using @dnd-kit SortableContext
- Improved Table view default sorting: priority → status → ranking for logical task ordering
- Added ranking calculation logic for task creation (places new tasks at bottom of priority group)
- Implemented drag-and-drop ranking updates with fractional ranking system for smooth reordering
- All changes pass TypeScript checking and build successfully

### Sept 2024 - Real-time Data Synchronization Implementation
**Key Achievement**: Fixed comprehensive real-time updates for all entities (items, tasks, notes)
- Created generic `useRealtimeData` hook with retry logic and automatic reconnection
- Built specialized hooks: `useRealtimeItems`, `useRealtimeTasks`, `useRealtimeNotesV2`
- Resolved infinite subscription loop causing UI loading flicker issues
- Fixed Supabase query syntax errors preventing task data from loading properly
- Replaced manual database calls with real-time hook functions for immediate UI updates
- Updated all CRUD operations to use real-time hooks enabling instant task changes
- Added comprehensive documentation and version bump to 0.6.0

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
