# Performance & UX Analysis

**Date:** 2025-10-07
**Context:** Filter persistence testing revealed several UX and performance issues

---

## 1. Data Fetching Delay When Switching Pages

### Symptoms
~1 second delay when navigating between pages (`/props`, `/tasks`, `/notes`) to display data from Supabase.

### Root Cause
Each page uses its own real-time hook (`useRealtimeItems`, `useRealtimeTasks`, `useRealtimeNotes`) that:
1. Mounts the component
2. Fetches data from Supabase
3. Sets up real-time subscription
4. Applies persisted filters from localStorage

This is standard behavior for the current architecture where each page independently manages its data.

### Why Real-time Hooks Only Work Within Current Page
Real-time subscriptions are component-scoped:
- When you navigate away from a page, the component unmounts
- The real-time subscription is cleaned up
- New page creates its own subscription from scratch
- Data must be fetched fresh each time

### Possible Solutions

| Solution | Pros | Cons | Effort |
|----------|------|------|--------|
| **Client-side caching** (React Query, SWR) | Instant navigation, automatic background refresh, stale-while-revalidate | Additional dependency, learning curve | Medium |
| **Global state** (Zustand, Redux) | Share data across pages, single subscription | More complex state management, manual sync logic | High |
| **Prefetching** | Load next likely page in background | Only helps for predicted routes, extra bandwidth | Low |
| **Better loading states** (skeleton screens) | Perceived performance improvement, already in TODO 7 | Doesn't eliminate delay, just makes it feel faster | Low |
| **Accept it** | No changes needed, 1 second is reasonable for small teams | Delay remains | None |

### Recommendation
For a theater production tool with <20 concurrent users:
- **Short-term:** Improve loading states (skeleton screens) - already in TODO 7
- **Long-term:** If delay becomes problematic, implement React Query for caching
- **Reality check:** 1 second is acceptable UX for this type of collaborative app

---

## 2. Drag-and-Drop Issues

### Issue 2a: Table View Drag-and-Drop NOT Implemented

**Status:** ❌ Not implemented

`tasks-table.tsx` is a plain table with no drag-and-drop functionality. Only Kanban board view supports drag-and-drop.

**Decision needed:** Should table view support drag-and-drop reordering?

---

### Issue 2b: Ranking NOT Visible in Table View

**Current behavior:**
- Table columns: Aufgabe, Status, Priorität, Abteilung, Fälligkeitsdatum, Tags, Zugewiesen
- Ranking is used for sorting but NOT displayed

**Current sorting logic** (`tasks-table.tsx:50-64`):
1. Priority (desc) - urgent → high → medium → low
2. Status (desc) - not_started → in_progress → blocked → done
3. Ranking (asc) - tertiary sort within same priority+status

**Problem:** Users can't see or understand the ranking that drives Kanban board ordering.

**Proposed solution:**
- Add "Rang" (Ranking) column as **first column** in table view
- Change default sort to ranking (asc) in table view
- Make it clear this is the same order as Kanban board

---

### Issue 2c: Ranking Calculation is Broken

#### Symptoms (from user's database inspection)
Ranking values in database (sorted asc):
```
3, 7, [incrementing by 1 correctly until 51], 420, 482, 544, 549, 677, 802, 1052, 2052...
```

**User experience:**
- First drag-and-drop of a task → automatically jumps to bottom of list
- Nearly impossible to position tasks high in the list
- Tasks that have been re-ranked before can be moved within their "cluster" of high numbers

#### Root Causes

**1. Insert Before First Task Bug** (`task-board.tsx:365`)
```typescript
// If dropping before first task
if (targetIndexInFiltered === 0) {
  newRanking = Math.max(targetTaskInFiltered.ranking - 1000, 1)
}
```

**Problem:**
- If first task has ranking = 7: `Math.max(7 - 1000, 1) = 1`
- Next drag to top: `Math.max(1 - 1000, 1) = 1` ❌ **Ranking collision!**
- Task doesn't move or behaves unpredictably

**2. Small Gap Fallback Creates Cascading Large Numbers** (`task-board.tsx:369-376`)
```typescript
// Insert between previous task and target task
const prevTask = tasksWithoutActive[targetIndexInFiltered - 1]
const gap = targetTaskInFiltered.ranking - prevTask.ranking

if (gap > 1) {
  newRanking = Math.floor(prevTask.ranking + gap / 2)
} else {
  newRanking = prevTask.ranking + 500  // ⚠️ Creates 420, 482, 544...
}
```

**Problem:**
- Initial tasks have small rankings (3, 7, 8, 9...)
- Dragging between them creates gap ≤ 1
- Fallback adds 500: `7 + 500 = 507`, `507 + 500 = 1007`...
- No rebalancing logic means numbers grow forever

**3. Initial Tasks May Have Inconsistent Rankings**
- Tasks created before ranking system: `ranking = null` or `0`
- Treated as 0 in sorting, causes ordering issues
- Creates tight clusters at low numbers

