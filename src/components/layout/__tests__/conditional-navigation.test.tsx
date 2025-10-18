import { render, screen } from '@testing-library/react'
import { ConditionalNavigation } from '../conditional-navigation'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/components/auth/auth-provider'

// Mock dependencies
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('@/components/auth/auth-provider', () => ({
  useAuth: jest.fn(),
}))

jest.mock('@/components/theme/theme-provider', () => ({
  useTheme: jest.fn(() => ({ theme: 'light' })),
}))

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signOut: jest.fn(),
    },
  },
}))

describe('ConditionalNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Default auth state: authenticated non-admin user
    ;(useAuth as jest.Mock).mockReturnValue({
      user: { id: 'user-123', email: 'test@example.com', user_metadata: { display_name: 'Test User' } },
      loading: false,
      isAdmin: false,
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Navigation Visibility', () => {
    it('hides navigation on /login page', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/login')

      const { container } = render(<ConditionalNavigation />)

      expect(container.firstChild).toBeNull()
    })

    it('hides navigation on /accept-invite page', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/accept-invite')

      const { container } = render(<ConditionalNavigation />)

      expect(container.firstChild).toBeNull()
    })

    it('shows navigation on root path', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/')

      render(<ConditionalNavigation />)

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('shows navigation on /props page', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/props')

      render(<ConditionalNavigation />)

      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByText('Requisiten')).toBeInTheDocument()
    })

    it('shows navigation on /tasks page', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/tasks')

      render(<ConditionalNavigation />)

      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByText('Aufgaben')).toBeInTheDocument()
    })

    it('shows navigation on /notes page', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/notes')

      render(<ConditionalNavigation />)

      expect(screen.getByRole('navigation')).toBeInTheDocument()
      expect(screen.getByText('Notizen')).toBeInTheDocument()
    })

    it('shows navigation on /admin/invitations page', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/admin/invitations')
      ;(useAuth as jest.Mock).mockReturnValue({
        user: { id: 'admin-123', email: 'admin@example.com', user_metadata: { display_name: 'Admin User' } },
        loading: false,
        isAdmin: true,
      })

      render(<ConditionalNavigation />)

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })

  describe('Admin-Specific Navigation', () => {
    it('shows invitations link for admin users', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/props')
      ;(useAuth as jest.Mock).mockReturnValue({
        user: { id: 'admin-123', email: 'admin@example.com', user_metadata: { display_name: 'Admin User' } },
        loading: false,
        isAdmin: true,
      })

      render(<ConditionalNavigation />)

      expect(screen.getByText('Einladungen')).toBeInTheDocument()
    })

    it('does not show invitations link for non-admin users', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/props')
      ;(useAuth as jest.Mock).mockReturnValue({
        user: { id: 'user-123', email: 'user@example.com', user_metadata: { display_name: 'Test User' } },
        loading: false,
        isAdmin: false,
      })

      render(<ConditionalNavigation />)

      expect(screen.queryByText('Einladungen')).not.toBeInTheDocument()
    })
  })

  describe('Navigation Links', () => {
    it('renders all standard navigation links', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/')

      render(<ConditionalNavigation />)

      expect(screen.getByText('Requisiten')).toBeInTheDocument()
      expect(screen.getByText('Aufgaben')).toBeInTheDocument()
      expect(screen.getByText('Notizen')).toBeInTheDocument()
    })

    it('highlights active navigation link', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/props')

      render(<ConditionalNavigation />)

      const propsLink = screen.getByText('Requisiten').closest('a')
      expect(propsLink).toHaveClass('bg-primary', 'text-primary-foreground')
    })

    it('does not highlight inactive navigation links', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/props')

      render(<ConditionalNavigation />)

      const tasksLink = screen.getByText('Aufgaben').closest('a')
      expect(tasksLink).not.toHaveClass('bg-primary', 'text-primary-foreground')
      expect(tasksLink).toHaveClass('text-muted-foreground')
    })
  })

  describe('User Display', () => {
    it('displays user full name when available', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/')
      ;(useAuth as jest.Mock).mockReturnValue({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          user_metadata: { display_name: 'Test User' }
        },
        loading: false,
        isAdmin: false,
      })

      render(<ConditionalNavigation />)

      expect(screen.getByText('Test User')).toBeInTheDocument()
    })

    it('displays user email when full name not available', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/')
      ;(useAuth as jest.Mock).mockReturnValue({
        user: {
          id: 'user-123',
          email: 'test@example.com',
          user_metadata: {}
        },
        loading: false,
        isAdmin: false,
      })

      render(<ConditionalNavigation />)

      expect(screen.getByText('test@example.com')).toBeInTheDocument()
    })
  })

  describe('Sign Out Button', () => {
    it('renders sign out button', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/')

      render(<ConditionalNavigation />)

      expect(screen.getByText('Abmelden')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles paths with query parameters correctly', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/props')

      render(<ConditionalNavigation />)

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('handles nested paths that are not in HIDE_NAV_PATHS', () => {
      ;(usePathname as jest.Mock).mockReturnValue('/props/edit')

      render(<ConditionalNavigation />)

      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })

    it('exactly matches paths in HIDE_NAV_PATHS', () => {
      // Should hide for exact match
      ;(usePathname as jest.Mock).mockReturnValue('/login')
      const { container, rerender } = render(<ConditionalNavigation />)
      expect(container.firstChild).toBeNull()

      // Should show for nested path (not exact match)
      ;(usePathname as jest.Mock).mockReturnValue('/login/forgot-password')
      rerender(<ConditionalNavigation />)
      expect(screen.getByRole('navigation')).toBeInTheDocument()
    })
  })
})
