# Supabase Auth Hanging Promises: Root Cause Validated and Best Practices

**Your diagnosis is correct.** You've encountered a documented Supabase bug where async operations in auth callbacks create deadlocks that hang all subsequent promises. Official Supabase documentation explicitly warns: "There is currently a bug in supabase-js which results in a deadlock if any async API call is made in onAuthStateChange code." Making your auth initialization callback async and awaiting a database query for admin checks is the exact pattern that causes indefinite hangs on page refresh. The solution is straightforward: never await Supabase operations inside auth callbacks, and move supplementary data fetching (like role checks) into separate, non-blocking useEffect hooks.

## The confirmed deadlock pattern

The Supabase troubleshooting documentation confirms what you discovered: when you make **any** async API call inside an `onAuthStateChange` callback, it creates a deadlock where the next Supabase call using that client hangs indefinitely. The docs state: "A callback can be an async function and it runs synchronously during the processing of the changes causing the event. You can easily create a dead-lock by using await on a call to another method of the Supabase library."

Your scenario matches this pattern exactly. When you added async/await for the admin role database query inside your auth provider's initialization callback (introduced in v0.14.0), you created a synchronous deadlock. On page refresh (Cmd+R), the auth state change event fires, your async callback starts, but the database query never resolves because the Supabase client is locked waiting for the callback to complete—a classic circular dependency. This is why reverting to the version before admin checks fixed the issue.

**What triggers the hang on refresh specifically:** Page refreshes force token validation and session restoration, triggering `onAuthStateChange` events. During hydration in Next.js App Router, if middleware has already validated the session with cookies but the client-side code has a stale or mismatched localStorage state, the client attempts to synchronize. Your async callback blocks this synchronization, causing all subsequent auth operations to hang indefinitely. The issue is intermittent because it depends on exact timing of middleware execution, client hydration, and localStorage state.

## GitHub issue #35754 status

**Issue exists and is documented but lacks official resolution.** The GitHub issue #35754 titled "Client-side supabase.auth.getUser() hangs indefinitely when returning to page after inactivity" is currently open in the main Supabase repository with labels `bug`, `external-issue`, and `to-triage`. 

**Key details from the issue:**
- Reported May 19, 2025 by a developer using Next.js 15.2.3 with @supabase/supabase-js 2.49.2
- Symptom: `getUser()` hangs after 30+ minutes of inactivity when users close tabs and return
- The hang is confirmed reproducible via Promise.race timeout (10 seconds)
- Clearing browser cookies temporarily resolves it, suggesting stale session cookie handling
- **No official Supabase team response yet**—still awaiting triage

**Community workaround from the issue:** Implement timeout protection using Promise.race:

```javascript
const getUserPromise = supabase.auth.getUser();
const timeoutPromise = new Promise((_, reject) =>
  setTimeout(() => reject(new Error('getUser timed out after 10s')), 10000)
);

try {
  const result = await Promise.race([getUserPromise, timeoutPromise]);
} catch (e) {
  console.error('Timeout or error:', e);
  // Fallback: clear session and redirect to login
}
```

While your root cause (async callback deadlock) is different from issue #35754 (stale session cookies after inactivity), both manifest as hanging auth promises. Your specific issue is the documented deadlock bug, not the token refresh problem described in #35754.

## Official Next.js 14 App Router setup patterns

Supabase provides definitive patterns for Next.js 14 App Router using the **@supabase/ssr** package (not the deprecated auth-helpers). Here's what matters for your setup:

### Critical initialization rules

**Two client types required:**
- `createBrowserClient` for Client Components (your auth provider)
- `createServerClient` for Server Components, middleware, and Route Handlers

**NOT singleton patterns:** Both client creation functions should be called fresh each time, not cached as singletons. This is intentional—the official pattern is "lazy initialization" where you create clients on-demand per request/render.

**Client Component pattern (utils/supabase/client.ts):**
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

**Middleware is mandatory:** Your middleware must call `await supabase.auth.getUser()` to refresh expired tokens and pass refreshed tokens to both Server Components (via request.cookies.set) and browser (via response.cookies.set). This is essential for preventing stale session issues.

**Critical middleware warning:** Official docs emphasize: "IMPORTANT: Avoid writing any logic between createServerClient and supabase.auth.getUser(). A simple mistake could make it very hard to debug issues with users being randomly logged out." This is similar to the callback deadlock—don't insert blocking operations in the critical auth path.

### The async callback anti-pattern warning

Official documentation explicitly addresses your exact scenario:

**From Supabase docs on onAuthStateChange:**
- ❌ Avoid using async functions as callbacks
- ❌ Limit the number of await calls in async callbacks
- ❌ **Do not use other Supabase functions in the callback function**

