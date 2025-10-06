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
- `invitations` - Invite-only authentication system with token-based user registration
- `auth.users` - Supabase authentication with admin role system (no RLS, app-level security)

## Current Status (v0.13.0)
- **Routes**: /props (Requisiten), /tasks (Kanban + table), /notes (collaborative editing), /admin/invitations (admin-only), /accept-invite (public)
- **Features**: Invite-only authentication, admin system (app-level), German UI, mobile-responsive
- **Authentication**: Token-based invitation system with 7-day expiry, single-use tokens, admin-controlled user creation
- **Data**: 105+ theater props imported, character/category color system
- **UI**: Advanced filtering/sorting, multi-select components, dark mode support, mobile editor viewport fix
- **Dev Server**: Port 3000

## Development Guidelines
- Current version: 0.13.0 (SemVer: MAJOR.MINOR.PATCH)
- Update both `package.json` and CLAUDE.md version before committing
- Use conventional commit messages (feat:, fix:, BREAKING CHANGE:)
- Always run `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` after major changes
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

### Testing Guidelines
- **Test Framework**: Jest + React Testing Library
- **Test Location**: Place tests in `__tests__` directory next to the code being tested
- **Naming Convention**: `{component-name}.test.tsx` or `{hook-name}.test.tsx`
- **Coverage Goals**: Critical paths (auth, real-time, API routes), error boundaries, complex hooks
- **Run Tests**: `npm test` (all), `npm test -- --watch` (watch mode), `npm test -- --coverage` (coverage report)
- **When to Test**: After implementing critical features, fixing bugs, or adding complex logic
- **Test Structure**: Describe blocks for grouping, clear test names, mock external dependencies
- **Current Coverage**: 75 tests across auth-provider (11), use-realtime-data (16), error boundaries (9), invitation API routes (39)

## Project Structure

### Core App Routes (`src/app/`)
- `page.tsx` - Dashboard/home page
- `props/page.tsx` - Requisiten management (props, will support costumes via type filter in future)
- `tasks/page.tsx` - Task management (Kanban + table)
- `notes/page.tsx` - Collaborative notes
- `login/page.tsx` - Authentication
- `accept-invite/page.tsx` - Public invitation acceptance page
- `admin/invitations/page.tsx` - Admin invitation management with URL display
- `api/users/route.ts` - Users API endpoint (secure auth.users fetching)
- `api/admin/items/[id]/route.ts` - Admin-only item deletion endpoint
- `api/admin/tasks/[id]/route.ts` - Admin-only task deletion endpoint
- `api/admin/notes/[id]/route.ts` - Admin-only note deletion endpoint
- `api/admin/invitations/create/route.ts` - Admin-only invitation creation
- `api/admin/invitations/[id]/route.ts` - Admin-only invitation revocation
- `api/invitations/validate/route.ts` - Public invitation token validation
- `api/invitations/accept/route.ts` - Public invitation acceptance + user creation

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
- `lib/supabase.ts`, `lib/auth-utils.ts`, `lib/utils.ts`, `lib/color-utils.ts`
- `hooks/use-admin-check.tsx`, `hooks/use-realtime-*.tsx` (items, tasks, notes-v2, generic)
- `types/database.ts`, `types/index.ts`, `types/jest-dom.d.ts`

### Testing Infrastructure
- `jest.config.js` - Jest configuration for Next.js integration
- `jest.setup.js` - Global test setup (jest-dom matchers)
- `src/components/auth/__tests__/` - Auth provider tests (11 tests)
- `src/hooks/__tests__/` - Real-time hook tests (16 tests)
- `src/app/{route}/__tests__/` - Error boundary tests (9 tests total)

### Database Scripts (`scripts/database-setup/`)
- Complete setup, storage config, admin role assignment, schema reference

## Key Technical Solutions
- **Tiptap SSR**: Dynamic imports with `ssr: false` and `immediatelyRender: false`. Mobile viewport fix: `scrollIntoView()` on focus/click
- **Task ranking**: INTEGER with 1000-unit spacing. Sort by priority → status → ranking
- **Multi-select**: cmdk/Command with grid layout (2/3 cols). Search via `value={label}`, select via ID
- **Admin system**: App-level security (no RLS). Client checks for UI, server validation in API routes
- **Invitation system**: Token-based (64-char hex), 7-day expiry, single-use, app-level security. Admin creates → URL displayed → user accepts with display name. Authorization header pattern for API auth
- **Real-time**: Generic `useRealtimeData` hook with retry logic. Character data transformation for items. Uses ref pattern for callback stability
- **Error boundaries**: Next.js 14 error.tsx files for each route with German UI, retry functionality, proper error logging
- **Color system**: Hex in DB → RGBA utilities. Category backgrounds (5% opacity), character badges
- **Dark theme**: Context + localStorage ("back2stage-theme"). Manual toggle, logo switching
- **Mobile**: Icon-only buttons, burger menu, responsive layouts, editor viewport scrolling
- **Database schema**: ALWAYS update both SQL schema AND TypeScript types in `src/types/database.ts`
- **Supabase client**: Use singleton `supabase` instance from lib/supabase.ts to avoid multiple client warnings
- **Supabase typing**: Use `(supabase as any)` for insert/update when inference fails
- **Testing**: Jest + React Testing Library. Mock Supabase client, use renderHook for hooks, waitFor for async assertions

## TODO Backlog
1. Auto-archive completed tasks (14-day threshold, `completed_at` + `archived` fields)
2. Persist filter settings to localStorage
3. Fix version history dialog mobile responsiveness
4. Enhance mobile drag-and-drop UX
5. Offline capabilities research

## Recent Changes
- **v0.13.0**: Invite-only authentication system - token-based user registration (7-day expiry, single-use), admin invitation management UI with URL display/copy, public acceptance page with display name, Authorization header pattern for admin routes, 39 comprehensive tests (97.97% coverage)
- **v0.12.5**: Code quality improvements - enhanced error logging for version save failures, added localStorage error handling in theme provider, removed unused exports (~50 lines) from utility files
- **v0.12.4**: UI refinements - moved Requisiten to /props route, improved table views with subtitles, updated search placeholders, fixed dark mode badge brightness, reordered items table columns
- **v0.12.3**: Sortable columns and comprehensive filtering for items table
- **v0.12.2**: Multi-select component with grid layout for characters and tags
- **v0.12.1**: "Show completed tasks" toggle filter
- **v0.12.0**: Version history tracking with snapshots and restore