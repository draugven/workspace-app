# Test Coverage Report
**Project:** Back2Stage - Theater Production Collaboration Tool
**Last Updated:** 2025-10-07
**Version:** v0.13.0

---

## Test Coverage

### Current Test Suite Status
**Total Tests:** 127 passing across 11 test suites
**Test Framework:** Jest + React Testing Library
**Coverage Areas:** Authentication, hooks (real-time, persisted state), theme management, error boundaries, API routes (invitation system with 97.97% coverage)

### Test Files and Coverage

#### 1. Authentication (`src/components/auth/__tests__/auth-provider.test.tsx`)
**Tests:** 11
**Status:** ✅ All passing
**Commit:** `9a3b736`

**Coverage:**
- ✅ Initial session loading (successful, null session, errors)
- ✅ Error handling for getSession failures
- ✅ Loading state always completes (never stuck)
- ✅ Auth state changes (SIGNED_IN, SIGNED_OUT)
- ✅ Router navigation on auth events
- ✅ Subscription cleanup on unmount
- ✅ Context usage inside/outside provider

**Key Test:**
```typescript
it('handles getSession error gracefully', async () => {
  mockGetSession.mockRejectedValue(new Error('Session fetch failed'))
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.user).toBeNull()
  expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to get session:', mockError)
})
```

---

#### 2. Real-time Hook (`src/hooks/__tests__/use-realtime-data.test.tsx`)
**Tests:** 16
**Status:** ✅ All passing
**Commit:** `2277b3a`

**Coverage:**
- ✅ Data loading from Supabase
- ✅ Real-time subscription setup and cleanup
- ✅ Callback invocations (insert, update, delete)
- ✅ Ref pattern for stable callbacks
- ✅ Subscription not recreated on callback changes
- ✅ Channel cleanup on unmount
- ✅ Optional logging functionality

**Key Test (Ref Pattern):**
```typescript
it('uses latest callbacks without recreating subscription', async () => {
  const { rerender } = renderHook(...)
  rerender({ onInsert: onInsertMock2 })
  // Should NOT recreate subscription
  expect(mockOn).toHaveBeenCalledTimes(1)
  // But SHOULD use latest callback
  expect(onInsertMock2).toHaveBeenCalled()
})
```

---

#### 3. Persisted State Hook (`src/hooks/__tests__/use-persisted-state.test.tsx`)
**Tests:** 24
**Status:** ✅ All passing
**Commit:** `c149875` (current session)

**Coverage:**
- ✅ Initialization from localStorage or default values
- ✅ Schema migration (merging stored values with new defaults)
- ✅ State updates and persistence to localStorage
- ✅ Functional state updates (prev => newState)
- ✅ SSR safety (typeof window checks)
- ✅ Error handling for JSON.parse failures
- ✅ Error handling for localStorage.getItem errors
- ✅ Error handling for localStorage.setItem errors (quota exceeded)
- ✅ Multiple hook instances with different keys
- ✅ Multiple hook instances sharing same key
- ✅ Edge cases (empty keys, long keys, null/undefined values, complex nested objects)

**Key Tests:**
```typescript
it('merges stored values with default object to handle schema changes', () => {
  localStorage.setItem(TEST_KEY, JSON.stringify({ count: 10 }))
  const newDefaultValue = { count: 0, name: 'test', newField: 'default' }
  const { result } = renderHook(() => usePersistedState(TEST_KEY, newDefaultValue))
  // Should merge: keep existing count, add new fields from default
  expect(result.current[0]).toEqual({ count: 10, name: 'test', newField: 'default' })
})

it('handles localStorage.setItem errors gracefully', () => {
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
    throw new Error('QuotaExceededError')
  })
  act(() => { result.current[1]({ count: 999, name: 'test' }) })
  // State should still update even if persistence fails
  expect(result.current[0]).toEqual({ count: 999, name: 'test' })
})
```

---

#### 4. Theme Provider (`src/components/theme/__tests__/theme-provider.test.tsx`)
**Tests:** 28
**Status:** ✅ All passing
**Commit:** `c149875` (current session)

