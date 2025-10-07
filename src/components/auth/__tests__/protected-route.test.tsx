import { render, screen, waitFor } from '@testing-library/react'
import { ProtectedRoute } from '../protected-route'
import { useAuth } from '../auth-provider'
import { useRouter, usePathname } from 'next/navigation'

// Mock dependencies
jest.mock('../auth-provider', () => ({
  useAuth: jest.fn(),
}))

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}))

describe('ProtectedRoute', () => {
  let mockRouter: any

  beforeEach(() => {
    jest.clearAllMocks()

    mockRouter = {
      push: jest.fn(),
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)
    ;(usePathname as jest.Mock).mockReturnValue('/props')
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Loading State', () => {
    it('shows loading indicator when auth is loading', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: true,
        isAdmin: false,
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })
  })

  describe('Authenticated User', () => {
    it('renders children when user is authenticated', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: { id: 'user-123', email: 'test@example.com' },
        loading: false,
        isAdmin: false,
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Protected Content')).toBeInTheDocument()
      expect(mockRouter.push).not.toHaveBeenCalled()
    })
  })

  describe('Unauthenticated User', () => {
    it('redirects to login with current path when not authenticated', async () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        isAdmin: false,
      })
      ;(usePathname as jest.Mock).mockReturnValue('/props')

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login?redirect=%2Fprops')
      })

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('encodes complex paths correctly in redirect URL', async () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        isAdmin: false,
      })
      ;(usePathname as jest.Mock).mockReturnValue('/admin/invitations')

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login?redirect=%2Fadmin%2Finvitations')
      })
    })

    it('encodes paths with special characters correctly', async () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        isAdmin: false,
      })
      ;(usePathname as jest.Mock).mockReturnValue('/tasks?status=open')

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith(
          '/login?redirect=%2Ftasks%3Fstatus%3Dopen'
        )
      })
    })

    it('handles root path correctly', async () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        isAdmin: false,
      })
      ;(usePathname as jest.Mock).mockReturnValue('/')

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/login?redirect=%2F')
      })
    })
  })

  describe('Transition States', () => {
    it('does not render children during loading', () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: true,
        isAdmin: false,
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('does not render children when redirecting', async () => {
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: false,
        isAdmin: false,
      })

      render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalled()
      })
    })

    it('handles auth state changing from loading to authenticated', async () => {
      // Initially loading
      ;(useAuth as jest.Mock).mockReturnValue({
        user: null,
        loading: true,
        isAdmin: false,
      })

      const { rerender } = render(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      expect(screen.getByText('Loading...')).toBeInTheDocument()

      // Then authenticated
      ;(useAuth as jest.Mock).mockReturnValue({
        user: { id: 'user-123', email: 'test@example.com' },
        loading: false,
        isAdmin: false,
      })

      rerender(
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      )

      await waitFor(() => {
        expect(screen.getByText('Protected Content')).toBeInTheDocument()
      })

      expect(mockRouter.push).not.toHaveBeenCalled()
    })
  })
})
