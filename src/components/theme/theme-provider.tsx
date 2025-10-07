'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type ThemePreference = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

type ThemeProviderContextType = {
  theme: ThemePreference
  resolvedTheme: ResolvedTheme
  setTheme: (theme: ThemePreference) => void
  toggleTheme: () => void
}

const ThemeProviderContext = createContext<ThemeProviderContextType | undefined>(
  undefined
)

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: ThemePreference
  storageKey?: string
}

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'back2stage-theme',
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemePreference>(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      try {
        return (localStorage.getItem(storageKey) as ThemePreference) || defaultTheme
      } catch (error) {
        console.warn('Failed to read theme from localStorage:', error)
        return defaultTheme
      }
    }
    return defaultTheme
  })

  // Resolve system preference
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return 'light'
  })

  // Watch for system theme changes
  useEffect(() => {
    if (typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Determine which theme to actually apply
  const resolvedTheme: ResolvedTheme = theme === 'system' ? systemTheme : theme

  // Apply theme to DOM and save preference
  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)

    try {
      localStorage.setItem(storageKey, theme)
    } catch (error) {
      console.warn('Failed to save theme preference:', error)
      // Theme will still work for current session, just won't persist
    }
  }, [theme, resolvedTheme, storageKey])

  const toggleTheme = () => {
    // Cycle through: light -> dark -> system -> light
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const value = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}