**Coverage:**
- ✅ Initialization with default theme (light/dark/system)
- ✅ Loading theme preference from localStorage
- ✅ Custom storage key support
- ✅ System theme detection (prefers-color-scheme)
- ✅ System theme change listener setup and cleanup
- ✅ Resolved theme calculation (system → light/dark)
- ✅ Theme persistence to localStorage
- ✅ DOM updates (applying/removing theme classes)
- ✅ Theme toggle cycling (light → dark → system → light)
- ✅ useTheme hook context validation
- ✅ SSR safety (typeof window checks)
- ✅ Error handling for localStorage read/write failures
- ✅ Integration tests (persistence across provider instances)

**Key Tests:**
```typescript
it('listens for system theme changes', async () => {
  const wrapper = ({ children }) => (
    <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
  )
  const { result } = renderHook(() => useTheme(), { wrapper })
  expect(result.current.resolvedTheme).toBe('light')
  // Simulate system theme change to dark
  act(() => { mediaListener({ matches: true }) })
  await waitFor(() => expect(result.current.resolvedTheme).toBe('dark'))
})

it('cycles through all themes correctly', () => {
  act(() => { result.current.toggleTheme() }) // light -> dark
  expect(result.current.theme).toBe('dark')
  act(() => { result.current.toggleTheme() }) // dark -> system
  expect(result.current.theme).toBe('system')
  act(() => { result.current.toggleTheme() }) // system -> light
  expect(result.current.theme).toBe('light')
})
```

---

#### 5. Error Boundaries (3 test files, 9 total tests)
**Files:**
- `src/app/props/__tests__/error.test.tsx` (3 tests)
- `src/app/tasks/__tests__/error.test.tsx` (3 tests)
- `src/app/notes/__tests__/error.test.tsx` (3 tests)

**Status:** ✅ All passing
**Commit:** `2277b3a`

**Coverage (per boundary):**
- ✅ Renders route-specific German error messages
- ✅ Calls reset function when retry button clicked
- ✅ Logs errors with correct prefix

---

#### 6. Invitation System API Routes (4 test files, 39 total tests)
**Files:**
- `src/app/api/admin/invitations/create/__tests__/route.test.ts` (11 tests)
- `src/app/api/admin/invitations/[id]/__tests__/route.test.ts` (9 tests)
- `src/app/api/invitations/validate/__tests__/route.test.ts` (6 tests)
- `src/app/api/invitations/accept/__tests__/route.test.ts` (10 tests)

**Status:** ✅ All passing
**Implementation:** Invite-only authentication system

**Coverage:**

**6.1 Create Invitation API (11 tests):**
- ✅ Returns 401 when user is not authenticated
- ✅ Returns 401 when auth error occurs
- ✅ Returns 403 when user is not an admin
- ✅ Returns 400 when email is missing
- ✅ Returns 400 when email is invalid format
- ✅ Creates invitation successfully with correct data
- ✅ Returns 409 when email already has pending invitation
- ✅ Returns 500 when database operation fails
- ✅ Includes invited_by field in insert
- ✅ Handles unexpected errors gracefully

**6.2 Revoke Invitation API (9 tests):**
- ✅ Returns 401 when user is not authenticated
- ✅ Returns 401 when auth error occurs
- ✅ Returns 403 when user is not an admin
- ✅ Revokes invitation successfully
- ✅ Updates status to 'revoked'
- ✅ Handles revocation with different invitation IDs
- ✅ Returns 500 when database operation fails
- ✅ Does not revoke if auth check fails before database call

**6.3 Validate Invitation API (6 tests):**
- ✅ Returns 400 when token is missing
- ✅ Returns 400 when invitation does not exist
- ✅ Validates pending invitation successfully
- ✅ Returns 400 when invitation is already accepted
- ✅ Marks invitation as expired when past expiry date
- ✅ Returns 500 when unexpected error occurs

