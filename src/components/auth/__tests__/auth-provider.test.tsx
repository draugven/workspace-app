import { renderHook, waitFor, act } from '@testing-library/react'
import { useAuth, AuthProvider } from '../auth-provider'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { isUserAdmin } from '@/lib/auth-utils'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock auth-utils
jest.mock('@/lib/auth-utils', () => ({
  isUserAdmin: jest.fn(),
}))

describe('AuthProvider', () => {
  let mockRouter: any
  let mockSubscription: any

  // Helper to spy on URLSearchParams
  const mockURLSearchParams = (paramMap: Record<string, string>) => {
    const mockGet = jest.fn((key: string) => paramMap[key] || null)
    global.URLSearchParams = jest.fn().mockImplementation(() => ({
      get: mockGet,
    })) as any
    return mockGet
  }

  beforeEach(() => {
    jest.clearAllMocks()

    mockRouter = {
      push: jest.fn(),
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    mockSubscription = {
      unsubscribe: jest.fn(),
    }

    // Default mock for onAuthStateChange
    ;(supabase.auth.onAuthStateChange as jest.Mock).mockReturnValue({
      data: { subscription: mockSubscription },
    })

    // Default mock for isUserAdmin (returns false)
    ;(isUserAdmin as jest.Mock).mockResolvedValue(false)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Initial Session Loading', () => {
    it('loads user session successfully', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Initially loading
      expect(result.current.loading).toBe(true)
      expect(result.current.user).toBeNull()

      // Wait for session to load
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toEqual(mockUser)
    })

    it('handles null session gracefully', async () => {
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBeNull()
    })

    it('handles getSession error gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockError = new Error('Session fetch failed')

      ;(supabase.auth.getSession as jest.Mock).mockRejectedValue(mockError)

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.user).toBeNull()
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to get session:', mockError)

      consoleErrorSpy.mockRestore()
    })

    it('sets loading to false even when getSession fails', async () => {
      jest.spyOn(console, 'error').mockImplementation()
      ;(supabase.auth.getSession as jest.Mock).mockRejectedValue(new Error('Network error'))

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.loading).toBe(true)

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      }, { timeout: 2000 })

      expect(result.current.user).toBeNull()
    })
  })

  describe('Auth State Changes', () => {
    it('updates user on SIGNED_IN event', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      })

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Trigger SIGNED_IN event
      authCallback('SIGNED_IN', { user: mockUser })

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser)
      })

      expect(mockRouter.push).toHaveBeenCalledWith('/')
    })

    it('clears user and redirects on SIGNED_OUT event', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
      })

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.user).toEqual(mockUser)
      })

      // Trigger SIGNED_OUT event
      authCallback('SIGNED_OUT', null)

      await waitFor(() => {
        expect(result.current.user).toBeNull()
      })

      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })

    it('unsubscribes from auth changes on unmount', async () => {
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { unmount } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(supabase.auth.onAuthStateChange).toHaveBeenCalled()
      })

      unmount()

      expect(mockSubscription.unsubscribe).toHaveBeenCalled()
    })
  })

  describe('useAuth hook', () => {
    it('returns undefined when used outside AuthProvider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => <>{children}</>
      const { result } = renderHook(() => useAuth(), { wrapper })

      // useAuth will return the default context when outside provider
      expect(result.current).toBeDefined()
      expect(result.current.loading).toBe(true) // Default loading state
      expect(result.current.user).toBeNull() // Default user state
    })

    it('returns auth context when used inside AuthProvider', async () => {
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current).toHaveProperty('user')
      expect(result.current).toHaveProperty('loading')
      expect(result.current).toHaveProperty('isAdmin')
    })
  })

  describe('Admin Status Management', () => {
    it('sets isAdmin to true when user is admin on initial load', async () => {
      const mockUser = { id: 'admin-123', email: 'admin@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
      })
      ;(isUserAdmin as jest.Mock).mockResolvedValue(true)

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isAdmin).toBe(true)
      expect(isUserAdmin).toHaveBeenCalledWith('admin-123')
    })

    it('sets isAdmin to false when user is not admin on initial load', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
      })
      ;(isUserAdmin as jest.Mock).mockResolvedValue(false)

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isAdmin).toBe(false)
      expect(isUserAdmin).toHaveBeenCalledWith('user-123')
    })

    it('handles isUserAdmin error gracefully on initial load', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockUser = { id: 'user-123', email: 'user@example.com' }
      const mockError = new Error('Admin check failed')

      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
      })
      ;(isUserAdmin as jest.Mock).mockRejectedValue(mockError)

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isAdmin).toBe(false)
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to check admin status:', mockError)

      consoleErrorSpy.mockRestore()
    })

    it('updates isAdmin to true on SIGNED_IN event for admin user', async () => {
      const mockUser = { id: 'admin-123', email: 'admin@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      })

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isAdmin).toBe(false)

      // Mock admin status for sign in
      ;(isUserAdmin as jest.Mock).mockResolvedValue(true)

      // Trigger SIGNED_IN event
      await act(async () => {
        authCallback('SIGNED_IN', { user: mockUser })
        await waitFor(() => {
          expect(isUserAdmin).toHaveBeenCalledWith('admin-123')
        })
      })

      await waitFor(() => {
        expect(result.current.isAdmin).toBe(true)
      })
    })

    it('updates isAdmin to false on SIGNED_IN event for non-admin user', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      })

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Mock non-admin status for sign in
      ;(isUserAdmin as jest.Mock).mockResolvedValue(false)

      // Trigger SIGNED_IN event
      await act(async () => {
        authCallback('SIGNED_IN', { user: mockUser })
        await waitFor(() => {
          expect(isUserAdmin).toHaveBeenCalledWith('user-123')
        })
      })

      await waitFor(() => {
        expect(result.current.isAdmin).toBe(false)
      })
    })

    it('resets isAdmin to false on SIGNED_OUT event', async () => {
      const mockUser = { id: 'admin-123', email: 'admin@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
      })
      ;(isUserAdmin as jest.Mock).mockResolvedValue(true)

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isAdmin).toBe(true)
      })

      // Trigger SIGNED_OUT event
      await act(async () => {
        authCallback('SIGNED_OUT', null)
      })

      await waitFor(() => {
        expect(result.current.isAdmin).toBe(false)
      })

      expect(mockRouter.push).toHaveBeenCalledWith('/login')
    })
  })

  describe('Redirect URL Handling', () => {
    it('redirects to root when no redirect query param on SIGNED_IN', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      })

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        authCallback('SIGNED_IN', { user: mockUser })
        await waitFor(() => {
          expect(isUserAdmin).toHaveBeenCalled()
        })
      })

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/')
      })
    })

    it('redirects to saved URL from query param on SIGNED_IN', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      })

      // Mock URLSearchParams to return redirect param
      mockURLSearchParams({ redirect: '/tasks' })

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        authCallback('SIGNED_IN', { user: mockUser })
        await waitFor(() => {
          expect(isUserAdmin).toHaveBeenCalled()
        })
      })

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/tasks')
      })
    })

    it('redirects to complex URL from query param on SIGNED_IN', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
      })

      // Mock URLSearchParams to return complex redirect param
      mockURLSearchParams({ redirect: '/admin/invitations' })

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        authCallback('SIGNED_IN', { user: mockUser })
        await waitFor(() => {
          expect(isUserAdmin).toHaveBeenCalled()
        })
      })

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/admin/invitations')
      })
    })
  })

  describe('USER_UPDATED Event', () => {
    it('should re-check admin status when USER_UPDATED event fires', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
      })
      ;(isUserAdmin as jest.Mock).mockResolvedValue(false)

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Clear previous calls
      ;(isUserAdmin as jest.Mock).mockClear()

      // Trigger USER_UPDATED event
      await act(async () => {
        authCallback('USER_UPDATED', { user: mockUser })
      })

      // Verify admin status was re-checked
      await waitFor(() => {
        expect(isUserAdmin).toHaveBeenCalledWith('user-123')
      })
    })

    it('should update isAdmin to true when user gains admin role via USER_UPDATED', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
      })
      ;(isUserAdmin as jest.Mock).mockResolvedValue(false)

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isAdmin).toBe(false)
      })

      // Mock admin status change
      ;(isUserAdmin as jest.Mock).mockResolvedValue(true)

      // Trigger USER_UPDATED event
      await act(async () => {
        authCallback('USER_UPDATED', { user: mockUser })
      })

      // Verify admin status was updated
      await waitFor(() => {
        expect(result.current.isAdmin).toBe(true)
      })
    })

    it('should update isAdmin to false when user loses admin role via USER_UPDATED', async () => {
      const mockUser = { id: 'admin-123', email: 'admin@example.com' }
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
      })
      ;(isUserAdmin as jest.Mock).mockResolvedValue(true)

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.isAdmin).toBe(true)
      })

      // Mock admin status change (admin role removed)
      ;(isUserAdmin as jest.Mock).mockResolvedValue(false)

      // Trigger USER_UPDATED event
      await act(async () => {
        authCallback('USER_UPDATED', { user: mockUser })
      })

      // Verify admin status was updated
      await waitFor(() => {
        expect(result.current.isAdmin).toBe(false)
      })
    })

    it('should set adminLoading=true during USER_UPDATED admin check', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' }

      // Initial load with immediate resolution
      ;(isUserAdmin as jest.Mock).mockResolvedValue(false)
      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
      })

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Wait for initial load to complete
      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.adminLoading).toBe(false)
      })

      // Create a delayed promise for the USER_UPDATED check
      let resolveAdminCheck: (value: boolean) => void
      const adminCheckPromise = new Promise<boolean>((resolve) => {
        resolveAdminCheck = resolve
      })
      ;(isUserAdmin as jest.Mock).mockReturnValue(adminCheckPromise)

      // Trigger USER_UPDATED event
      act(() => {
        authCallback('USER_UPDATED', { user: mockUser })
      })

      // Verify adminLoading is true during check
      await waitFor(() => {
        expect(result.current.adminLoading).toBe(true)
      })

      // Resolve the admin check
      await act(async () => {
        resolveAdminCheck!(false)
      })

      // Verify adminLoading is false after check
      await waitFor(() => {
        expect(result.current.adminLoading).toBe(false)
      })
    })

    it('should handle errors during USER_UPDATED admin check (defaults to false)', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockUser = { id: 'user-123', email: 'user@example.com' }
      const mockError = new Error('Admin check failed on update')

      ;(supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
      })
      ;(isUserAdmin as jest.Mock).mockResolvedValue(false)

      let authCallback: any
      ;(supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
        authCallback = callback
        return { data: { subscription: mockSubscription } }
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )

      const { result } = renderHook(() => useAuth(), { wrapper })

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Mock admin check to fail
      ;(isUserAdmin as jest.Mock).mockRejectedValue(mockError)

      // Trigger USER_UPDATED event
      await act(async () => {
        authCallback('USER_UPDATED', { user: mockUser })
      })

      // Verify error was logged and admin status defaults to false
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Failed to check admin status on user update:',
          mockError
        )
      })
      expect(result.current.isAdmin).toBe(false)
      expect(result.current.adminLoading).toBe(false)

      consoleErrorSpy.mockRestore()
    })
  })
})