**If you absolutely must use async operations**, the official workaround:
```javascript
supabase.auth.onAuthStateChange((event, session) => {
  setTimeout(async () => {
    // await on other Supabase function here
    // this runs right after the callback has finished
  }, 0)
})
```

The `setTimeout(..., 0)` pattern defers async work to the next event loop tick, breaking the synchronous execution requirement and preventing deadlock. However, the better solution is to move supplementary data fetching entirely outside the callback.

## getUser() vs getSession(): definitive guidance

This is a **critical security distinction** that directly impacts your architecture:

### Server-side (middleware, Server Components, Route Handlers)

**ALWAYS use getUser(), NEVER getSession():**
- `getUser()` sends a request to Supabase Auth server **every time** to validate the JWT
- `getSession()` only reads from storage (cookies/localStorage) without server validation
- **Security risk:** Cookies can be spoofed—`getSession()` on the server trusts potentially tampered data

**Official Supabase warning:** "If that storage is based on request cookies, the values in it may not be authentic and therefore it's strongly advised against using this method [getSession] in Server Components."

**Correct server-side pattern:**
```typescript
// app/private/page.tsx (Server Component)
const supabase = await createClient()
const { data, error } = await supabase.auth.getUser() // Validates with auth server

if (error || !data?.user) {
  redirect('/login')
}
```

### Client-side (Client Components)

**Either method is acceptable, but with trade-offs:**
- `getSession()` is **faster** (reads from localStorage) and acceptable for UI display
- `getUser()` is **more secure** (revalidates with server) but slower
- For UI purposes only (showing user email, conditional rendering), `getSession()` is fine
- For critical authorization checks, prefer `getUser()`

**Important distinction:** Client-side code is inherently untrusted anyway, so reading from localStorage isn't a security risk on the client—the server still enforces actual authorization. Use `getSession()` for performance when you just need to display user info, but **always enforce security server-side with getUser()**.

## Proper auth context architecture for your use case

Given your invite-only system with admin role checks, here's the recommended non-blocking architecture:

### Pattern 1: Separate auth state from profile data

**Core principle:** Never block the auth provider waiting for supplementary data like roles, profiles, or permissions. Auth state should initialize immediately with session data, then fetch additional information independently.

**Root layout (Server Component):**
```typescript
// app/layout.tsx
import { createClient } from '@/utils/supabase/server'

export default async function RootLayout({ children }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  return (
    <html lang="en">
      <body>
        <AuthProvider initialUser={user}>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
```

**Auth provider (Client Component) - Fast path only:**
```typescript
// components/AuthProvider.tsx
"use client"

import { createContext, useState, useEffect, useContext } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'

type AuthContextType = {
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children, initialUser }) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  
  useEffect(() => {
    // Initialize with server-provided data
    setUser(initialUser)
    setIsLoading(false)
    
    // Listen for auth changes - NO ASYNC OPERATIONS HERE
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Only state updates, never await anything
        setUser(session?.user || null)
      }
    )
    
    return () => subscription.unsubscribe()
  }, [initialUser])
  
  return (
    <AuthContext.Provider value={{ user, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
```

**Separate profile/role provider (non-blocking):**
```typescript
// components/ProfileProvider.tsx
"use client"

import { createContext, useState, useEffect, useContext } from 'react'
import { useAuth } from './AuthProvider'
import { createClient } from '@/utils/supabase/client'

type UserProfile = {
  id: string
  role: string
  is_admin: boolean
}

const ProfileContext = createContext<{
  profile: UserProfile | null
  profileLoading: boolean
}>({
  profile: null,
  profileLoading: false,
})

export const useProfile = () => useContext(ProfileContext)

export function ProfileProvider({ children }) {
  const { user } = useAuth() // Fast auth context
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(false)
  const supabase = createClient()
  
  // Separate useEffect - does NOT block auth provider
  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }
    
    setProfileLoading(true)
    
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, role, is_admin')
          .eq('id', user.id)
          .single()
        
        if (!error && data) {
          setProfile(data)
        }
      } catch (err) {
        console.error('Profile fetch failed:', err)
        // Don't throw - let app continue without profile
      } finally {
        setProfileLoading(false)
      }
    }
    
    fetchProfile()
  }, [user?.id]) // Only re-run when user ID changes
  
  return (
    <ProfileContext.Provider value={{ profile, profileLoading }}>
      {children}
    </ProfileContext.Provider>
  )
}
```

**Usage in components:**
```typescript
function AdminPanel() {
  const { user } = useAuth() // Available immediately
  const { profile, profileLoading } = useProfile() // Loads independently
  
  // Show auth state immediately
  if (!user) return <Navigate to="/login" />
  
  // Show loading state while profile loads
  if (profileLoading) return <Skeleton />
  
  // Show admin content or access denied
  if (!profile?.is_admin) return <AccessDenied />
  
  return <AdminDashboard />
}
```