**6.4 Accept Invitation API (10 tests):**
- ✅ Returns 500 when NEXT_PUBLIC_SUPABASE_URL is missing
- ✅ Returns 400 when token is missing
- ✅ Returns 400 when email is missing
- ✅ Returns 400 when password is missing
- ✅ Returns 400 when invitation does not exist
- ✅ Returns 400 when invitation is expired
- ✅ Creates user with email and password
- ✅ Creates default user role
- ✅ Returns 409 when user already exists
- ✅ Returns 200 with success and user data

**Test Infrastructure:**
- Created `src/test-utils/api-route-helpers.ts` with `createMockNextRequest()` helper
- Enhanced `jest.setup.js` with Next.js server component mocks and Edge runtime polyfills
- Comprehensive mocking of Supabase client, auth utilities, and environment variables

---

### Testing Infrastructure

**Configuration:**
- `jest.config.js` - Next.js integration with jsdom environment
- `jest.setup.js` - Global test-dom matchers, Next.js server component mocks, Edge runtime polyfills
- `src/types/jest-dom.d.ts` - TypeScript type definitions
- `src/test-utils/api-route-helpers.ts` - Helper utilities for testing API routes

**Test Commands:**
```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Generate coverage report
npm test -- --testPathPatterns=invitations # Run specific test suite
```

---

### Areas Not Yet Tested

**High Priority for Testing:**
1. ~~API routes~~ ✅ Invitation API routes fully tested (39 tests)
2. ~~use-persisted-state hook~~ ✅ Fully tested (24 tests)
3. ~~Theme provider~~ ✅ Fully tested (28 tests)
4. use-realtime-notes-v2.tsx hook
5. Page components (props, tasks, notes, admin/invitations, accept-invite)
6. Form components (ItemForm, TaskForm, NoteForm)

**Medium Priority:**
7. UI components (multi-select, command palette)
8. Utility functions (color-utils, auth-utils)

**Low Priority:**
9. Layout components (Navigation, Footer)
10. Badge components (StatusBadge, PriorityBadge)

---

## Testing Results

### After Filter Persistence & System Theme Implementation
```bash
✅ npm run lint       # No warnings or errors
✅ npm run typecheck  # No TypeScript errors
✅ npm run build      # Successful compilation
✅ npm test           # 127/127 tests passing (+52 new tests: 24 use-persisted-state, 28 theme-provider)
```

**Test Suite Summary:**
- Test Suites: 11 passed, 11 total
- Tests: 127 passed, 127 total
- Snapshots: 0 total
- Time: ~1.7 seconds
- Invitation System Coverage: 97.97%
- New Features Coverage: 100% (use-persisted-state, theme-provider)

### Build Output
```
Route (app)                              Size     First Load JS
┌ ○ /                                    2.95 kB         152 kB
├ ○ /login                               3.66 kB         143 kB
├ ○ /notes                               8.65 kB         195 kB
├ ○ /props                               28.4 kB         220 kB
└ ○ /tasks                               28.4 kB         220 kB
+ First Load JS shared by all            87.4 kB
```

---

## Next Session Tasks

When continuing test coverage work, prioritize in this order:

1. **High Priority Tests:**
   - [x] ~~Add tests for use-persisted-state hook~~ ✅ Completed (24 tests)
   - [x] ~~Add tests for theme provider~~ ✅ Completed (28 tests)
   - [ ] Add tests for use-realtime-notes-v2.tsx hook
   - [ ] Add tests for page components (props, tasks, notes)
   - [ ] Add tests for form components (ItemForm, TaskForm, NoteForm)
   - [ ] Add tests for admin/invitations page
   - [ ] Add tests for accept-invite page

2. **Medium Priority Tests:**
   - [ ] Add tests for UI components (multi-select, command palette)
   - [ ] Add tests for utility functions (color-utils, auth-utils)
   - [ ] Test filter persistence integration in actual page components

3. **Low Priority Tests:**
   - [ ] Add tests for layout components (Navigation, Footer)
   - [ ] Add tests for badge components (StatusBadge, PriorityBadge)

---

**Last Updated:** 2025-10-07
**Next Review:** After adding tests for use-realtime-notes-v2.tsx or page components
