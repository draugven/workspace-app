# Claude Code Configuration

## Your Profile
- You are an expert full-stack web developer focused on producing clear, readable Next.js code.

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

## Current Status (v0.15.4)
- **Routes**: /props, /tasks, /notes, /admin/invitations, /accept-invite, API routes for admin operations
- **Auth**: Token-based invitations, centralized admin context (non-blocking pattern), URL redirect preservation, USER_UPDATED event handler, authenticated /api/users endpoint
- **Data**: 105+ props, character/category color system, app-level security (no RLS), user display names via `display_name` field
- **UI**: Filter persistence (localStorage), multi-select, dark mode (light/dark/system), mobile-responsive
- **Performance**: Navigation in root layout, 75% fewer admin DB queries
- **Tests**: 186 passing (auth 55, real-time 16, theme 28, API 39, others 48)

## Development Guidelines
- Current version: 0.15.4 (SemVer: MAJOR.MINOR.PATCH)
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
- Jest + React Testing Library, tests in `__tests__/` directories
- Run: `npm test` (all), `npm test -- --watch` (watch), `npm test -- --coverage` (coverage)
- Mock Supabase client, use renderHook for hooks, waitFor for async assertions
- Focus: Critical paths (auth, real-time, API routes), error boundaries, complex hooks

## Project Structure

### File Organization
- **Routes** (`src/app/`): Dashboard, /props, /tasks, /notes, /login, /accept-invite, /admin/invitations, API routes
- **Components** (`src/components/`): auth/, items/, tasks/, notes/, files/, layout/, theme/, ui/
- **Services** (`src/`): lib/ (supabase, auth-utils, color-utils), hooks/ (realtime, persisted-state, admin-check), types/
- **Tests**: `__tests__/` next to tested code (186 tests total)
- **Scripts**: `scripts/database-setup/` (schema, storage, admin setup)
- **Documentation** (`docs/`): CODE_ANALYSIS.md, PERFORMANCE_ANALYSIS.md, TEST_COVERAGE.md, TESTING.md, supabase-invite-only-implementation.md, lessons-learned/

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
- Supabase client locks when auth callbacks contain async operations - promises hang indefinitely
- Supplementary queries (admin status, profiles) MUST be fetched in separate useEffects
- Official Supabase docs: "Do not use other Supabase functions in the callback function"

**Additional Auth Patterns:**
- **Server-side**: Use `getUser()` (validates with auth server), never `getSession()`
- **Client-side**: `getSession()` is faster (reads localStorage)
- **Middleware**: Must call `getUser()` to refresh tokens, pass to both request/response cookies
- **Client pattern**: Use singleton from lib/supabase.ts (official pattern: lazy initialization, low priority)

## Key Technical Solutions

**SSR & Hydration:**
- **Tiptap**: Dynamic import with `ssr: false` and `immediatelyRender: false`, mobile: `scrollIntoView()` on focus
- **Theme/localStorage**: Use mounted state for client-only values - server renders defaults, client updates after mount
- **Clean restarts**: After SSR/hydration changes, run `npm run cleandev` to clear `.next/` cache (prevents stale artifacts)

**Supabase:**
- **Auth**: Never use async in auth callbacks. Fetch admin status/profiles in separate useEffects (see Anti-Patterns section)
- **Client**: Singleton from lib/supabase.ts
- **Typing**: Use `(supabase as any)` for insert/update when inference fails
- **Schema**: Always update both SQL and TypeScript types in `src/types/database.ts`

**Features:**
- **Admin**: App-level security (no RLS), centralized in AuthProvider (non-blocking), server validates API routes
- **Invitations**: Token-based (64-char hex), 7-day expiry, single-use, Authorization header for API auth
- **Real-time**: Generic `useRealtimeData` hook with retry logic, ref pattern for callback stability, `useRealtimeTasks` transforms nested tag structure
- **Filters**: `usePersistedState` hook for localStorage persistence (SSR-safe, handles arrays/nulls/objects)
- **Theme**: Context + localStorage, 3 modes (light/dark/system), matchMedia for OS detection
- **Tasks**: INTEGER ranking (1000-unit spacing), sort by priority → status → ranking, tags displayed in kanban/table/dialog
- **Multi-select**: cmdk/Command grid layout (2/3 cols), search via `value={label}`, select via ID
- **Colors**: Hex in DB → RGBA utils, category backgrounds (5% opacity), character badges
- **Error boundaries**: Next.js 14 error.tsx per route, German UI, retry functionality

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

**High Priority:**
1. Mitigate localStorage loading "flash" (theme/filters flash defaults before persisted values load)
2. Auto-archive completed tasks (14-day threshold)

**Medium Priority:**
4. Fix version history dialog mobile responsiveness
5. Enhance mobile drag-and-drop UX

**Low Priority (Future Optimizations):**
6. Consolidate localStorage keys per page (single object vs multiple keys)
7. Supabase client pattern migration (lazy initialization)
8. app_metadata for admin roles (eliminates DB query)
9. JWT claims for roles (embed in token, most performant)
10. Timeout protection for auth operations (Promise.race pattern: 5s auth, 10s profiles)
11. Offline capabilities research

## Recent Changes
- **v0.15.4**: Migrate user field from `full_name` to `display_name` - updated all components, types, API routes, and tests (186 tests passing)
- **v0.15.3**: Fix /api/users authentication - added Authorization header to fetch call, enabling task private toggle visibility
- **v0.15.2**: Improve filter UX - removed auto-expand logic, collapsed filters show badges under stats, better persisted filter handling
- **v0.15.1**: Fix task tags display by transforming nested `task_tag_assignments` structure in `useRealtimeTasks` hook, fix deployment build errors
- **v0.15.0**: Centralized admin (non-blocking pattern with separate useEffects), URL redirect preservation, USER_UPDATED handler, logo SSR fix, 186 tests
- **v0.14.0**: Filter persistence (usePersistedState hook), system theme support, 52 new tests
- **v0.13.0**: Invite-only auth system, token-based registration, 39 tests
- **v0.12.x**: Version history, multi-select components, sortable tables, UI refinements