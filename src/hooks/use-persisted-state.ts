import { useState, useEffect, Dispatch, SetStateAction } from 'react'

/**
 * Custom hook for state that persists to localStorage
 * Similar to useState but automatically saves/loads from localStorage
 */
export function usePersistedState<T>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // Initialize state from localStorage or default
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return defaultValue
    }

    try {
      const stored = localStorage.getItem(key)
      if (!stored || stored === 'undefined') {
        return defaultValue
      }

      const parsed = JSON.parse(stored)

      // Handle null explicitly - don't try to merge
      if (parsed === null) {
        return parsed as T
      }

      // Arrays should not be merged, return as-is
      if (Array.isArray(parsed)) {
        return parsed
      }

      // Merge with defaults to handle schema changes (only for plain objects, not arrays)
      if (
        typeof defaultValue === 'object' &&
        defaultValue !== null &&
        !Array.isArray(defaultValue) &&
        typeof parsed === 'object' &&
        parsed !== null &&
        !Array.isArray(parsed)
      ) {
        return { ...defaultValue, ...parsed }
      }

      return parsed
    } catch (error) {
      console.warn(`Failed to load persisted state for ${key}:`, error)
      return defaultValue
    }
  })

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    try {
      localStorage.setItem(key, JSON.stringify(state))
    } catch (error) {
      console.warn(`Failed to persist state for ${key}:`, error)
    }
  }, [key, state])

  return [state, setState]
}
