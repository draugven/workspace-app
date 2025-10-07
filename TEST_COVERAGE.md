# Test Coverage Report
**Project:** Back2Stage - Theater Production Collaboration Tool
**Last Updated:** 2025-10-07
**Version:** v0.14.0

---

## Test Coverage

### Current Test Suite Status
**Total Tests:** 205 passing across 14 test suites (+40 tests from security feature testing)
**Test Framework:** Jest + React Testing Library
**Coverage Areas:** Authentication (with admin checks, redirects, and USER_UPDATED events), protected routes, navigation (with redirect validation), hooks (real-time, persisted state), theme management, error boundaries, API routes (invitation system with 97.97% coverage)

### Test Files and Coverage

#### 1. Authentication Provider (`src/components/auth/__tests__/auth-provider.test.tsx`)
**Tests:** 21 (+5 new tests for USER_UPDATED event)
**Status:** ✅ All passing
**Coverage:** Enhanced to cover USER_UPDATED event handling
**Commit:** a31ecb6 (with new security tests)

**Coverage:**
- ✅ Initial session loading (successful, null session, errors)
- ✅ Error handling for getSession failures
- ✅ Loading state always completes (never stuck)
- ✅ Auth state changes (SIGNED_IN, SIGNED_OUT, USER_UPDATED)
- ✅ Router navigation on auth events
- ✅ Subscription cleanup on unmount
- ✅ Context usage inside/outside provider
- ✅ Admin status management on initial load (admin/non-admin users)
- ✅ Admin status error handling
- ✅ Admin status updates on SIGNED_IN event (admin/non-admin)
- ✅ Admin status reset on SIGNED_OUT event
- ✅ Redirect URL handling from query params (with security validation)
- ✅ Default redirect to root when no query param
- ✅ Complex URL redirect support (/admin/invitations)
- ✅ **NEW:** USER_UPDATED event triggers admin status re-check
- ✅ **NEW:** Admin role gains via USER_UPDATED event (false → true)
- ✅ **NEW:** Admin role losses via USER_UPDATED event (true → false)
- ✅ **NEW:** adminLoading state transitions during USER_UPDATED
- ✅ **NEW:** Error handling during USER_UPDATED admin checks

**Key Tests:**
```typescript
it('sets isAdmin to true when user is admin on initial load', async () => {
  const mockUser = { id: 'admin-123', email: 'admin@example.com' }
  (isUserAdmin as jest.Mock).mockResolvedValue(true)
  await waitFor(() => expect(result.current.loading).toBe(false))
  expect(result.current.isAdmin).toBe(true)
  expect(isUserAdmin).toHaveBeenCalledWith('admin-123')
})

it('redirects to saved URL from query param on SIGNED_IN', async () => {
  mockURLSearchParams({ redirect: '/tasks' })
  await act(async () => {
    authCallback('SIGNED_IN', { user: mockUser })
  })
  await waitFor(() => expect(mockRouter.push).toHaveBeenCalledWith('/tasks'))
})
```

---

#### 2. Navigation Utils (`src/lib/__tests__/navigation-utils.test.ts`)
**Tests:** 35 (NEW - comprehensive security testing)
**Status:** ✅ All passing
**Coverage:** 100% statements, 100% branch, 100% functions, 100% lines
**Commit:** a31ecb6 (with new security tests)

**Coverage:**

