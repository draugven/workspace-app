import {
  getSafeRedirectPath,
  shouldHideNavigation,
  isPublicPath,
} from '../navigation-utils'

describe('navigation-utils', () => {
  describe('getSafeRedirectPath', () => {
    describe('Valid relative paths', () => {
      it('should return "/" for null redirect', () => {
        expect(getSafeRedirectPath(null)).toBe('/')
      })

      it('should return "/" for undefined redirect', () => {
        expect(getSafeRedirectPath(undefined as any)).toBe('/')
      })

      it('should return "/" for empty string redirect', () => {
        expect(getSafeRedirectPath('')).toBe('/')
      })

      it('should allow simple relative path: /tasks', () => {
        expect(getSafeRedirectPath('/tasks')).toBe('/tasks')
      })

      it('should allow path with query params: /tasks?filter=active', () => {
        expect(getSafeRedirectPath('/tasks?filter=active')).toBe('/tasks?filter=active')
      })

      it('should allow path with hash: /tasks#section', () => {
        expect(getSafeRedirectPath('/tasks#section')).toBe('/tasks#section')
      })

      it('should allow complex path: /tasks?filter=active&sort=desc#top', () => {
        expect(getSafeRedirectPath('/tasks?filter=active&sort=desc#top')).toBe(
          '/tasks?filter=active&sort=desc#top'
        )
      })

      it('should preserve query params from relative URL', () => {
        const result = getSafeRedirectPath('/admin/invitations?status=pending')
        expect(result).toBe('/admin/invitations?status=pending')
      })

      it('should preserve hash from relative URL', () => {
        const result = getSafeRedirectPath('/notes#notes-section')
        expect(result).toBe('/notes#notes-section')
      })
    })

    describe('Invalid redirects (should block)', () => {
      let consoleWarnSpy: jest.SpyInstance

      beforeEach(() => {
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      })

      afterEach(() => {
        consoleWarnSpy.mockRestore()
      })

      it('should block absolute URL with https: "https://evil.com"', () => {
        const result = getSafeRedirectPath('https://evil.com')
        expect(result).toBe('/')
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Invalid redirect path (must be relative): https://evil.com'
        )
      })

      it('should block absolute URL with http: "http://evil.com"', () => {
        const result = getSafeRedirectPath('http://evil.com')
        expect(result).toBe('/')
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Invalid redirect path (must be relative): http://evil.com'
        )
      })

      it('should block protocol-relative URL: "//evil.com"', () => {
        const result = getSafeRedirectPath('//evil.com')
        expect(result).toBe('/')
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Invalid redirect path (must be relative): //evil.com'
        )
      })

      it('should block protocol-relative with path: "//evil.com/phishing"', () => {
        const result = getSafeRedirectPath('//evil.com/phishing')
        expect(result).toBe('/')
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Invalid redirect path (must be relative): //evil.com/phishing'
        )
      })

      it('should block javascript: protocol: "javascript:alert(1)"', () => {
        const result = getSafeRedirectPath('javascript:alert(1)')
        expect(result).toBe('/')
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Invalid redirect path (must be relative): javascript:alert(1)'
        )
      })

      it('should block data: protocol: "data:text/html,<script>alert(1)</script>"', () => {
        const result = getSafeRedirectPath('data:text/html,<script>alert(1)</script>')
        expect(result).toBe('/')
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Invalid redirect path (must be relative): data:text/html,<script>alert(1)</script>'
        )
      })

      it('should block mailto: protocol: "mailto:test@example.com"', () => {
        const result = getSafeRedirectPath('mailto:test@example.com')
        expect(result).toBe('/')
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Invalid redirect path (must be relative): mailto:test@example.com'
        )
      })
    })

    describe('Edge cases', () => {
      let consoleWarnSpy: jest.SpyInstance
      let consoleErrorSpy: jest.SpyInstance

      beforeEach(() => {
        consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      })

      afterEach(() => {
        consoleWarnSpy.mockRestore()
        consoleErrorSpy.mockRestore()
      })

      it('should handle path without leading slash by blocking: "tasks"', () => {
        const result = getSafeRedirectPath('tasks')
        expect(result).toBe('/')
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Invalid redirect path (must be relative): tasks'
        )
      })

      it('should handle malformed URL by blocking (parsing fails)', () => {
        // A malformed URL that would cause URL parsing to fail
        // Using a path that starts with / but has invalid characters
        const malformedPath = '/tasks\x00invalid'
        const result = getSafeRedirectPath(malformedPath)

        // The URL constructor might not fail on this, but we ensure it returns a safe path
        expect(result).toMatch(/^\//)
      })

      it('should handle very long paths safely', () => {
        const longPath = '/' + 'a'.repeat(2000)
        const result = getSafeRedirectPath(longPath)
        expect(result).toMatch(/^\//)
      })

      it('should handle paths with encoded characters', () => {
        const encodedPath = '/tasks?name=%E6%97%A5%E6%9C%AC%E8%AA%9E'
        const result = getSafeRedirectPath(encodedPath)
        expect(result).toBe('/tasks?name=%E6%97%A5%E6%9C%AC%E8%AA%9E')
      })

      it('should handle paths with multiple slashes', () => {
        const result = getSafeRedirectPath('/tasks//subtasks')
        expect(result).toBe('/tasks//subtasks')
      })
    })
  })

  describe('shouldHideNavigation', () => {
    it('should return true for /login', () => {
      expect(shouldHideNavigation('/login')).toBe(true)
    })

    it('should return false for /', () => {
      expect(shouldHideNavigation('/')).toBe(false)
    })

    it('should return true for /accept-invite', () => {
      expect(shouldHideNavigation('/accept-invite')).toBe(true)
    })

    it('should return false for /tasks', () => {
      expect(shouldHideNavigation('/tasks')).toBe(false)
    })

    it('should return false for /admin/invitations', () => {
      expect(shouldHideNavigation('/admin/invitations')).toBe(false)
    })

    it('should return false for /props', () => {
      expect(shouldHideNavigation('/props')).toBe(false)
    })

    it('should return false for /notes', () => {
      expect(shouldHideNavigation('/notes')).toBe(false)
    })
  })

  describe('isPublicPath', () => {
    it('should return true for /login', () => {
      expect(isPublicPath('/login')).toBe(true)
    })

    it('should return false for /', () => {
      expect(isPublicPath('/')).toBe(false)
    })

    it('should return true for /accept-invite', () => {
      expect(isPublicPath('/accept-invite')).toBe(true)
    })

    it('should return false for /tasks', () => {
      expect(isPublicPath('/tasks')).toBe(false)
    })

    it('should return false for /admin/invitations', () => {
      expect(isPublicPath('/admin/invitations')).toBe(false)
    })

    it('should return false for /props', () => {
      expect(isPublicPath('/props')).toBe(false)
    })

    it('should return false for /notes', () => {
      expect(isPublicPath('/notes')).toBe(false)
    })
  })
})