**Why this works:**
- Auth provider initializes immediately with server data (fast path)
- `onAuthStateChange` callback contains only synchronous state updates
- Admin role fetch happens in separate useEffect (slow path, non-blocking)
- Failed admin checks don't crash the auth provider
- UI can show auth state before roles load

### Pattern 2: Using React Query for advanced scenarios

For more complex auth scenarios with multiple dependent queries, React Query provides better patterns:

```typescript
// hooks/useUser.ts
import { useQuery } from '@tanstack/react-query'

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase.auth.getUser()
      if (error) throw error
      return data.user
    },
    staleTime: Infinity, // Auth rarely changes
    retry: 3,
  })
}

// hooks/useUserProfile.ts
export function useUserProfile() {
  const { data: user } = useUser()
  
  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (error) throw error
      return data
    },
    enabled: !!user?.id, // Only run when user exists (dependent query)
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    retry: 1, // Don't retry profile checks aggressively
    useErrorBoundary: false, // Don't throw errors
  })
}

// Usage
function Component() {
  const { data: user, isLoading: userLoading } = useUser()
  const { data: profile, isLoading: profileLoading } = useUserProfile()
  
  // User loads first, profile loads when user is ready
  // Neither blocks the other
}
```

**React Query benefits:**
- Built-in dependent queries with `enabled` option
- Automatic retries with exponential backoff
- Cache management prevents unnecessary refetches
- Separates loading states for auth vs profile
- No callback deadlocks—everything uses standard async/await patterns

## Admin role check implementation patterns

For your specific invite-only auth with admin role checks, here are three secure approaches:

### Approach 1: Server-side middleware protection (recommended for security)

**Best for:** Protecting entire route segments, ensuring unauthorized users can't even load pages

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(...)
  
  // Refresh and validate session
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Check admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Check role from app_metadata (secure, set by backend)
    const userRole = user.app_metadata?.role
    
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
  }
  
  return supabaseResponse
}
```

**Security note:** Use `app_metadata` (set server-side only via Supabase Auth Admin API) not `user_metadata` (user-editable) for role storage.

### Approach 2: Database query with Row Level Security

**Best for:** Fine-grained permissions with complex rules

```sql
-- Create role table
CREATE TABLE user_roles (
  user_id uuid REFERENCES auth.users PRIMARY KEY,
  role text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own role
CREATE POLICY "Users can view own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admin grant (via backend only)
INSERT INTO user_roles (user_id, role) VALUES ('user-uuid', 'admin');
```

**Client-side check (non-blocking):**
```typescript
function useIsAdmin() {
  const { user } = useAuth()
  
  return useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single()
      
      return data?.role === 'admin'
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  })
}
```

### Approach 3: Custom JWT claims (most performant)

**Best for:** Avoiding additional database queries, embedding role in JWT

```sql
-- Create Postgres function for custom claims
CREATE OR REPLACE FUNCTION custom_access_token_hook(event jsonb)
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  claims jsonb;
  user_role text;
BEGIN
  -- Fetch role from profiles table
  SELECT role INTO user_role
  FROM user_roles
  WHERE user_id = (event->>'user_id')::uuid;

  -- Add role to JWT claims
  claims := event->'claims';
  claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
  
  RETURN jsonb_set(event, '{claims}', claims);
END;
$$;
```

**Client-side (decode JWT, no additional query):**
```typescript
import { jwtDecode } from 'jwt-decode'

function useUserRole() {
  const { user } = useAuth()
  const [role, setRole] = useState<string | null>(null)
  
  useEffect(() => {
    if (!user) {
      setRole(null)
      return
    }
    
    // Get session to access JWT
    const getRole = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.access_token) {
        const decoded = jwtDecode(session.access_token)
        setRole(decoded.user_role || null)
      }
    }
    
    getRole()
  }, [user?.id])
  
  return role
}
```

**Performance advantage:** No database query needed—role is embedded in JWT and validated on every request. Refresh tokens include updated roles automatically.

## Timeout handling for production resilience

Even with proper patterns, implement defensive timeout handling to prevent edge cases from hanging your app:

### Promise.race pattern for critical auth calls

```typescript
async function getUserWithTimeout(timeoutMs = 5000) {
  const supabase = createClient()
  
  const getUserPromise = supabase.auth.getUser()
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
  )
  
  try {
    const result = await Promise.race([getUserPromise, timeoutPromise])
    return result
  } catch (error) {
    console.error('Auth timeout:', error)
    
    // Fallback: clear potentially stale session
    await supabase.auth.signOut()
    
    // Redirect to login
    window.location.href = '/login'
    
    return null
  }
}
```

### AbortController for cancellable requests

```typescript
async function fetchWithTimeout(fetcher, timeoutMs = 10000) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  
  try {
    const result = await fetcher(controller.signal)
    clearTimeout(timeoutId)
    return result
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timed out')
    }
    throw error
  }
}