#### Common Ranking Strategies

| Strategy | How it Works | Used By | Pros | Cons |
|----------|-------------|---------|------|------|
| **Fractional Indexing** | String-based: "a0", "a1", "a0.5" | Jira, Linear, Figma | Infinite precision, no rebalancing needed | String sorting, complex midpoint calculation |
| **Rebalancing** | When gap < threshold, recalculate entire group | Many custom systems | Simple integers, self-healing | Requires batch updates, temporarily inconsistent |
| **Lexicographic Ordering** | Base-36 strings with midpoint calculation | Notion, Asana | Sortable strings, good for distributed systems | More complex implementation |
| **Large Spacing** | Start with 1000000 instead of 1000 | Simple systems | More room between items | Eventually runs out, same problem |

#### Recommended Fix: Rebalancing Logic

Add automatic rebalancing when gap becomes too small:

```typescript
// Threshold for triggering rebalance
const MIN_GAP = 100

// Check if gap is too small
if (gap <= MIN_GAP) {
  // Trigger rebalancing: reassign rankings with proper spacing
  const allTasksInGroup = tasksWithoutActive
    .filter(t => t.status === targetStatus && t.priority === activeTask.priority)
    .sort((a, b) => a.ranking - b.ranking)

  // Insert active task at target position
  allTasksInGroup.splice(targetIndexInFiltered, 0, activeTask)

  // Reassign rankings: 1000, 2000, 3000...
  const updates = allTasksInGroup.map((task, index) => ({
    id: task.id,
    ranking: (index + 1) * 1000
  }))

  // Batch update all tasks in group
  await Promise.all(updates.map(u => updateTask(u.id, { ranking: u.ranking })))

  return // Exit early, rebalancing handled all updates
}
```

**Benefits:**
- Self-healing: fixes tight clusters automatically
- Maintains 1000-unit spacing (room for 999 insertions between any two items)
- No infinite growth
- Transparent to users

**Tradeoffs:**
- Batch database updates (could be slow with 100+ tasks in one priority+status)
- Temporary inconsistency during rebalance
- More complex logic

---

## 3. Manual Testing Checklist for Filter/Sort/Theme Persistence

### Theme
- [ ] Toggle theme light → dark → system → light
- [ ] Refresh page after each change
- [ ] Verify theme persists correctly

### Props Page (`/props`)
- [ ] Set category filter → refresh → verify persists
- [ ] Enter search term → refresh → verify persists
- [ ] Select source filter → refresh → verify persists
- [ ] Select multiple characters → refresh → verify persists
- [ ] Select status filter → refresh → verify persists
- [ ] Change sort column (e.g., Name → Status) → refresh → verify persists
- [ ] Change sort direction (asc ↔ desc) → refresh → verify persists
- [ ] Expand/collapse filters → refresh → verify does NOT persist (defaults to collapsed)

### Tasks Page (`/tasks`)
- [ ] Set department filter → refresh → verify persists
- [ ] Select multiple tags → refresh → verify persists
- [ ] Set status filter → refresh → verify persists
- [ ] Set priority filter → refresh → verify persists
- [ ] Set assignee filter → refresh → verify persists
- [ ] Uncheck "Erledigte Aufgaben anzeigen" → refresh → verify persists
- [ ] Switch view mode (board ↔ table) → refresh → verify persists
- [ ] In table view: change sort column → refresh → verify persists
- [ ] In table view: change sort direction → refresh → verify persists
- [ ] Expand/collapse filters → refresh → verify does NOT persist (defaults to collapsed)

### Notes Page (`/notes`)
- [ ] Set department filter → refresh → verify persists
- [ ] Enter search term → refresh → verify persists
- [ ] Expand/collapse filters → refresh → verify does NOT persist (defaults to collapsed)

### Edge Cases
- [ ] **Incognito mode:** Open app, verify defaults load (no persisted values), verify no crashes
- [ ] **Clear localStorage:** Developer tools → Storage → Clear All → Refresh → Verify defaults load correctly
- [ ] **Multiple tabs:** Open two tabs, change filter in Tab 1, refresh Tab 2, verify Tab 2 uses old value until refresh
- [ ] **Corrupt localStorage value:** Developer tools → Storage → Manually edit key to invalid JSON → Refresh → Verify error handling (falls back to defaults)
- [ ] **Invalid filter value:** Set localStorage key to non-existent category ID → Refresh → Verify graceful fallback

### Cross-browser Testing
- [ ] Chrome (primary development browser)
- [ ] Firefox
- [ ] Safari

### Performance Testing
- [ ] Filter persistence with 100+ items/tasks/notes
- [ ] Verify no localStorage quota errors (typically 5-10MB limit)
- [ ] Check for memory leaks (DevTools → Memory → Take heap snapshot before/after filter changes)

---

## Priorities & Recommendations

### High Priority
1. **Fix ranking calculation** (Issue 2c) - Highest impact on user experience
   - Implement rebalancing logic when gap < 100
   - Add database migration to fix existing broken rankings

