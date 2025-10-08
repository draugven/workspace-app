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

## Current Status (v0.15.0)
- **Routes**: /props, /tasks, /notes, /admin/invitations, /accept-invite
- **Features**: Invite-only authentication, centralized admin context (non-blocking), URL redirect preservation, filter persistence, system theme support
- **Authentication**: Token-based invitation with secure redirect after login, dynamic admin role updates (USER_UPDATED)
- **Performance**: Navigation in root layout (eliminates re-mounts), centralized admin checks (75% fewer DB queries)
- **Data**: 105+ theater props imported, character/category color system
- **UI**: Advanced filtering/sorting with localStorage persistence, multi-select components, dark mode (light/dark/system), mobile editor viewport fix
- **Dev Server**: Port 3000
- **Tests**: 186 passing (non-blocking auth 4, realtime 16, persisted state 26, theme 28, error boundaries 9, API routes 39, redirect-utils 40, others 24)

## Development Guidelines
- Current version: 0.15.0 (SemVer: MAJOR.MINOR.PATCH)
- Update both `package.json` and CLAUDE.md version before committing
- Use conventional commit messages (feat:, fix:, BREAKING CHANGE:)
- Always run `npm run lint`, `npm run typecheck`, `npm run build`, `npm test` after major changes
- **IMPORTANT: Clean dev server restarts** - After changes that affect SSR/hydration (client/server component changes, theme/auth context changes, localStorage integration), PROACTIVELY kill the dev server and run `npm run cleandev` to clear `.next/` cache. Stale build artifacts can cause fixes to "revert" after browser refresh.
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
- `hooks/use-admin-check.tsx`, `hooks/use-realtime-*.tsx` (items, tasks, notes-v2, generic), `hooks/use-persisted-state.ts` (localStorage persistence)
- `types/database.ts`, `types/index.ts`, `types/jest-dom.d.ts`

### Testing Infrastructure
- `jest.config.js` - Jest configuration for Next.js integration
- `jest.setup.js` - Global test setup (jest-dom matchers)
- `src/components/auth/__tests__/` - Auth provider tests (11 tests)
- `src/hooks/__tests__/` - Real-time hook tests (16 tests), persisted state hook tests (26 tests)
- `src/components/theme/__tests__/` - Theme provider tests (28 tests)
- `src/app/{route}/__tests__/` - Error boundary tests (9 tests total)
- `src/app/api/*/___tests__/` - API route tests (39 tests for invitation system)

### Database Scripts (`scripts/database-setup/`)
- Complete setup, storage config, admin role assignment, schema reference

## Supabase Auth Anti-Patterns & Best Practices

**CRITICAL: Async Operations in Auth Callbacks Cause Deadlocks**

❌ **NEVER DO THIS:**
```typescript
// This creates a deadlock - promises hang indefinitely
supabase.auth.onAuthStateChange(async (event, session) => {
  await supabase.from('profiles').select('*')  // BLOCKS FOREVER
})

supabase.auth.getSession()
  .then(async ({ session }) => {
    await someAsyncOperation()  // BLOCKS .finally()
  })
  .finally(() => setLoading(false))  // NEVER RUNS
```

✅ **CORRECT PATTERN:**
```typescript
// Keep callbacks synchronous - no async, no await
supabase.auth.onAuthStateChange((event, session) => {
  setUser(session?.user || null)  // Only state updates
})

// Separate auth initialization from supplementary queries
supabase.auth.getSession()
  .then(({ session }) => {
    setUser(session?.user || null)
  })
  .finally(() => setLoading(false))  // Always runs

// Fetch additional data in separate useEffect (non-blocking)
useEffect(() => {
  if (!user) return

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*')
    setProfile(data)
  }

  fetchProfile()
}, [user?.id])
```

**Why This Matters:**
- Supabase client locks when auth callbacks contain async operations
- Making callbacks `async` or using `await` inside them creates circular dependencies
- Supplementary queries (roles, profiles) must be fetched separately to avoid blocking initialization
- Official Supabase docs: "Do not use other Supabase functions in the callback function"

