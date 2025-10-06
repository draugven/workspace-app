import { isUserAdmin } from '@/lib/auth-utils'
import { createMockNextRequest } from '@/test-utils/api-route-helpers'

// Set up env vars before importing
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-service-role-key'

// Create stable mock functions that won't be replaced - define globally
let mockGetUser: jest.Mock
let mockFrom: jest.Mock

// Mock dependencies BEFORE importing the route - use factory function
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      get getUser() {
        if (!mockGetUser) mockGetUser = jest.fn()
        return mockGetUser
      },
    },
    get from() {
      if (!mockFrom) mockFrom = jest.fn()
      return mockFrom
    },
  })),
}))
jest.mock('@/lib/auth-utils')

// Initialize mock functions
mockGetUser = jest.fn()
mockFrom = jest.fn()

// NOW import the route after mocks are set up
import { POST } from '../route'

describe('POST /api/admin/invitations/create', () => {
  let mockRequest: any
  const originalEnv = process.env

  beforeEach(() => {
    // Clear mock calls but keep the functions
    mockGetUser.mockClear()
    mockFrom.mockClear()

    // Reset environment variables
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    }

    // Reset mock implementations for from() chainable methods
    mockFrom.mockReturnValue({
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  describe('Authentication and Authorization', () => {
    it('returns 401 when Authorization header is missing', async () => {
      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/create', {
        method: 'POST',
        body: { email: 'test@example.com' },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Nicht authentifiziert')
      expect(mockGetUser).not.toHaveBeenCalled()
      expect(isUserAdmin).not.toHaveBeenCalled()
    })

    it('returns 401 when user is not authenticated', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: null,
      })

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/create', {
        method: 'POST',
        body: { email: 'test@example.com' },
        headers: { Authorization: 'Bearer invalid-token' },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Nicht authentifiziert')
      expect(mockGetUser).toHaveBeenCalledWith('invalid-token')
      expect(isUserAdmin).not.toHaveBeenCalled()
    })

    it('returns 401 when auth error occurs', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Auth failed'),
      })

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/create', {
        method: 'POST',
        body: { email: 'test@example.com' },
        headers: { Authorization: 'Bearer expired-token' },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Nicht authentifiziert')
      expect(mockGetUser).toHaveBeenCalledWith('expired-token')
    })

    it('returns 403 when user is not an admin', async () => {
      const mockUser = { id: 'user-123', email: 'user@example.com' }
      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      ;(isUserAdmin as jest.Mock).mockResolvedValue(false)

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/create', {
        method: 'POST',
        body: { email: 'test@example.com' },
        headers: { Authorization: 'Bearer valid-token' },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Keine Berechtigung')
      expect(isUserAdmin).toHaveBeenCalledWith('user-123')
    })
  })

  describe('Email Validation', () => {
    beforeEach(() => {
      const mockUser = { id: 'admin-123', email: 'admin@example.com' }
      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      ;(isUserAdmin as jest.Mock).mockResolvedValue(true)
    })

    it('returns 400 when email is missing', async () => {
      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/create', {
        method: 'POST',
        body: {},
        headers: { Authorization: 'Bearer admin-token' },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Ungültige E-Mail-Adresse')
    })

    it('returns 400 when email is invalid format', async () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example',
      ]

      for (const email of invalidEmails) {
        mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/create', {
          method: 'POST',
          body: { email },
          headers: { Authorization: 'Bearer admin-token' },
        })

        const response = await POST(mockRequest)
        const data = await response.json()

        expect(response.status).toBe(400)
        expect(data.error).toBe('Ungültige E-Mail-Adresse')
      }
    })
  })

  describe('Invitation Creation', () => {
    beforeEach(() => {
      const mockUser = { id: 'admin-123', email: 'admin@example.com' }
      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      ;(isUserAdmin as jest.Mock).mockResolvedValue(true)
    })

    it('creates invitation successfully', async () => {
      const mockInvitation = {
        id: 'inv-123',
        email: 'newuser@example.com',
        token: 'abc123',
        invited_by: 'admin-123',
        status: 'pending',
      }

      mockFrom.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockInvitation,
              error: null,
            }),
          }),
        }),
      })

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/create', {
        method: 'POST',
        body: { email: 'newuser@example.com' },
        headers: { Authorization: 'Bearer admin-token' },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.invitation).toEqual(mockInvitation)
      expect(mockFrom).toHaveBeenCalledWith('invitations')
    })

    it('returns 409 when email already has pending invitation', async () => {
      mockFrom.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: '23505', message: 'duplicate key value' },
            }),
          }),
        }),
      })

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/create', {
        method: 'POST',
        body: { email: 'existing@example.com' },
        headers: { Authorization: 'Bearer admin-token' },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Diese E-Mail wurde bereits eingeladen')
    })

    it('returns 500 when database operation fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      mockFrom.mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'UNKNOWN', message: 'Database error' },
            }),
          }),
        }),
      })

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/create', {
        method: 'POST',
        body: { email: 'test@example.com' },
        headers: { Authorization: 'Bearer admin-token' },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Fehler beim Erstellen der Einladung')
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error creating invitation:',
        expect.any(Object)
      )

      consoleErrorSpy.mockRestore()
    })

    it('includes invited_by field in insert', async () => {
      const insertMock = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'inv-123' },
            error: null,
          }),
        }),
      })

      mockFrom.mockReturnValue({
        insert: insertMock,
      })

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/create', {
        method: 'POST',
        body: { email: 'newuser@example.com' },
        headers: { Authorization: 'Bearer admin-token' },
      })

      await POST(mockRequest)

      expect(insertMock).toHaveBeenCalledWith({
        email: 'newuser@example.com',
        invited_by: 'admin-123',
      })
    })
  })

  describe('Error Handling', () => {
    it('handles unexpected errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const mockUser = { id: 'admin-123', email: 'admin@example.com' }
      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      ;(isUserAdmin as jest.Mock).mockResolvedValue(true)

      // Simulate error in database operation by throwing in the from() method
      mockFrom.mockImplementation(() => {
        throw new Error('Database connection failed')
      })

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/create', {
        method: 'POST',
        body: { email: 'test@example.com' },
        headers: { Authorization: 'Bearer admin-token' },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Fehler beim Erstellen der Einladung')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })
})
