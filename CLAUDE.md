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

## Database Schema
**Core Entities:**
- `items` - Requisiten/props management with new schema (`is_used`, `is_changeable`), file uploads, character relationships
- `tasks` - Task management with priority, status, assignees, rich descriptions, ranking for drag-and-drop
- `notes` - Collaborative notes with real-time editing, departments, privacy settings
- `departments` - Organization units for categorizing items/tasks/notes
- `categories` - Item categorization with thematic colors for visual organization
- `characters` - Theater characters with distinct colors for badge visualization
- `task_tags` - Tagging system for task organization
- `auth.users` - Supabase authentication with admin role system (no RLS, app-level security)

## Implementation Status

### ✅ Core System Complete
- **Authentication**: Supabase Auth with protected routes and admin role system
- **Requisiten Management**: Full CRUD with file uploads, search, and filtering
- **Task Management**: Kanban + table views with drag-and-drop, assignees, rich text descriptions
- **Collaborative Notes**: Rich text editor with hyperlink support and department assignment
- **Admin System**: App-level security with delete permissions (no RLS complexity)
- **UI/UX**: German localization, compact design, fully mobile-responsive
- **Visual Enhancement**: Colorful character badges and category-based row backgrounds for better organization
- **Data Integration**: Updated schema with CSV import support (105+ theater props), character relationships display

### ⚠️ Known Issues
- **Next.js Image warning**: Console warning about aspect ratio for main logo (functional, cosmetic only)

### 📊 Current Data Status (v0.11.0)
- **Database Schema**: Updated to new format with `is_used`, `is_changeable` fields
- **CSV Data**: 105 theater props from `Requisiten_Master_latest.csv` ready for import
- **Generated SQL**: `items-seed-data.sql` contains all prop data with character relationships
- **Migration Required**: Run `scripts/database-setup/add-colors-complete.sql` to add colors to existing databases
- **Character Colors**: 12 distinct colors assigned to Dracula characters for visual identification
- **Category Colors**: 14 thematic colors for prop categories (weapons=red, medical=blue, etc.)

### 🔄 Current Development Status (Oct 2024)
- **Version**: 0.11.0
- **Active**: Database schema modernization and colorful UI enhancement completed
- **Dev Server**: Running on port 3000
- **Mobile UI**: Icon-only buttons, optimized layouts, single-line stats, burger menu navigation
- **Desktop UI**: Restored original layout with enhanced mobile-first components
- **Dark Theme**: Complete light/dark mode switching with theme toggle in navigation
- **Rich Text**: Full Tiptap editor support in both note editing and creation dialogs
- **Data Visualization**: Character badges with distinct colors, category-based row backgrounds
- **Next Steps**: Task ranking debug, deployment preparation

## Technical Preferences
- kebab-case component names (my-component.tsx)
- Favor React Server Components
- Minimize client components ('use client')
- Always add loading/error states
- Semantic HTML elements
- **ALWAYS run `npm run lint`, `npm run typecheck`, and `npm run build` after implementing large functionality or refactoring** (build catches additional TypeScript errors that typecheck might miss)

## Version Management
**Current Version**: `0.11.0`

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
- `theme/` - Theme management (ThemeProvider, ThemeToggle)
- `ui/` - Shadcn/ui components (Button, Dialog, Select, Combobox, PageHeader, StatsBar, etc.)

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
- `scripts/database-setup/` - Core schema and setup (database-schema.sql, database-setup-complete.sql, supabase-storage-setup.sql, disable-rls-simplify.sql, assign-admin-role.sql, add-task-ranking.sql, SETUP-SIMPLIFIED-ADMIN.md)
- `scripts/database-setup/` - **NEW v0.11.0**: Color enhancements (add-character-colors.sql, populate-category-colors.sql, add-colors-complete.sql)
- `scripts/database-setup/` - **NEW v0.11.0**: Schema migration (migrate-items-schema.sql for updating existing databases)
- `scripts/data-import/` - Active data utilities (populate-task-tags.sql, cleanup-tasks.sql)
- `scripts/archive/` - Archived/obsolete scripts (add-privacy-fields.sql, add-user-roles.sql, fix-rls-policies.sql, populate-created-by-fields.sql, setup-default-user-roles.sql, cleanup-migration.sql, update-departments.sql, legacy-seed-data/)
- `scripts/` - Processing utilities (parse-todos.js, parse-csv-data.js with enhanced CSV parsing, run-import.mjs)
- **NEW v0.11.0**: `items-seed-data.sql` - Generated theater props data (105+ items from CSV)
- **NEW v0.11.0**: `seed data/Requisiten_Master_latest.csv` - Source CSV from Notion export

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

## TODO Backlog

### High Priority
1. **Database Migration Deployment** - Apply schema changes and color enhancements to production database
2. **CSV Data Import** - Import 105 theater props using generated SQL file
3. **Debug task ranking drag-and-drop** - Fix remaining positioning bugs in Kanban view task reordering within priority groups
4. **Enhance drag-and-drop on mobile** - Lock scrolling on drag, add drag preview, add drop animations

### Medium Priority
3. **Done task management** - Strategy for completed tasks (archive, hide after X days, etc.)
4. **Deployment setup** - Prepare and deploy application

### Low Priority
5. **Archive legacy scripts** - Clean up obsolete data import/processing scripts
6. **Note versioning review** - Investigate current note version saving potential
7. **Offline capabilities strategy** - Research offline data access options

## Recent Major Changes

### v0.11.0 - Database Schema & Colorful UI Enhancement (Oct 2024)
- **FEATURE**: Updated database schema with new item fields (`is_used`, `is_changeable`) replacing legacy fields
- **FEATURE**: Colorful character badges with distinct colors for better visual identification
- **FEATURE**: Category-based row background tinting for improved visual organization
- **FEATURE**: CSV data import system with 105+ theater props from Notion export
- **IMPROVEMENT**: Character relationships properly displayed in UI with data transformation
- **IMPROVEMENT**: Enhanced color utilities for consistent badge styling and accessibility
- **DATA**: Complete theater production dataset with all Dracula characters and prop categories

### v0.10.1 - Rich Text Editor Enhancement (Oct 2024)
- **FEATURE**: Added full Tiptap rich text editor to note creation dialog
- **IMPROVEMENT**: Consistent WYSIWYG editing experience across note creation and editing

### v0.10.0 - Dark Theme Implementation (Oct 2024)
- **FEATURE**: Complete dark mode system with animated theme toggle in navigation
- **FEATURE**: Theme-aware logo switching and custom dark color palette
- **IMPROVEMENT**: All components support dark mode with localStorage persistence

### v0.9.0 - Mobile Responsiveness Optimization (Oct 2024)
- **FEATURE**: Comprehensive mobile UI with icon-only buttons and burger menu navigation
- **IMPROVEMENT**: Optimized layouts for all components across mobile and desktop
- **BUG FIX**: Restored original desktop behavior while maintaining mobile improvements

### v0.8.1 - Assignee Removal Bug Fix (Sept 2024)
- **BUG FIX**: Fixed assignee removal functionality in task management
- **IMPROVEMENT**: Enhanced data persistence layer to properly handle undefined values

### v0.8.0 - Typography & Branding System (Sept 2024)
- **FEATURE**: Comprehensive branding system with Lexend + Roboto fonts and Back2Stage identity
- **FEATURE**: Professional blue/red color scheme and typography hierarchy
- **IMPROVEMENT**: Converted interface to informal German language (du/dir)


# important-instruction-reminders
Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (*.md) or README files. Only create documentation files if explicitly requested by the User.


      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.