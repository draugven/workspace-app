import { POST } from '../route'
import { createMockNextRequest } from '@/test-utils/api-route-helpers'
import { createClient } from '@supabase/supabase-js'

// Mock dependencies
jest.mock('@supabase/supabase-js')

describe('POST /api/invitations/accept', () => {
  let mockSupabase: any
  let mockRequest: any
  const originalEnv = process.env

  beforeEach(() => {
    jest.clearAllMocks()

    // Reset environment variables
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
    }

    // Setup chainable eq mocks
    const singleMock = jest.fn()
    const eq3Mock = { single: singleMock }
    const eq2Mock = { eq: jest.fn(() => eq3Mock) }
    const eq1Mock = { eq: jest.fn(() => eq2Mock) }
    const selectMock = { eq: jest.fn(() => eq1Mock) }

    mockSupabase = {
      auth: {
        admin: {
          createUser: jest.fn(),
        },
      },
      from: jest.fn(() => ({
        select: jest.fn(() => selectMock),
        insert: jest.fn(),
        update: jest.fn(() => ({
          eq: jest.fn(),
        })),
      })),
    }

    ;(createClient as jest.Mock).mockReturnValue(mockSupabase)
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  describe('Environment Configuration', () => {
    it('returns 500 when NEXT_PUBLIC_SUPABASE_URL is missing', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      delete process.env.NEXT_PUBLIC_SUPABASE_URL

      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'token123',
          email: 'test@example.com',
          password: 'password123',
        },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Server-Konfigurationsfehler')
      expect(consoleErrorSpy).toHaveBeenCalledWith('Missing required environment variables')

      consoleErrorSpy.mockRestore()
    })
  })

  describe('Request Validation', () => {
    it('returns 400 when token is missing', async () => {
      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User',
        },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Fehlende Pflichtfelder')
    })

    it('returns 400 when email is missing', async () => {
      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'token123',
          password: 'password123',
          displayName: 'Test User',
        },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Fehlende Pflichtfelder')
    })

    it('returns 400 when password is missing', async () => {
      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'token123',
          email: 'test@example.com',
          displayName: 'Test User',
        },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Fehlende Pflichtfelder')
    })

    it('returns 400 when displayName is missing', async () => {
      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'token123',
          email: 'test@example.com',
          password: 'password123',
        },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Name ist erforderlich')
    })

    it('returns 400 when displayName is empty string', async () => {
      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'token123',
          email: 'test@example.com',
          password: 'password123',
          displayName: '',
        },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Name ist erforderlich')
    })

    it('returns 400 when displayName is only whitespace', async () => {
      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'token123',
          email: 'test@example.com',
          password: 'password123',
          displayName: '   ',
        },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Name ist erforderlich')
    })
  })

  describe('Invitation Verification', () => {
    it('returns 400 when invitation does not exist', async () => {
      const singleMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'No rows returned' },
      })
      const eq3Mock = { single: singleMock }
      const eq2Mock = { eq: jest.fn(() => eq3Mock) }
      const eq1Mock = { eq: jest.fn(() => eq2Mock) }
      const selectMock = { eq: jest.fn(() => eq1Mock) }

      mockSupabase.from.mockReturnValue({
        select: jest.fn(() => selectMock),
      })

      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'invalid-token',
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User',
        },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Ungültige Einladung')
    })

    it('returns 400 when invitation is expired', async () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)

      const updateEqMock = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      })

      const singleMock = jest.fn().mockResolvedValue({
        data: {
          id: 'inv-123',
          email: 'test@example.com',
          status: 'pending',
          expires_at: pastDate.toISOString(),
        },
        error: null,
      })
      const eq3Mock = { single: singleMock }
      const eq2Mock = { eq: jest.fn(() => eq3Mock) }
      const eq1Mock = { eq: jest.fn(() => eq2Mock) }
      const selectMock = { eq: jest.fn(() => eq1Mock) }

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'invitations') {
          return {
            select: jest.fn(() => selectMock),
            update: jest.fn().mockReturnValue({
              eq: updateEqMock,
            }),
          }
        }
      })

      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'expired-token',
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User',
        },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Einladung ist abgelaufen')
      expect(updateEqMock).toHaveBeenCalledWith('id', 'inv-123')
    })
  })

  describe('User Creation', () => {
    beforeEach(() => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const singleMock = jest.fn().mockResolvedValue({
        data: {
          id: 'inv-123',
          email: 'test@example.com',
          status: 'pending',
          expires_at: futureDate.toISOString(),
          invited_by: 'admin-123',
        },
        error: null,
      })
      const eq3Mock = { single: singleMock }
      const eq2Mock = { eq: jest.fn(() => eq3Mock) }
      const eq1Mock = { eq: jest.fn(() => eq2Mock) }
      const selectMock = { eq: jest.fn(() => eq1Mock) }

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'invitations') {
          return {
            select: jest.fn(() => selectMock),
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }
        } else if (table === 'user_roles') {
          return {
            insert: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }
        }
      })
    })

    it('creates user with email, password, and displayName', async () => {
      mockSupabase.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      })

      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'valid-token',
          email: 'test@example.com',
          password: 'SecurePass123!',
          displayName: 'Test User',
        },
      })

      await POST(mockRequest)

      expect(mockSupabase.auth.admin.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'SecurePass123!',
        email_confirm: true,
        user_metadata: {
          invited_by: 'admin-123',
          full_name: 'Test User',
        },
      })
    })

    it('trims displayName before saving', async () => {
      mockSupabase.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      })

      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'valid-token',
          email: 'test@example.com',
          password: 'SecurePass123!',
          displayName: '  Test User  ',
        },
      })

      await POST(mockRequest)

      expect(mockSupabase.auth.admin.createUser).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'SecurePass123!',
        email_confirm: true,
        user_metadata: {
          invited_by: 'admin-123',
          full_name: 'Test User',
        },
      })
    })

    it('handles displayName with special characters', async () => {
      mockSupabase.auth.admin.createUser.mockResolvedValue({
        data: { user: { id: 'user-123', email: 'test@example.com' } },
        error: null,
      })

      const specialNames = [
        'Müller Schmidt',
        "O'Connor",
        'José García',
        'Anne-Marie',
      ]

      for (const name of specialNames) {
        mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
          method: 'POST',
          body: {
            token: 'valid-token',
            email: 'test@example.com',
            password: 'SecurePass123!',
            displayName: name,
          },
        })

        await POST(mockRequest)

        expect(mockSupabase.auth.admin.createUser).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'SecurePass123!',
          email_confirm: true,
          user_metadata: {
            invited_by: 'admin-123',
            full_name: name,
          },
        })
      }
    })

    it('returns 409 when user already exists', async () => {
      mockSupabase.auth.admin.createUser.mockResolvedValue({
        data: null,
        error: { message: 'User already registered' },
      })

      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'valid-token',
          email: 'existing@example.com',
          password: 'password123',
          displayName: 'Existing User',
        },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(409)
      expect(data.error).toBe('Benutzer existiert bereits')
    })
  })

  describe('Success Response', () => {
    beforeEach(() => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      const singleMock = jest.fn().mockResolvedValue({
        data: {
          id: 'inv-123',
          email: 'test@example.com',
          status: 'pending',
          expires_at: futureDate.toISOString(),
          invited_by: 'admin-123',
        },
        error: null,
      })
      const eq3Mock = { single: singleMock }
      const eq2Mock = { eq: jest.fn(() => eq3Mock) }
      const eq1Mock = { eq: jest.fn(() => eq2Mock) }
      const selectMock = { eq: jest.fn(() => eq1Mock) }

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'invitations') {
          return {
            select: jest.fn(() => selectMock),
            update: jest.fn().mockReturnValue({
              eq: jest.fn().mockResolvedValue({
                data: null,
                error: null,
              }),
            }),
          }
        } else if (table === 'user_roles') {
          return {
            insert: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }
        }
      })
    })

    it('returns 200 with success and user data', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' }
      mockSupabase.auth.admin.createUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })

      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'valid-token',
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User',
        },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.user).toEqual(mockUser)
    })
  })

  describe('Error Handling', () => {
    it('handles unexpected errors gracefully', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      ;(createClient as jest.Mock).mockImplementation(() => {
        throw new Error('Unexpected error')
      })

      mockRequest = createMockNextRequest('http://localhost/api/invitations/accept', {
        method: 'POST',
        body: {
          token: 'token123',
          email: 'test@example.com',
          password: 'password123',
          displayName: 'Test User',
        },
      })

      const response = await POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Fehler beim Akzeptieren der Einladung')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })
})