**Supabase Client Pattern:**
- **Current**: Singleton `export const supabase = createClient(...)`
- **Official**: Lazy initialization - create clients on-demand with functions
- **Migration**: Low priority optimization (singleton works but not official pattern)

**getUser() vs getSession():**
- **Server-side** (middleware, Server Components): ALWAYS use `getUser()` (validates with auth server)
- **Client-side**: Either works, but `getSession()` is faster (reads localStorage)
- **Security**: Server always enforces authorization with `getUser()`, client is for UX only

**Middleware Requirements:**
- Must call `await supabase.auth.getUser()` to refresh expired tokens
- Pass refreshed tokens to both Server Components (request.cookies) and browser (response.cookies)
- No logic between `createServerClient` and `getUser()` calls

## Key Technical Solutions
- **Tiptap SSR**: Dynamic imports with `ssr: false` and `immediatelyRender: false`. Mobile viewport fix: `scrollIntoView()` on focus/click
- **Task ranking**: INTEGER with 1000-unit spacing. Sort by priority → status → ranking
- **Multi-select**: cmdk/Command with grid layout (2/3 cols). Search via `value={label}`, select via ID
- **Admin system**: App-level security (no RLS). Client checks for UI, server validation in API routes
- **Invitation system**: Token-based (64-char hex), 7-day expiry, single-use, app-level security. Admin creates → URL displayed → user accepts with display name. Authorization header pattern for API auth
- **Real-time**: Generic `useRealtimeData` hook with retry logic. Character data transformation for items. Uses ref pattern for callback stability
- **Error boundaries**: Next.js 14 error.tsx files for each route with German UI, retry functionality, proper error logging
- **Color system**: Hex in DB → RGBA utilities. Category backgrounds (5% opacity), character badges
- **Theme system**: Context + localStorage ("back2stage-theme"). Three modes: light, dark, system (OS preference detection via matchMedia). Theme toggle cycles through all three. Logo switching per theme.
- **Mobile**: Icon-only buttons, burger menu, responsive layouts, editor viewport scrolling
- **Database schema**: ALWAYS update both SQL schema AND TypeScript types in `src/types/database.ts`
- **Supabase client**: Use singleton `supabase` instance from lib/supabase.ts to avoid multiple client warnings
- **Supabase typing**: Use `(supabase as any)` for insert/update when inference fails
- **Testing**: Jest + React Testing Library. Mock Supabase client, use renderHook for hooks, waitFor for async assertions
- **Filter persistence**: `usePersistedState` hook persists all page filters and table sort state to localStorage (automatic save/restore across sessions). SSR-safe with error handling. Arrays, nulls, and objects handled correctly.

## Page-Specific Filter States

**Props Page** (`/props/page.tsx`):
- Page filters: `searchTerm`, `selectedCategory`, `selectedSource`, `selectedCharacters[]`, `selectedStatus`, `filtersExpanded`
- Table sorting (items-table.tsx): `sortField` (default: 'name'), `sortDirection` (default: 'asc')

**Tasks Page** (`/tasks/page.tsx`):
- Page filters: `viewMode` ('board'|'table'), `searchTerm`, `selectedDepartment`, `selectedTags[]`, `selectedStatus`, `selectedPriority`, `selectedAssignee`, `showCompleted` (default: true), `filtersExpanded`
- Table sorting (tasks-table.tsx): `sortField` (default: 'priority'), `sortDirection` (default: 'desc')

**Notes Page** (`/notes/page.tsx`):
- Page filters: `searchTerm`, `filterDepartment`, `filtersExpanded`
- No table sorting (grid view only)

## TODO Backlog

1. Auto-archive completed tasks (14-day threshold, `completed_at` + `archived` fields)
2. ~~Persist filter settings to localStorage~~ ✅ COMPLETED (v0.14.0)
3. Consider consolidating localStorage keys per page (optional performance optimization - single object vs multiple keys per filter)
4. Fix version history dialog mobile responsiveness
5. Enhance mobile drag-and-drop UX
6. Offline capabilities research
7. **Mitigate localStorage loading "flash"** (theme/filters flash defaults before persisted values load)
   - Symptoms: Theme flashes light before dark loads, filters show defaults before localStorage values, admin navigation items appear delayed
   - Root cause: Default values render first, then localStorage is read and state updates (causing re-render)
   - Solutions to investigate: SSR hydration with localStorage values, loading spinner/skeleton, synchronous localStorage reads
