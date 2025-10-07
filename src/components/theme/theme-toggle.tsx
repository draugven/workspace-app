'use client'

import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from './theme-provider'

type ThemeToggleProps = {
  showLabel?: boolean
  size?: 'default' | 'sm' | 'lg' | 'icon'
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
}

export function ThemeToggle({
  showLabel = false,
  size = 'icon',
  variant = 'ghost'
}: ThemeToggleProps) {
  const { theme, resolvedTheme, toggleTheme } = useTheme()

  // Get the next theme in the cycle for aria-label
  const getNextTheme = () => {
    if (theme === 'light') return 'dark'
    if (theme === 'dark') return 'system'
    return 'light'
  }

  // Get label text for current theme
  const getThemeLabel = () => {
    if (theme === 'system') return `System (${resolvedTheme})`
    return theme === 'light' ? 'Light' : 'Dark'
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className="relative"
      aria-label={`Current: ${theme}, switch to ${getNextTheme()}`}
      title={showLabel ? undefined : getThemeLabel()}
    >
      {theme === 'system' ? (
        <Monitor className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <>
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </>
      )}
      {showLabel && (
        <span className="ml-2 hidden sm:inline">
          {getThemeLabel()}
        </span>
      )}
    </Button>
  )
}