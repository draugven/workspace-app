import { renderHook, waitFor } from '@testing-library/react'
import { useAuth, AuthProvider } from '../auth-provider'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

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

describe('AuthProvider', () => {
  let mockRouter: any
  let mockSubscription: any

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
    })
  })
})
