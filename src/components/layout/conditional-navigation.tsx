'use client'

import { usePathname } from 'next/navigation'
import { Navigation } from './navigation'
import { shouldHideNavigation } from '@/lib/redirect-utils'

export function ConditionalNavigation() {
  const pathname = usePathname()

  if (shouldHideNavigation(pathname)) {
    return null
  }

  return <Navigation />
}
