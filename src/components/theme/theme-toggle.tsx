'use client'

import { Moon, Sun } from 'lucide-react'
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
  const { theme, toggleTheme } = useTheme()

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className="relative"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      {showLabel && (
        <span className="ml-2 hidden sm:inline">
          {theme === 'light' ? 'Dark' : 'Light'}
        </span>
      )}
    </Button>
  )
}