**getSafeRedirectPath() - 19 tests:**
- ✅ Returns '/' for null, undefined, empty string redirects
- ✅ Allows valid relative paths (/tasks, /admin/invitations)
- ✅ Preserves query parameters (?filter=active)
- ✅ Preserves URL fragments (#section)
- ✅ Handles complex URLs (/tasks?filter=active&sort=desc#top)
- ✅ **BLOCKS absolute URLs** (https://evil.com, http://evil.com)
- ✅ **BLOCKS protocol-relative URLs** (//evil.com, //evil.com/phishing)
- ✅ **BLOCKS dangerous protocols** (javascript:, data:, mailto:)
- ✅ Blocks paths without leading slash ("tasks" → "/")
- ✅ Handles very long paths safely
- ✅ Handles encoded characters correctly
- ✅ Handles paths with multiple slashes

**shouldHideNavigation() - 7 tests:**
- ✅ Returns true for /login
- ✅ Returns true for /accept-invite
- ✅ Returns false for all protected routes (/, /props, /tasks, /notes, /admin/invitations)

**isPublicPath() - 7 tests:**
- ✅ Returns true for /login
- ✅ Returns true for /accept-invite
- ✅ Returns false for all protected routes

**Key Tests:**
```typescript
it('should block protocol-relative URL: "//evil.com"', () => {
  const result = getSafeRedirectPath('//evil.com')
  expect(result).toBe('/')
  expect(consoleWarnSpy).toHaveBeenCalledWith(
    'Invalid redirect path (must be relative): //evil.com'
  )
})

it('should block javascript: protocol', () => {
  const result = getSafeRedirectPath('javascript:alert(1)')
  expect(result).toBe('/')
})

it('should preserve query params from relative URL', () => {
  const result = getSafeRedirectPath('/admin/invitations?status=pending')
  expect(result).toBe('/admin/invitations?status=pending')
})
```

**Security Impact:**
This test suite validates the critical `getSafeRedirectPath()` function that prevents open redirect vulnerabilities. The function is used in AuthProvider to validate redirect URLs from query parameters, ensuring attackers cannot redirect users to malicious external sites after login.

---

#### 3. Protected Route (`src/components/auth/__tests__/protected-route.test.tsx`)
**Tests:** 13
**Status:** ✅ All passing
**Coverage:** 100% statements, 100% branch, 100% functions, 100% lines
**Commit:** 2277b3a

**Coverage:**
- ✅ Loading state indicator display
- ✅ Renders children when authenticated
- ✅ Redirects to login when not authenticated
- ✅ Encodes current path in redirect query param
- ✅ Handles complex paths (/admin/invitations)
- ✅ Handles paths with special characters (query strings)
- ✅ Handles root path correctly
- ✅ Does not render children during loading
- ✅ Does not render children when redirecting
- ✅ Handles auth state transitions (loading → authenticated)

**Key Test:**
```typescript
it('encodes complex paths correctly in redirect URL', async () => {
  (usePathname as jest.Mock).mockReturnValue('/admin/invitations')
  render(<ProtectedRoute><div>Protected Content</div></ProtectedRoute>)
  await waitFor(() => {
    expect(mockRouter.push).toHaveBeenCalledWith('/login?redirect=%2Fadmin%2Finvitations')
  })
})
```

---

#### 4. Conditional Navigation (`src/components/layout/__tests__/conditional-navigation.test.tsx`)
**Tests:** 12
**Status:** ✅ All passing
**Coverage:** 100% statements, 100% branch, 100% functions, 100% lines
**Commit:** 2277b3a

**Coverage:**
- ✅ Hides navigation on /login page
- ✅ Hides navigation on /accept-invite page
- ✅ Shows navigation on all protected routes (/, /props, /tasks, /notes, /admin/invitations)
- ✅ Shows invitations link for admin users
- ✅ Hides invitations link for non-admin users
- ✅ Renders all standard navigation links
- ✅ Highlights active navigation link
- ✅ Does not highlight inactive links
- ✅ Displays user full name when available
- ✅ Falls back to email when full name not available
- ✅ Renders sign out button
- ✅ Handles paths with query parameters
- ✅ Handles nested paths correctly
- ✅ Exact path matching for HIDE_NAV_PATHS

**Key Test:**
```typescript
it('shows invitations link for admin users', () => {
  (useAuth as jest.Mock).mockReturnValue({
    user: { id: 'admin-123', email: 'admin@example.com' },
    loading: false,
    isAdmin: true,
  })
  render(<ConditionalNavigation />)
  expect(screen.getByText('Einladungen')).toBeInTheDocument()
})

it('does not show invitations link for non-admin users', () => {
  (useAuth as jest.Mock).mockReturnValue({
    user: { id: 'user-123', email: 'user@example.com' },
    loading: false,
    isAdmin: false,
  })
  render(<ConditionalNavigation />)
  expect(screen.queryByText('Einladungen')).not.toBeInTheDocument()
})
```

---

#### 5. Real-time Hook (`src/hooks/__tests__/use-realtime-data.test.tsx`)
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

#### 6. Persisted State Hook (`src/hooks/__tests__/use-persisted-state.test.tsx`)
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

#### 7. Theme Provider (`src/components/theme/__tests__/theme-provider.test.tsx`)
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

#### 8. Error Boundaries (3 test files, 9 total tests)
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

#### 9. Invitation System API Routes (4 test files, 39 total tests)
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
2. ~~use-persisted-state hook~~ ✅ Fully tested (26 tests)
3. ~~Theme provider~~ ✅ Fully tested (28 tests)
4. ~~Authentication provider~~ ✅ Fully tested with admin & redirect support (26 tests)
5. ~~Protected route~~ ✅ Fully tested (13 tests)
6. ~~Conditional navigation~~ ✅ Fully tested (12 tests)
7. use-realtime-notes-v2.tsx hook
8. Page components (props, tasks, notes, admin/invitations, accept-invite)
9. Form components (ItemForm, TaskForm, NoteForm)

**Medium Priority:**
10. Navigation component (mobile menu interactions - currently 82.6% coverage)
11. UI components (multi-select, command palette)
12. Utility functions (color-utils, auth-utils partial coverage)
13. Login form component (currently 0% coverage)
14. Auth setup component (currently 0% coverage)

**Low Priority:**
15. Footer component (currently 0% coverage)
16. Badge components (StatusBadge, PriorityBadge)

---

## Testing Results

### After Security Feature Testing (v0.14.0 + security tests)
```bash
✅ npm run lint       # No warnings or errors
✅ npm run typecheck  # No TypeScript errors
✅ npm run build      # Successful compilation
✅ npm test           # 205/205 tests passing (+40 new tests: 5 USER_UPDATED events, 35 navigation security)
```

**Test Suite Summary:**
- Test Suites: 14 passed, 14 total (+1 new suite: navigation-utils)
- Tests: 205 passed, 205 total (+40 new tests)
- Snapshots: 0 total
- Time: ~3.2 seconds
- Invitation System Coverage: 97.97%
- Auth Components Coverage: Enhanced with USER_UPDATED event handling
- Navigation Security Coverage: 100% (getSafeRedirectPath, redirect validation)

**Component-Specific Coverage:**
- `auth-provider.tsx`: Enhanced with USER_UPDATED event handling (5 new tests)
- `protected-route.tsx`: 100% statements, 100% branch, 100% functions, 100% lines
- `conditional-navigation.tsx`: 100% statements, 100% branch, 100% functions, 100% lines
- `navigation-utils.ts`: 100% statements, 100% branch, 100% functions, 100% lines (35 tests)
- `navigation.tsx`: 82.6% statements, 52.38% branch, 33.33% functions, 86.36% lines (uncovered: mobile menu event handlers)

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
   - [x] ~~Add tests for use-persisted-state hook~~ ✅ Completed (26 tests)
   - [x] ~~Add tests for theme provider~~ ✅ Completed (28 tests)
   - [x] ~~Add tests for authentication provider with admin checks~~ ✅ Completed (26 tests)
   - [x] ~~Add tests for protected route with redirect URL handling~~ ✅ Completed (13 tests)
   - [x] ~~Add tests for conditional navigation~~ ✅ Completed (12 tests)
   - [ ] Add tests for use-realtime-notes-v2.tsx hook
   - [ ] Add tests for page components (props, tasks, notes)
   - [ ] Add tests for form components (ItemForm, TaskForm, NoteForm)
   - [ ] Add tests for admin/invitations page
   - [ ] Add tests for accept-invite page
   - [ ] Add tests for login form component

2. **Medium Priority Tests:**
   - [ ] Improve navigation component coverage (mobile menu interactions)
   - [ ] Add tests for UI components (multi-select, command palette)
   - [ ] Add tests for utility functions (color-utils, auth-utils)
   - [ ] Test filter persistence integration in actual page components
   - [ ] Add tests for auth setup component

3. **Low Priority Tests:**
   - [ ] Add tests for footer component
   - [ ] Add tests for badge components (StatusBadge, PriorityBadge)

---

**Summary of Recent Testing Work (v0.14.0 + Security Tests):**
- Added 40 new tests for authentication security features (+24% increase)
- **NEW:** 5 USER_UPDATED event tests for dynamic admin role changes
- **NEW:** 35 navigation security tests (redirect validation, open redirect prevention)
- Enhanced navigation-utils.ts with protocol-relative URL blocking (//evil.com)
- Achieved 100% coverage on navigation-utils.ts (getSafeRedirectPath, isPublicPath, shouldHideNavigation)
- All 205 tests passing across 14 test suites
- Comprehensive security testing for authentication redirects and URL validation

**Security Impact:**
- Prevents open redirect vulnerabilities via getSafeRedirectPath()
- Blocks absolute URLs (https://evil.com), protocol-relative URLs (//evil.com), and dangerous protocols (javascript:, data:, mailto:)
- Ensures admin role changes are immediately reflected in UI via USER_UPDATED events
- Validates all redirect URLs before navigation, ensuring attackers cannot redirect users to external sites

**Known Issues:**
- React act() warnings in auth-provider tests (informational only, tests pass)
- These warnings occur due to async state updates in auth flow and do not affect functionality

---

**Last Updated:** 2025-10-07
**Next Review:** After adding tests for use-realtime-notes-v2.tsx or page components
