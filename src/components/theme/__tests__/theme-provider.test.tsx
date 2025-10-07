import { renderHook, waitFor, act, render } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../theme-provider'

describe('ThemeProvider', () => {
  const STORAGE_KEY = 'back2stage-theme'

  // Mock matchMedia globally for all tests
  const mockMatchMedia = (matches: boolean = false) => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches,
        media: query,
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  }

  beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
    // Reset document classes
    document.documentElement.classList.remove('light', 'dark')
    // Setup default matchMedia mock (light theme)
    mockMatchMedia(false)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('initializes with default theme (light)', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('light')
      expect(result.current.resolvedTheme).toBe('light')
    })

    it('initializes with custom default theme', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('dark')
      expect(result.current.resolvedTheme).toBe('dark')
    })

    it('loads theme from localStorage if available', () => {
      localStorage.setItem(STORAGE_KEY, 'dark')

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('dark')
    })

    it('uses custom storage key', () => {
      const customKey = 'custom-theme-key'
      localStorage.setItem(customKey, 'dark')

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider storageKey={customKey}>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('dark')
    })

    it('handles localStorage read errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage disabled')
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('dark')
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        'Failed to read theme from localStorage:',
        expect.any(Error)
      )

      consoleWarnSpy.mockRestore()
    })
  })

  describe('System Theme Detection', () => {
    it('detects system dark mode preference', () => {
      // Mock dark mode preference
      mockMatchMedia(true)

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('system')
      expect(result.current.resolvedTheme).toBe('dark')
    })

    it('detects system light mode preference', () => {
      mockMatchMedia(false)

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('system')
      expect(result.current.resolvedTheme).toBe('light')
    })

    it('listens for system theme changes', async () => {
      let mediaListener: ((e: MediaQueryListEvent) => void) | null = null

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: jest.fn((event, listener) => {
            if (event === 'change') {
              mediaListener = listener
            }
          }),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.resolvedTheme).toBe('light')

      // Simulate system theme change to dark
      if (mediaListener) {
        act(() => {
          mediaListener!({ matches: true } as MediaQueryListEvent)
        })
      }

      await waitFor(() => {
        expect(result.current.resolvedTheme).toBe('dark')
      })
    })

    it('cleans up media query listener on unmount', () => {
      const removeEventListenerMock = jest.fn()

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: removeEventListenerMock,
          dispatchEvent: jest.fn(),
        })),
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      )

      const { unmount } = renderHook(() => useTheme(), { wrapper })

      unmount()

      expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function))
    })
  })

  describe('Resolved Theme Calculation', () => {
    it('resolves light theme directly', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('light')
      expect(result.current.resolvedTheme).toBe('light')
    })

    it('resolves dark theme directly', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('dark')
      expect(result.current.resolvedTheme).toBe('dark')
    })

    it('resolves system theme based on system preference', () => {
      mockMatchMedia(true)

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('system')
      expect(result.current.resolvedTheme).toBe('dark')
    })
  })

  describe('Theme Persistence', () => {
    it('saves theme preference to localStorage', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setTheme('dark')
      })

      await waitFor(() => {
        expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
      })
    })

    it('saves system theme preference correctly', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setTheme('system')
      })

      await waitFor(() => {
        // Should save 'system', not the resolved value
        expect(localStorage.getItem(STORAGE_KEY)).toBe('system')
      })
    })

    it('handles localStorage write errors gracefully', async () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setTheme('dark')
      })

      await waitFor(() => {
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          'Failed to save theme preference:',
          expect.any(Error)
        )
      })

      // Theme should still update in state even if persistence fails
      expect(result.current.theme).toBe('dark')

      consoleWarnSpy.mockRestore()
    })
  })

  describe('DOM Updates', () => {
    it('applies theme class to document root', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      )

      renderHook(() => useTheme(), { wrapper })

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
        expect(document.documentElement.classList.contains('light')).toBe(false)
      })
    })

    it('removes old theme class when changing themes', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      await waitFor(() => {
        expect(document.documentElement.classList.contains('light')).toBe(true)
      })

      act(() => {
        result.current.setTheme('dark')
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
        expect(document.documentElement.classList.contains('light')).toBe(false)
      })
    })

    it('applies resolved system theme to DOM', async () => {
      mockMatchMedia(true)

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      )

      renderHook(() => useTheme(), { wrapper })

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
      })
    })
  })

  describe('Theme Toggle', () => {
    it('toggles from light to dark', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('dark')
    })

    it('toggles from dark to system', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('system')
    })

    it('toggles from system to light', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.toggleTheme()
      })

      expect(result.current.theme).toBe('light')
    })

    it('cycles through all themes correctly', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="light">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      // light -> dark
      act(() => {
        result.current.toggleTheme()
      })
      expect(result.current.theme).toBe('dark')

      // dark -> system
      act(() => {
        result.current.toggleTheme()
      })
      expect(result.current.theme).toBe('system')

      // system -> light
      act(() => {
        result.current.toggleTheme()
      })
      expect(result.current.theme).toBe('light')
    })
  })

  describe('useTheme Hook', () => {
    it('throws error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      expect(() => {
        renderHook(() => useTheme())
      }).toThrow('useTheme must be used within a ThemeProvider')

      consoleErrorSpy.mockRestore()
    })

    it('returns theme context when used inside ThemeProvider', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current).toHaveProperty('theme')
      expect(result.current).toHaveProperty('resolvedTheme')
      expect(result.current).toHaveProperty('setTheme')
      expect(result.current).toHaveProperty('toggleTheme')
      expect(typeof result.current.setTheme).toBe('function')
      expect(typeof result.current.toggleTheme).toBe('function')
    })
  })

  describe('SSR Safety', () => {
    it('handles SSR environment gracefully', () => {
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      expect(result.current.theme).toBe('dark')

      global.window = originalWindow
    })
  })

  describe('Integration Tests', () => {
    it('persists and restores theme across provider instances', async () => {
      const wrapper1 = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result: result1, unmount } = renderHook(() => useTheme(), { wrapper: wrapper1 })

      act(() => {
        result1.current.setTheme('dark')
      })

      await waitFor(() => {
        expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
      })

      unmount()

      // Create new provider instance
      const wrapper2 = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result: result2 } = renderHook(() => useTheme(), { wrapper: wrapper2 })

      expect(result2.current.theme).toBe('dark')
    })

    it('updates DOM and localStorage when theme changes', async () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <ThemeProvider>{children}</ThemeProvider>
      )

      const { result } = renderHook(() => useTheme(), { wrapper })

      act(() => {
        result.current.setTheme('dark')
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true)
        expect(localStorage.getItem(STORAGE_KEY)).toBe('dark')
      })

      act(() => {
        result.current.setTheme('light')
      })

      await waitFor(() => {
        expect(document.documentElement.classList.contains('light')).toBe(true)
        expect(document.documentElement.classList.contains('dark')).toBe(false)
        expect(localStorage.getItem(STORAGE_KEY)).toBe('light')
      })
    })

    it('renders children correctly', () => {
      const { container } = render(
        <ThemeProvider>
          <div data-testid="child">Test Child</div>
        </ThemeProvider>
      )

      expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument()
      expect(container.textContent).toBe('Test Child')
    })
  })
})