2. **Add ranking column to table view** (Issue 2b) - Improves transparency
   - Make it first column
   - Default sort by ranking (asc)

### Medium Priority
3. **Improve loading states** (Issue 1) - Better perceived performance
   - Skeleton screens for tables/boards
   - Smooth transitions between pages
   - Already in TODO 7

### Low Priority / Future
4. **Implement table view drag-and-drop** (Issue 2a) - Nice to have
   - Lower priority since Kanban board covers this use case
   - Consider using @dnd-kit/sortable on table rows

5. **Client-side caching** (Issue 1) - Only if performance becomes problem
   - React Query implementation
   - Shared cache across pages

---

## 4. Manual Testing Checklist for Auth & Navigation Optimizations

**Context:** Tests for TODO #8 fixes (redirect preservation, admin optimization, navigation architecture)

### Happy Paths

**Navigation Architecture:**
- Navigate between pages (/props → /tasks → /notes → /) and verify navigation stays visible without flashing
- Verify navigation hides on /login and /accept-invite pages
- Verify navigation shows correctly on all other pages after login

**Redirect After Login:**
- Visit /tasks while logged out, login, verify redirected back to /tasks (not /)
- Visit /notes while logged out, login, verify redirected back to /notes
- Visit /admin/invitations while logged out, login as admin, verify redirected back to /admin/invitations

**Admin Status:**
- Login as admin user, verify "Einladungen" nav item appears
- Login as non-admin user, verify "Einladungen" nav item does NOT appear
- Login as admin, navigate between pages, verify admin nav item persists without re-checking
- Login as admin, open /admin/invitations page, verify access granted without flashing

**User Display:**
- Login and verify user full name appears in navigation (desktop)
- Login and verify user full name appears in mobile menu
- Login with user without full name, verify email displays instead

### Unhappy Paths

**Invalid Redirect Attempts:**
- Manually visit /login?redirect=https://evil.com, login, verify redirected to / (NOT evil.com)
- Manually visit /login?redirect=//evil.com, login, verify redirected to / (NOT evil.com)
- Manually visit /login?redirect=javascript:alert(1), login, verify redirected to / (script not executed)
- Visit /login?redirect=/invalid-route, login, verify redirected to /invalid-route (shows 404, but safe)

**Admin Status Edge Cases:**
- Login as admin, have another user revoke admin role in database, refresh page, verify admin nav item disappears
- Login as non-admin, have another user grant admin role in database, refresh page, verify admin nav item appears
- Try to access /admin/invitations as non-admin (via direct URL), verify access denied
- Login as admin but with slow admin check, verify navigation doesn't flash admin items

**Session Expiry:**
- Visit /tasks while logged in, let session expire, try to navigate, verify redirected to /login?redirect=%2Ftasks
- Logout on /notes page, verify redirected to /login (no redirect param needed)

### Edge Cases

**Multi-Tab Scenarios:**
- Open Tab A and Tab B, login in Tab A, refresh Tab B, verify logged in state syncs
- Login as admin in Tab A, revoke admin in Tab B, refresh Tab A, verify admin status updates
- Change redirect param in Tab A URL while on /login, login, verify redirect works correctly

**URL Manipulation:**
- Visit /login?redirect=%2Ftasks%3Ffilter%3Dactive (encoded complex URL), login, verify redirected to /tasks?filter=active
- Visit /login?redirect=/tasks&malicious=param, login, verify only /tasks part used
- Visit /login with no redirect param, login, verify redirected to / (dashboard)
- Visit /login?redirect=, login, verify redirected to / (empty redirect handled)

**Navigation State:**
- Navigate to /tasks, refresh page, verify stays on /tasks (not redirected to /)
- Open /notes in new tab (direct URL), verify page loads correctly
- Use browser back/forward buttons, verify navigation state updates correctly

**Admin Loading State:**
- Login as admin with artificially slow network, verify admin items don't flash in after delay
- Login as admin, check network tab for duplicate admin check queries (should be 1 per session)
- Login as non-admin, verify no unnecessary admin check queries

**Mobile Responsiveness:**
- Open mobile menu, verify all navigation items present
- Open mobile menu as admin, verify "Einladungen" item present
- Navigate between pages on mobile, verify menu closes correctly
- Login on mobile, verify redirect works correctly

**Error Handling:**
- Simulate network error during admin check, verify defaults to non-admin safely
- Simulate network error during redirect, verify safe fallback behavior
- Clear all cookies, visit protected route, verify redirect to login works

---

## Related TODOs

From `CLAUDE.md`:

- **TODO 5:** Enhance mobile drag-and-drop UX (related to Issue 2)
- **TODO 6:** Offline capabilities research (related to Issue 1)
- **TODO 7:** Mitigate localStorage loading "flash" / Add loading states (related to Issue 1)
- **TODO 9:** Improve filter UX - allow collapsing active filters (partially addressed in v0.14.0)
