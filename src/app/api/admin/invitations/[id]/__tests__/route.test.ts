import { createMockNextRequest } from '@/test-utils/api-route-helpers'
import { isUserAdmin } from '@/lib/auth-utils'

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
import { DELETE } from '../route'

describe('DELETE /api/admin/invitations/[id]', () => {
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
      update: jest.fn(() => ({
        eq: jest.fn(),
      })),
    })
  })

  afterEach(() => {
    process.env = originalEnv
    jest.restoreAllMocks()
  })

  describe('Authentication and Authorization', () => {
    it('returns 401 when Authorization header is missing', async () => {
      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/inv-123', {
        method: 'DELETE',
      })

      const response = await DELETE(mockRequest, { params: { id: 'inv-123' } })
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

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/inv-123', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer invalid-token' },
      })

      const response = await DELETE(mockRequest, { params: { id: 'inv-123' } })
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

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/inv-123', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer expired-token' },
      })

      const response = await DELETE(mockRequest, { params: { id: 'inv-123' } })
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

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/inv-123', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer valid-token' },
      })

      const response = await DELETE(mockRequest, { params: { id: 'inv-123' } })
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toBe('Keine Berechtigung')
      expect(isUserAdmin).toHaveBeenCalledWith('user-123')
    })
  })

  describe('Invitation Revocation', () => {
    beforeEach(() => {
      const mockUser = { id: 'admin-123', email: 'admin@example.com' }
      mockGetUser.mockResolvedValue({
        data: { user: mockUser },
        error: null,
      })
      ;(isUserAdmin as jest.Mock).mockResolvedValue(true)
    })

    it('revokes invitation successfully', async () => {
      const eqMock = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      })

      mockFrom.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: eqMock,
        }),
      })

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/inv-123', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer admin-token' },
      })

      const response = await DELETE(mockRequest, { params: { id: 'inv-123' } })
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(mockFrom).toHaveBeenCalledWith('invitations')
      expect(eqMock).toHaveBeenCalledWith('id', 'inv-123')
    })

    it('updates status to revoked', async () => {
      const updateMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({
          data: null,
          error: null,
        }),
      })

      mockFrom.mockReturnValue({
        update: updateMock,
      })

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/inv-456', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer admin-token' },
      })

      await DELETE(mockRequest, { params: { id: 'inv-456' } })

      expect(updateMock).toHaveBeenCalledWith({ status: 'revoked' })
    })

    it('handles revocation with different invitation IDs', async () => {
      const eqMock = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      })

      mockFrom.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: eqMock,
        }),
      })

      const invitationIds = ['inv-1', 'inv-2', 'abc-xyz-123']

      for (const id of invitationIds) {
        mockRequest = createMockNextRequest(`http://localhost/api/admin/invitations/${id}`, {
          method: 'DELETE',
          headers: { Authorization: 'Bearer admin-token' },
        })

        const response = await DELETE(mockRequest, { params: { id } })
        const data = await response.json()

        expect(response.status).toBe(200)
        expect(data.success).toBe(true)
        expect(eqMock).toHaveBeenCalledWith('id', id)
      }
    })

    it('returns 500 when database operation fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      mockFrom.mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' },
          }),
        }),
      })

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/inv-123', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer admin-token' },
      })

      const response = await DELETE(mockRequest, { params: { id: 'inv-123' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Fehler beim Widerrufen')
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error revoking invitation:',
        expect.any(Object)
      )

      consoleErrorSpy.mockRestore()
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

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/inv-123', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer admin-token' },
      })

      const response = await DELETE(mockRequest, { params: { id: 'inv-123' } })
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.error).toBe('Fehler beim Widerrufen')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })

    it('does not revoke if auth check fails before database call', async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
        error: new Error('Auth failed'),
      })

      const updateMock = jest.fn()
      mockFrom.mockReturnValue({
        update: updateMock,
      })

      mockRequest = createMockNextRequest('http://localhost/api/admin/invitations/inv-123', {
        method: 'DELETE',
        headers: { Authorization: 'Bearer admin-token' },
      })

      await DELETE(mockRequest, { params: { id: 'inv-123' } })

      expect(updateMock).not.toHaveBeenCalled()
    })
  })
})