8. **Improve filter UX - allow collapsing active filters**
   - Current: Filters auto-expand when active and cannot be collapsed (poor UX with persisted filters)
   - Proposed: Collapsed by default with active filter badges, user can expand/collapse freely, state not persisted
9. **Restructure project root directory** - reduce clutter (see PERFORMANCE_ANALYSIS.md for current issues)
10. ~~**Admin status in AuthProvider context (non-blocking pattern)**~~ ✅ COMPLETED (v0.15.0)
    - Move admin checks from individual components (useAdminCheck hook) to centralized context
    - CRITICAL: Use separate useEffect, never block auth initialization
    - Reduces database queries by ~75% (single check vs per-component)
    - Must follow official Supabase async callback anti-pattern guidance
11. ~~**Navigation in root layout**~~ ✅ COMPLETED (v0.15.0)
    - Eliminates Navigation re-mounting on route changes
    - Performance improvement (less re-renders)
12. ~~**URL redirect preservation after login**~~ ✅ COMPLETED (v0.15.0)
    - Save destination URL when redirecting to login
    - Redirect to original page after successful authentication
    - Include getSafeRedirectPath() validation to prevent open redirect vulnerabilities
13. ~~**USER_UPDATED event handler for admin role changes**~~ ✅ COMPLETED (v0.15.0)
    - Listen for user metadata changes
    - Dynamically update admin status without requiring re-login
14. **Consider Supabase client pattern migration** (low priority optimization)
    - Current: Singleton pattern `export const supabase = createClient(...)`
    - Official: Lazy initialization with functions (create on-demand)
    - Singleton works but not official best practice
15. **Consider app_metadata for admin roles** (future optimization)
    - Current: Database query to `user_roles` table
    - Alternative: Store role in `app_metadata` (set server-side via Auth Admin API)
    - Eliminates database query, reduces latency
16. **Consider JWT claims for roles** (future optimization, most performant)
    - Embed role in JWT via Postgres function hook
    - No database query needed (role in token)
    - Requires custom access token hook in Supabase
17. **Add timeout protection for auth operations** (production resilience)
    - Wrap critical auth calls with Promise.race pattern
    - Recommended: 5s for auth, 10s for profiles, 30s for other queries
    - Prevents edge cases from hanging app indefinitely

## Recent Changes
- **v0.15.0**: Auth & navigation optimizations (FIXED with non-blocking pattern) - centralized admin status in AuthProvider with TWO separate useEffects (follows official Supabase async callback anti-pattern guidance), auth initialization completes fast while supplementary queries load separately, URL redirect preservation with getSafeRedirectPath() security validation, Navigation already in root layout (performance), USER_UPDATED event handler for dynamic role changes, comprehensive non-blocking auth tests (4 new tests), removed broken v0.15.0 tests, all 186 tests passing
- **v0.14.0**: Filter persistence & system theme support - all filters persist to localStorage, system theme with OS detection, usePersistedState hook with SSR safety, 52 new tests (129 total)
- **v0.13.0**: Invite-only authentication system - token-based registration, admin invitation UI, Authorization header pattern, 39 tests (97.97% coverage)
- **v0.12.5**: Code quality improvements - enhanced error logging for version save failures, added localStorage error handling in theme provider, removed unused exports (~50 lines) from utility files
- **v0.12.4**: UI refinements - moved Requisiten to /props route, improved table views with subtitles, updated search placeholders, fixed dark mode badge brightness, reordered items table columns
- **v0.12.3**: Sortable columns and comprehensive filtering for items table
- **v0.12.2**: Multi-select component with grid layout for characters and tags
- **v0.12.1**: "Show completed tasks" toggle filter
- **v0.12.0**: Version history tracking with snapshots and restore