/**
 * Tests for non-blocking auth pattern in AuthProvider
 *
 * Critical requirement: Admin status checks must NOT block auth initialization
 * Reference: .SUPABASE-AUTH-REFACTOR-PLAN.md Phase 4.2
 */

import { renderHook, waitFor } from '@testing-library/react'
import { useAuth, AuthProvider } from '../auth-provider'
import { isUserAdmin } from '@/lib/auth-utils'
import * as supabaseModule from '@/lib/supabase'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}))

// Mock auth utils
jest.mock('@/lib/auth-utils')

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))

describe('AuthProvider - Non-Blocking Pattern', () => {
  const mockUser = {
    id: 'test-user-id',
    email: 'test@example.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  }

  let mockOnAuthStateChange: jest.Mock
  let mockSubscribe: { unsubscribe: jest.Mock }

  beforeEach(() => {
    jest.clearAllMocks()

    mockSubscribe = { unsubscribe: jest.fn() }
    mockOnAuthStateChange = jest.fn().mockReturnValue({
      data: { subscription: mockSubscribe },
    })

    ;(supabaseModule.supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: mockUser } },
      error: null,
    })

    ;(supabaseModule.supabase.auth.onAuthStateChange as jest.Mock) = mockOnAuthStateChange
  })

  it('completes auth initialization before admin check finishes', async () => {
    // Mock slow admin check (simulates database query delay)
    let resolveAdminCheck: (value: boolean) => void
    const slowAdminCheckPromise = new Promise<boolean>((resolve) => {
      resolveAdminCheck = resolve
    })
    ;(isUserAdmin as jest.Mock).mockReturnValue(slowAdminCheckPromise)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    // Initial state: loading
    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()

    // Auth should complete FIRST (loading: false, user set)
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.user).toBeTruthy()
    }, { timeout: 3000 })

    // Admin check is still loading (non-blocking!)
    expect(result.current.adminLoading).toBe(true)
    expect(result.current.isAdmin).toBe(false)

    // Now resolve admin check
    resolveAdminCheck!(true)

    // Admin check completes separately
    await waitFor(() => {
      expect(result.current.adminLoading).toBe(false)
      expect(result.current.isAdmin).toBe(true)
    })
  })

  it('does not block auth initialization if admin check hangs indefinitely', async () => {
    // Mock hanging admin check (never resolves) - simulates Supabase bug
    const hangingPromise = new Promise<boolean>(() => {
      // Never resolves
    })
    ;(isUserAdmin as jest.Mock).mockReturnValue(hangingPromise)

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    // Auth should complete despite hanging admin query
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.user).toBeTruthy()
    }, { timeout: 3000 })

    // Admin check still loading (but doesn't block auth!)
    expect(result.current.adminLoading).toBe(true)
    expect(result.current.isAdmin).toBe(false)

    // User can use the app even though admin status unknown
    expect(result.current.user?.email).toBe('test@example.com')
  })

  it('handles admin check errors gracefully without breaking auth', async () => {
    // Mock failing admin check
    ;(isUserAdmin as jest.Mock).mockRejectedValue(new Error('Database connection failed'))

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    // Auth should complete successfully
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
      expect(result.current.user).toBeTruthy()
    })

    // Admin check fails gracefully (defaults to false)
    await waitFor(() => {
      expect(result.current.adminLoading).toBe(false)
      expect(result.current.isAdmin).toBe(false)
    })

    // Error logged but didn't crash
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      '[AuthProvider] Failed to fetch admin status:',
      expect.any(Error)
    )

    consoleErrorSpy.mockRestore()
  })

  it('logs USER_UPDATED event (admin re-check happens via useEffect)', async () => {
    ;(isUserAdmin as jest.Mock).mockResolvedValue(false)

    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    // Wait for initial load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    // Trigger USER_UPDATED event
    const authStateChangeCallback = mockOnAuthStateChange.mock.calls[0][0]
    authStateChangeCallback('USER_UPDATED', { user: mockUser })

    // Verify USER_UPDATED was logged
    await waitFor(() => {
      expect(consoleLogSpy).toHaveBeenCalledWith(
        '[AuthProvider] User updated, will refresh admin status'
      )
    })

    consoleLogSpy.mockRestore()
  })
})