// Usage with profile fetch
const profile = await fetchWithTimeout(async (signal) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .abortSignal(signal)
    .single()
  
  if (error) throw error
  return data
}, 10000)
```

**Recommended timeouts:**
- Auth operations: 5 seconds (critical path)
- Profile/role fetches: 10 seconds (supplementary data)
- Less critical data: 30 seconds

## Error boundaries for graceful degradation

Wrap auth-dependent features in error boundaries to prevent auth failures from crashing the entire app:

```typescript
// components/AuthErrorBoundary.tsx
class AuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Auth error caught:', error, errorInfo)
    
    // Log to monitoring service
    // reportErrorToService(error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h2>Authentication Error</h2>
          <p>We're having trouble verifying your session.</p>
          <button onClick={() => window.location.href = '/login'}>
            Return to Login
          </button>
        </div>
      )
    }
    
    return this.props.children
  }
}

// Usage
<AuthErrorBoundary>
  <AuthProvider>
    <App />
  </AuthProvider>
</AuthErrorBoundary>
```

## Migration path from your current implementation

Based on your setup (auth provider wraps app, admin checks block initialization), here's the step-by-step migration:

**Step 1: Remove async operations from auth callback**

Find where you're doing this (likely in AuthProvider):
```typescript
// ❌ CURRENT (causes deadlock)
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session) {
    const { data } = await supabase.from('profiles').select('is_admin')
    setIsAdmin(data?.is_admin)
  }
})
```

Replace with:
```typescript
// ✅ FIXED (no async in callback)
supabase.auth.onAuthStateChange((event, session) => {
  setUser(session?.user || null)
  // No await, no async operations
})
```

**Step 2: Move admin check to separate useEffect**

```typescript
// In AuthProvider or separate ProfileProvider
useEffect(() => {
  if (!user) {
    setIsAdmin(false)
    return
  }
  
  const fetchAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()
      
      if (!error && data) {
        setIsAdmin(data.is_admin)
      }
    } catch (err) {
      console.error('Failed to fetch admin status:', err)
      // Fail gracefully - assume not admin
      setIsAdmin(false)
    }
  }
  
  fetchAdminStatus()
}, [user?.id])
```

**Step 3: Update component usage**

```typescript
function AdminDashboard() {
  const { user } = useAuth() // Available immediately
  const { isAdmin, isLoading } = useAdminStatus() // Separate hook
  
  if (!user) return <Navigate to="/login" />
  if (isLoading) return <LoadingSkeleton />
  if (!isAdmin) return <AccessDenied />
  
  return <AdminContent />
}
```

**Step 4: Add timeout protection (optional but recommended)**

Wrap critical auth calls with Promise.race as shown above.

**Step 5: Test thoroughly**

- Hard refresh (Cmd+R) should no longer hang
- Network throttling shouldn't cause indefinite loading
- Failed admin checks shouldn't prevent login
- Token expiry/refresh should work smoothly

## Deprecated patterns to avoid

Official Supabase documentation lists several patterns that are **no longer recommended**:

**Never use (deprecated):**
- `createClientComponentClient` from `@supabase/auth-helpers-nextjs`
- `createServerComponentClient` from `@supabase/auth-helpers-nextjs`
- `createMiddlewareClient` from `@supabase/auth-helpers-nextjs`

**The entire @supabase/auth-helpers-nextjs package is deprecated.** Use `@supabase/ssr` instead.

**Never use in server code:**
```typescript
// ❌ Security vulnerability
const { data: { session } } = await supabase.auth.getSession()

// ✅ Correct - validates with server
const { data: { user } } = await supabase.auth.getUser()
```

## Final architecture recommendations

For your Next.js 14 App Router application with invite-only auth and admin role checks:

**1. Middleware:** Use `getUser()` to refresh tokens and protect routes at the edge

**2. Root Layout (Server Component):** Fetch initial user state server-side, pass to client provider

**3. Auth Provider (Client Component):** 
   - Initialize with server data
   - Use `onAuthStateChange` with **only synchronous operations**
   - Provide basic auth state (user, loading)
   
**4. Profile/Role Provider (Client Component, optional separate provider):**
   - Fetch admin status in separate useEffect
   - Dependent on user from auth provider
   - Non-blocking—failures don't crash auth
   
**5. Components:** 
   - Progressive rendering (auth → profile → admin)
   - Separate loading states for each layer
   - Error boundaries for graceful degradation

**6. Security:**
   - Server-side route protection via middleware
   - Store roles in `app_metadata` or dedicated tables with RLS
   - Never trust client-side role checks for actual authorization
   - Client-side checks are for UX only (showing/hiding UI)

This architecture ensures fast initial auth, non-blocking supplementary data fetching, no promise deadlocks, and graceful error handling—solving your hanging promises issue while following official best practices.