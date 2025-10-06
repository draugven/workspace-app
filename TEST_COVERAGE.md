# Test Coverage Report
**Project:** Back2Stage - Theater Production Collaboration Tool
**Last Updated:** 2025-10-06
**Version:** v0.13.0

---

## Test Coverage

### Current Test Suite Status
**Total Tests:** 75 passing across 9 test suites
**Test Framework:** Jest + React Testing Library
**Coverage Areas:** Authentication, hooks, error boundaries, API routes (invitation system with 97.97% coverage)

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

#### 3. Error Boundaries (3 test files, 9 total tests)
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

#### 4. Invitation System API Routes (4 test files, 39 total tests)
**Files:**
- `src/app/api/admin/invitations/create/__tests__/route.test.ts` (11 tests)
- `src/app/api/admin/invitations/[id]/__tests__/route.test.ts` (9 tests)
- `src/app/api/invitations/validate/__tests__/route.test.ts` (6 tests)
- `src/app/api/invitations/accept/__tests__/route.test.ts` (10 tests)

**Status:** ✅ All passing
**Implementation:** Invite-only authentication system

**Coverage:**

**4.1 Create Invitation API (11 tests):**
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

**4.2 Revoke Invitation API (9 tests):**
- ✅ Returns 401 when user is not authenticated
- ✅ Returns 401 when auth error occurs
- ✅ Returns 403 when user is not an admin
- ✅ Revokes invitation successfully
- ✅ Updates status to 'revoked'
- ✅ Handles revocation with different invitation IDs
- ✅ Returns 500 when database operation fails
- ✅ Does not revoke if auth check fails before database call

**4.3 Validate Invitation API (6 tests):**
- ✅ Returns 400 when token is missing
- ✅ Returns 400 when invitation does not exist
- ✅ Validates pending invitation successfully
- ✅ Returns 400 when invitation is already accepted
- ✅ Marks invitation as expired when past expiry date
- ✅ Returns 500 when unexpected error occurs

**4.4 Accept Invitation API (10 tests):**
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
2. use-realtime-notes-v2.tsx hook
3. Page components (props, tasks, notes, admin/invitations, accept-invite)
4. Form components (ItemForm, TaskForm, NoteForm)

**Medium Priority:**
5. UI components (multi-select, command palette)
6. Utility functions (color-utils, auth-utils)
7. Theme provider

**Low Priority:**
8. Layout components (Navigation, Footer)
9. Badge components (StatusBadge, PriorityBadge)

---

## Testing Results

### After Critical Fixes & Invitation System Implementation
```bash
✅ npm run lint       # No warnings or errors
✅ npm run typecheck  # No TypeScript errors
✅ npm run build      # Successful compilation
✅ npm test           # 75/75 tests passing (39 tests for invitation system + 7 new for displayName)
```

**Test Suite Summary:**
- Test Suites: 9 passed, 9 total
- Tests: 75 passed, 75 total
- Snapshots: 0 total
- Time: ~1.6 seconds
- Invitation System Coverage: 97.97%

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
   - [ ] Add tests for use-realtime-notes-v2.tsx hook
   - [ ] Add tests for page components (props, tasks, notes)
   - [ ] Add tests for form components (ItemForm, TaskForm, NoteForm)
   - [ ] Add tests for admin/invitations page
   - [ ] Add tests for accept-invite page

2. **Medium Priority Tests:**
   - [ ] Add tests for UI components (multi-select, command palette)
   - [ ] Add tests for utility functions (color-utils, auth-utils)
   - [ ] Add tests for theme provider

3. **Low Priority Tests:**
   - [ ] Add tests for layout components (Navigation, Footer)
   - [ ] Add tests for badge components (StatusBadge, PriorityBadge)

---

**Last Updated:** 2025-10-06
**Next Review:** After adding tests for use-realtime-notes-v2.tsx or page components
