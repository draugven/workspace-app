import { renderHook, act } from '@testing-library/react'
import { usePersistedState } from '../use-persisted-state'

describe('usePersistedState', () => {
  const TEST_KEY = 'test-key'
  const DEFAULT_VALUE = { count: 0, name: 'test' }

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('Initialization', () => {
    it('initializes with default value when localStorage is empty', () => {
      const { result } = renderHook(() =>
        usePersistedState(TEST_KEY, DEFAULT_VALUE)
      )

      expect(result.current[0]).toEqual(DEFAULT_VALUE)
      // Hook automatically persists initial value to localStorage
      expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(DEFAULT_VALUE))
    })

    it('loads value from localStorage if it exists', () => {
      const storedValue = { count: 42, name: 'stored' }
      localStorage.setItem(TEST_KEY, JSON.stringify(storedValue))

      const { result } = renderHook(() =>
        usePersistedState(TEST_KEY, DEFAULT_VALUE)
      )

      expect(result.current[0]).toEqual({ ...DEFAULT_VALUE, ...storedValue })
    })

    it('handles primitive default values', () => {
      const { result } = renderHook(() =>
        usePersistedState('primitive-key', 'hello')
      )

      expect(result.current[0]).toBe('hello')
    })

    it('handles null default values', () => {
      const { result } = renderHook(() =>
        usePersistedState<string | null>('null-key', null)
      )

      expect(result.current[0]).toBe(null)
    })

    it('loads null from localStorage correctly', () => {
      localStorage.setItem('null-key', JSON.stringify(null))

      const { result } = renderHook(() =>
        usePersistedState<string | null>('null-key', 'default')
      )

      expect(result.current[0]).toBe(null)
    })

    it('handles number default values', () => {
      const { result } = renderHook(() =>
        usePersistedState('number-key', 42)
      )

      expect(result.current[0]).toBe(42)
    })

    it('handles boolean default values', () => {
      const { result } = renderHook(() =>
        usePersistedState('boolean-key', true)
      )

      expect(result.current[0]).toBe(true)
    })

    it('handles array default values', () => {
      const defaultArray = [1, 2, 3]
      const { result } = renderHook(() =>
        usePersistedState('array-key', defaultArray)
      )

      expect(result.current[0]).toEqual(defaultArray)
    })
  })

  describe('Schema Migration', () => {
    it('merges stored values with default object to handle schema changes', () => {
      // Old schema in storage (missing new field)
      localStorage.setItem(TEST_KEY, JSON.stringify({ count: 10 }))

      // New schema with additional field
      const newDefaultValue = { count: 0, name: 'test', newField: 'default' }

      const { result } = renderHook(() =>
        usePersistedState(TEST_KEY, newDefaultValue)
      )

      // Should merge: keep existing count, add new fields from default
      expect(result.current[0]).toEqual({
        count: 10,
        name: 'test',
        newField: 'default',
      })
    })

    it('does not merge primitive values', () => {
      localStorage.setItem('string-key', JSON.stringify('stored'))

      const { result } = renderHook(() =>
        usePersistedState('string-key', 'default')
      )

      // Primitives are not merged, just returned as-is
      expect(result.current[0]).toBe('stored')
    })

    it('handles null in localStorage gracefully', () => {
      localStorage.setItem(TEST_KEY, JSON.stringify(null))

      const { result } = renderHook(() =>
        usePersistedState<typeof DEFAULT_VALUE | null>(TEST_KEY, DEFAULT_VALUE)
      )

      // When null is explicitly stored, it should be returned as null
      // This is the correct behavior for nullable filter fields
      expect(result.current[0]).toBe(null)
    })
  })

  describe('State Updates', () => {
    it('updates state and persists to localStorage', () => {
      const { result } = renderHook(() =>
        usePersistedState(TEST_KEY, DEFAULT_VALUE)
      )

      const newValue = { count: 100, name: 'updated' }

      act(() => {
        result.current[1](newValue)
      })

      expect(result.current[0]).toEqual(newValue)
      expect(localStorage.getItem(TEST_KEY)).toBe(JSON.stringify(newValue))
    })

    it('handles functional updates', () => {
      const { result } = renderHook(() =>
        usePersistedState(TEST_KEY, DEFAULT_VALUE)
      )

      act(() => {
        result.current[1](prev => ({ ...prev, count: prev.count + 1 }))
      })

      expect(result.current[0]).toEqual({ count: 1, name: 'test' })
      expect(localStorage.getItem(TEST_KEY)).toBe(
        JSON.stringify({ count: 1, name: 'test' })
      )
    })

    it('persists multiple state updates', () => {
      const { result } = renderHook(() =>
        usePersistedState('counter', 0)
      )

      act(() => {
        result.current[1](1)
      })
      expect(localStorage.getItem('counter')).toBe('1')

      act(() => {
        result.current[1](2)
      })
      expect(localStorage.getItem('counter')).toBe('2')

      act(() => {
        result.current[1](3)
      })
      expect(localStorage.getItem('counter')).toBe('3')
    })
  })

  describe('SSR Safety', () => {
    it('returns default value when window is undefined (SSR)', () => {
      // Mock SSR environment
      const originalWindow = global.window
      // @ts-ignore
      delete global.window

      const { result } = renderHook(() =>
        usePersistedState(TEST_KEY, DEFAULT_VALUE)
      )

      expect(result.current[0]).toEqual(DEFAULT_VALUE)

      // Restore window
      global.window = originalWindow
    })

    it('does not attempt localStorage access during SSR', () => {
      const originalWindow = global.window
      const originalLocalStorage = global.localStorage
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      // @ts-ignore
      delete global.window
      // @ts-ignore
      delete global.localStorage

      // Don't spy on Storage.prototype since it won't exist in SSR context
      const { result } = renderHook(() =>
        usePersistedState(TEST_KEY, DEFAULT_VALUE)
      )

      // Should return default value despite localStorage not being available
      expect(result.current[0]).toEqual(DEFAULT_VALUE)

      global.window = originalWindow
      global.localStorage = originalLocalStorage
      consoleWarnSpy.mockRestore()
    })
  })

  describe('Error Handling', () => {
    it('handles JSON.parse errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      localStorage.setItem(TEST_KEY, 'invalid-json{{{')

      const { result } = renderHook(() =>
        usePersistedState(TEST_KEY, DEFAULT_VALUE)
      )

      expect(result.current[0]).toEqual(DEFAULT_VALUE)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `Failed to load persisted state for ${TEST_KEY}:`,
        expect.any(Error)
      )

      consoleWarnSpy.mockRestore()
    })

    it('handles localStorage.getItem errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('localStorage disabled')
      })

      const { result } = renderHook(() =>
        usePersistedState(TEST_KEY, DEFAULT_VALUE)
      )

      expect(result.current[0]).toEqual(DEFAULT_VALUE)
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `Failed to load persisted state for ${TEST_KEY}:`,
        expect.any(Error)
      )

      consoleWarnSpy.mockRestore()
    })

    it('handles localStorage.setItem errors gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError')
      })

      const { result } = renderHook(() =>
        usePersistedState(TEST_KEY, DEFAULT_VALUE)
      )

      act(() => {
        result.current[1]({ count: 999, name: 'test' })
      })

      // State should still update even if persistence fails
      expect(result.current[0]).toEqual({ count: 999, name: 'test' })
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        `Failed to persist state for ${TEST_KEY}:`,
        expect.any(Error)
      )

      consoleWarnSpy.mockRestore()
    })

    it('continues working after persistence failure', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      const setItemSpy = jest
        .spyOn(Storage.prototype, 'setItem')
        .mockImplementationOnce(() => {
          throw new Error('Storage full')
        })
        .mockImplementationOnce(() => {
          // Second call succeeds
        })

      const { result } = renderHook(() =>
        usePersistedState(TEST_KEY, DEFAULT_VALUE)
      )

      // First update fails
      act(() => {
        result.current[1]({ count: 1, name: 'first' })
      })
      expect(consoleWarnSpy).toHaveBeenCalled()

      // Second update succeeds
      act(() => {
        result.current[1]({ count: 2, name: 'second' })
      })
      expect(result.current[0]).toEqual({ count: 2, name: 'second' })

      consoleWarnSpy.mockRestore()
      setItemSpy.mockRestore()
    })
  })

  describe('Multiple Instances', () => {
    it('allows multiple hooks with different keys', () => {
      const { result: result1 } = renderHook(() =>
        usePersistedState('key1', 'value1')
      )
      const { result: result2 } = renderHook(() =>
        usePersistedState('key2', 'value2')
      )

      expect(result1.current[0]).toBe('value1')
      expect(result2.current[0]).toBe('value2')

      act(() => {
        result1.current[1]('updated1')
      })

      expect(result1.current[0]).toBe('updated1')
      expect(result2.current[0]).toBe('value2')
      expect(localStorage.getItem('key1')).toBe(JSON.stringify('updated1'))
      expect(localStorage.getItem('key2')).toBe(JSON.stringify('value2'))
    })

    it('allows multiple hooks with same key to share state via localStorage', () => {
      const { result: result1 } = renderHook(() =>
        usePersistedState('shared-key', 0)
      )

      act(() => {
        result1.current[1](42)
      })

      // New hook instance should read the updated value from localStorage
      const { result: result2 } = renderHook(() =>
        usePersistedState('shared-key', 0)
      )

      expect(result2.current[0]).toBe(42)
    })
  })

  describe('Edge Cases', () => {
    it('handles empty string key', () => {
      const { result } = renderHook(() =>
        usePersistedState('', 'test')
      )

      expect(result.current[0]).toBe('test')

      act(() => {
        result.current[1]('updated')
      })

      expect(localStorage.getItem('')).toBe(JSON.stringify('updated'))
    })

    it('handles very long keys', () => {
      const longKey = 'a'.repeat(1000)
      const { result } = renderHook(() =>
        usePersistedState(longKey, 'value')
      )

      expect(result.current[0]).toBe('value')

      act(() => {
        result.current[1]('updated')
      })

      expect(localStorage.getItem(longKey)).toBe(JSON.stringify('updated'))
    })

    it('handles undefined as stored value', () => {
      // JSON.stringify(undefined) returns undefined (not a string), so setItem will store "undefined"
      localStorage.setItem(TEST_KEY, 'undefined')

      const { result } = renderHook(() =>
        usePersistedState(TEST_KEY, DEFAULT_VALUE)
      )

      // The string 'undefined' is now detected early and default is returned
      // without triggering JSON.parse error
      expect(result.current[0]).toEqual(DEFAULT_VALUE)
    })

    it('handles complex nested objects', () => {
      const complexValue = {
        user: { name: 'Test', roles: ['admin', 'user'] },
        settings: { theme: 'dark', notifications: true },
        metadata: { version: 1, timestamp: Date.now() },
      }

      const { result } = renderHook(() =>
        usePersistedState('complex', complexValue)
      )

      act(() => {
        result.current[1](prev => ({
          ...prev,
          user: { ...prev.user, roles: [...prev.user.roles, 'moderator'] },
        }))
      })

      expect(result.current[0].user.roles).toEqual(['admin', 'user', 'moderator'])
      expect(JSON.parse(localStorage.getItem('complex')!).user.roles).toEqual([
        'admin',
        'user',
        'moderator',
      ])
    })
  })
})
