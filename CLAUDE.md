# Claude Code Configuration

## Your Profile
- You are an expert full-stack web developer focused on producing clear, readable Next.js code.
- You always use the latest stable versions of Next.js 14, Supabase, TailwindCSS, and TypeScript.

## Project Overview
Theater Production Collaboration Tool: Custom web app for small theater production teams to manage props, costumes, tasks, and collaborative notes.

## Tech Stack
- Next.js 14+ (App Router, TypeScript)
- Supabase (PostgreSQL, Auth, Storage, real-time)
- Tailwind CSS + Shadcn/ui
- Tiptap editor, @dnd-kit, Tanstack Table, cmdk

## Database Schema
**Core Entities:**
- `items` - Requisiten/props management with new schema, file uploads, character relationships
- `tasks` - Task management with priority, status, assignees, rich descriptions, ranking for drag-and-drop
- `notes` - Collaborative notes with real-time editing, departments, privacy settings
- `departments` - Organization units for categorizing items/tasks/notes
- `categories` - Item categorization with thematic colors for visual organization
- `characters` - Theater characters with distinct colors for badge visualization
- `task_tags` - Tagging system for task organization
- `auth.users` - Supabase authentication with admin role system (no RLS, app-level security)

## Current Status (v0.12.3)
- Authentication, Requisiten management, Task management (Kanban/table), Collaborative notes
- Admin system (app-level security), German UI, mobile-responsive, colorful character/category system
- Database schema updated with `is_used`, `is_changeable` fields, 105+ theater props imported
- Multi-select component for characters and tags with grid layout
- Advanced filtering and sorting for items table (category, source, status, characters)
- Known issue: Next.js Image aspect ratio warning (cosmetic only)
- **Dev Server**: Running on port 3000

## Development Guidelines
- Current version: 0.12.3 (SemVer: MAJOR.MINOR.PATCH)
- Update both `package.json` and CLAUDE.md version before committing
- Use conventional commit messages (feat:, fix:, BREAKING CHANGE:)
- Always run `npm run lint`, `npm run typecheck`, `npm run build` after major changes
- Update Project Structure section when changing file organization
- kebab-case component names (my-component.tsx)
- Favor React Server Components
- Minimize client components ('use client')
- Always add loading/error states
- Semantic HTML elements
- Follow requirements to the letter
- Readability over performance
- No todos, placeholders, or missing pieces
- Reference file names in responses
- Be concise
- If you do not know the answer, say so
- If you think the question is wrong, say so

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
- `theme/` - Theme management (ThemeProvider, ThemeToggle)
- `ui/` - Shadcn/ui components (Button, Dialog, Select, Combobox, MultiSelect, Command, PageHeader, StatsBar, etc.)

### Core Services (`src/`)
- `lib/supabase.ts` - Supabase client configuration
- `lib/auth-utils.ts` - Server-side admin utilities and role checking
- `lib/utils.ts` - Utility functions
- `lib/color-utils.ts` - Color utilities for badges and backgrounds (hex to RGB, contrast, styling)
- `hooks/use-admin-check.tsx` - Client-side admin role checking hook
- `hooks/use-realtime-data.tsx` - Generic real-time hook for all entities with retry logic
- `hooks/use-realtime-items.tsx` - Real-time items hook with character data transformation
- `hooks/use-realtime-tasks.tsx` - Real-time tasks hook
- `hooks/use-realtime-notes.tsx` - Legacy real-time notes hook
- `hooks/use-realtime-notes-v2.tsx` - Improved real-time notes hook
- `types/` - TypeScript definitions (database.ts with updated schema, index.ts with color fields)

### Database & Scripts
- `scripts/database-setup/` - Core schema and setup scripts
  - `database-schema.sql` - Core database schema reference
  - `database-setup-complete.sql` - Complete setup with seed data
  - `supabase-storage-setup.sql` - Storage bucket configuration
  - `assign-admin-role.sql` - Admin role assignment utility
  - `SETUP-SIMPLIFIED-ADMIN.md` - Admin system setup guide

