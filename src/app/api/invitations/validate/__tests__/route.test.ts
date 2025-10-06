import { GET } from '../route'
import { createServerComponentClient } from '@/lib/supabase'
import { createMockNextRequest } from '@/test-utils/api-route-helpers'

// Mock dependencies
jest.mock('@/lib/supabase')

describe('GET /api/invitations/validate', () => {
  let mockSupabase: any
  let mockRequest: any

  beforeEach(() => {
    jest.clearAllMocks()

    mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(),
        })),
      })),
    }

    ;(createServerComponentClient as jest.Mock).mockResolvedValue(mockSupabase)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Token Validation', () => {
    it('returns 400 when token is missing', async () => {
      mockRequest = createMockNextRequest('http://localhost/api/invitations/validate')

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBe('Token fehlt')
    })

    it('returns 400 when invitation does not exist', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'No rows returned' },
            }),
          }),
        }),
      })

      mockRequest = createMockNextRequest(
        'http://localhost/api/invitations/validate?token=invalid-token'
      )

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.valid).toBe(false)
      expect(data.error).toBe('Ungültige Einladung')
    })

    it('validates pending invitation successfully', async () => {
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 7)

      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                email: 'test@example.com',
                status: 'pending',
                expires_at: futureDate.toISOString(),
              },
              error: null,
            }),
          }),
        }),
      })

      mockRequest = createMockNextRequest(
        'http://localhost/api/invitations/validate?token=valid-token-123'
      )

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.valid).toBe(true)
      expect(data.email).toBe('test@example.com')
    })
  })

  describe('Status Checks', () => {
    it('returns 400 when invitation is already accepted', async () => {
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: {
                email: 'test@example.com',
                status: 'accepted',
                expires_at: new Date().toISOString(),
              },
              error: null,
            }),
          }),
        }),
      })

      mockRequest = createMockNextRequest(
        'http://localhost/api/invitations/validate?token=used-token'
      )

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.valid).toBe(false)
      expect(data.error).toBe('Diese Einladung wurde bereits verwendet')
    })
  })

  describe('Expiration Handling', () => {
    it('marks invitation as expired when past expiry date', async () => {
      const pastDate = new Date()
      pastDate.setDate(pastDate.getDate() - 1)

      const updateEqMock = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      })

      const selectResult = {
        data: {
          email: 'test@example.com',
          status: 'pending',
          expires_at: pastDate.toISOString(),
        },
        error: null,
      }

      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'invitations') {
          return {
            select: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue(selectResult),
              }),
            }),
            update: jest.fn().mockReturnValue({
              eq: updateEqMock,
            }),
          }
        }
      })

      mockRequest = createMockNextRequest(
        'http://localhost/api/invitations/validate?token=expired-token'
      )

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.valid).toBe(false)
      expect(data.error).toBe('Diese Einladung ist abgelaufen')
      expect(updateEqMock).toHaveBeenCalledWith('token', 'expired-token')
    })
  })

  describe('Error Handling', () => {
    it('returns 500 when unexpected error occurs', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      ;(createServerComponentClient as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      )

      mockRequest = createMockNextRequest(
        'http://localhost/api/invitations/validate?token=some-token'
      )

      const response = await GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.valid).toBe(false)
      expect(data.error).toBe('Fehler beim Validieren der Einladung')
      expect(consoleErrorSpy).toHaveBeenCalled()

      consoleErrorSpy.mockRestore()
    })
  })
})
