/**
 * Navigation utilities for safe routing and redirects
 */

/**
 * Validates and sanitizes a redirect path to prevent open redirect vulnerabilities.
 * Only allows relative paths (starting with '/') and prevents redirects to external sites.
 *
 * @param redirect - The redirect path from query parameter or other source
 * @returns Safe redirect path (relative URL) or '/' if invalid
 *
 * @example
 * getSafeRedirectPath('/tasks') // returns '/tasks'
 * getSafeRedirectPath('https://evil.com') // returns '/'
 * getSafeRedirectPath('/tasks?filter=active') // returns '/tasks?filter=active'
 * getSafeRedirectPath(null) // returns '/'
 */
export function getSafeRedirectPath(redirect: string | null): string {
  // Default to home page if no redirect provided
  if (!redirect) {
    return '/'
  }

  // Only allow relative paths (must start with '/' but not '//')
  // Block protocol-relative URLs like '//evil.com'
  if (!redirect.startsWith('/') || redirect.startsWith('//')) {
    console.warn(`Invalid redirect path (must be relative): ${redirect}`)
    return '/'
  }

  // Parse the redirect to extract only the path, query, and hash
  // This prevents protocol-relative URLs like '//evil.com'
  try {
    // Use a dummy base URL to parse relative paths
    const url = new URL(redirect, 'http://dummy.com')
    const safePath = url.pathname + url.search + url.hash

    // Double-check that the result is still a relative path
    if (!safePath.startsWith('/')) {
      console.warn(`Parsed redirect is not relative: ${safePath}`)
      return '/'
    }

    return safePath
  } catch (error) {
    // If URL parsing fails, it's likely an invalid path
    console.error(`Failed to parse redirect path: ${redirect}`, error)
    return '/'
  }
}

/**
 * Public paths that don't require authentication
 */
export const PUBLIC_PATHS = ['/login', '/accept-invite'] as const

/**
 * Paths where navigation should be hidden
 */
export const HIDE_NAV_PATHS = ['/login', '/accept-invite'] as const

/**
 * Check if a path is public (doesn't require authentication)
 */
export function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.includes(pathname as any)
}

/**
 * Check if navigation should be hidden for a given path
 */
export function shouldHideNavigation(pathname: string): boolean {
  return HIDE_NAV_PATHS.includes(pathname as any)
}