### Static Assets (`public/`)
- `back2stage_logo.svg` - Main logo for light theme (dark text #38383a)
- `back2stage_logo_dark.svg` - Logo for dark theme (light text #f2f2f3)
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
- **Mobile responsiveness**: Icon-only buttons on mobile (`<span className="hidden sm:inline">Text</span>`), burger menu navigation, responsive layouts with `flex-col sm:flex-row` patterns
- **Dark theme system**: React Context-based ThemeProvider with localStorage persistence ("back2stage-theme" key). Tailwind "class" dark mode with manual theme switching. Theme toggle with animated sun/moon icons positioned in navigation. Logo switching: `theme === 'dark' ? logo_dark.svg : logo.svg`
- **Rich text editor architecture**: Three components - `TiptapEditor` (full-featured for note editing), `TiptapEditorWrapper` (SSR wrapper for note creation/editing), `TaskDescriptionEditor` (simplified for task descriptions). Use wrapper for SSR compatibility with `ssr: false` and `immediatelyRender: false`
- **Component dialog patterns**: Add vs Edit dialogs follow consistent structure - Add dialogs use controlled state, Edit dialogs receive existing data. Both use same validation and save patterns
- **Development workflow**: `npm run dev` (development), `npm run build` (production build), `npm run lint` (ESLint), `npm run typecheck` (TypeScript validation). Always run all three after major changes
- **Character data transformation**: Real-time items hook transforms nested `item_characters.character` to flat `characters` array for UI compatibility using `transformItemData()` function
- **Color system architecture**: Hex colors stored in database, converted to RGBA with utilities for badges (`getBadgeStyle()`), backgrounds (`getLightBackgroundColor()`), and contrast (`getContrastingTextColor()`)
- **CSV import system**: Robust CSV parser handles quoted fields with commas, generates SQL with conflict resolution (`ON CONFLICT DO NOTHING`), maps character relationships automatically
- **Database schema versioning**: Items table updated from legacy fields (`needs_clarification`, `needed_for_rehearsal`) to new schema (`is_used`, `is_changeable`). Migration scripts provided for existing databases
- **Visual organization**: Category colors provide subtle row backgrounds (5% opacity), character colors create distinct badge identification, thematic color assignments for intuitive categorization
- **Multi-select component**: Built with cmdk/Command component. Multi-column grid layout (2 cols mobile, 3 cols desktop) to avoid scrolling issues. Search works via `value={label}` and `keywords={[label]}` props while selection uses actual ID values. Used for character selection (items) and tag selection (tasks)

## Development Sessions

### Oct 2025 - Note Versioning & Task Management Improvements
**Key Achievements**: Version history tracking for notes, completed task filtering

**Note Versioning (v0.12.0):**
- Automatic version snapshot creation on every note save
- Version history dialog with timestamps and content previews
- Version viewer dialog for full content display
- Version restore functionality (creates new version from old content)
- `restoreVersion()` function in real-time notes hook
- Mobile-responsive dialogs with icon-only buttons
- Known issue: Dialog overflow on mobile (non-critical)

**Task Management (v0.12.1):**
- Added "Show completed tasks" checkbox toggle in filters section
- Hides tasks with status "done" when unchecked (defaults to showing all)
- Works in both Kanban board and table views
- Stats bar includes all tasks regardless of filter
- First iteration of completed task management strategy

**Multi-Select Component (v0.12.2):**
- Implemented new MultiSelect component using cmdk/Command
- Multi-column grid layout (2 columns mobile, 3 columns tablet/desktop)
- No scrolling required - all options visible in grid
- Search functionality working correctly with label-based matching
- Color badge support for visual identification
- Used for character selection (items) and tag selection (tasks)
- Replaced old broken multi-combobox implementation

**Items Table Enhancements (v0.12.3):**
- Added sortable columns: Charaktere, Quelle, Kategorie (clicks to sort ascending/descending)
- Implemented comprehensive filter system matching tasks page pattern
- Filter button in header when collapsed, full filter card when expanded
- Filters: Kategorie, Quelle, Status, Charaktere (multi-select)
- Active filters summary with removable badges when collapsed
- Auto-expand filters when filters become active
- 4-column grid layout on desktop (1 col mobile, 2 cols tablet)
- Bug fix: Removed stray `selectedType` references causing search errors

## TODO Backlog
1. Debug task ranking drag-and-drop positioning bugs in Kanban view
2. Enhance mobile drag-and-drop (lock scrolling, drag preview, drop animations)
3. Persist task filter settings (showCompleted, selectedDepartment, etc.) to localStorage
4. **Auto-archive completed tasks**: Add `completed_at` timestamp and `archived` boolean to tasks table. When task status changes to "done", set `completed_at`. Automatically archive tasks where `completed_at` is older than 14 days. Add "Show archived" toggle and Archive page/view for browsing archived tasks.
5. Fix version history dialog mobile responsiveness
6. **Offline capabilities strategy** - Research offline data access options

## Recent Changes
- **v0.12.3**: Added sortable columns and comprehensive filtering to items table
- **v0.12.2**: Implemented multi-select component with grid layout for characters and tags
- **v0.12.1**: Added "Show completed tasks" toggle filter for cleaner task views
- **v0.12.0**: Version history tracking with automatic snapshots, restore functionality, and version viewer UI
- **v0.11.1**: Project cleanup - archived obsolete scripts, updated documentation, cleaned root directory
- **v0.10.1**: Rich text editor for note creation

