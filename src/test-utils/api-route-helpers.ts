/**
 * Helper utilities for testing Next.js API routes
 */

export function createMockNextRequest(url: string, options: {
  method?: string
  body?: any
  headers?: Record<string, string>
} = {}) {
  const parsedUrl = new URL(url)

  const headers = new Map(Object.entries(options.headers || {}))

  return {
    method: options.method || 'GET',
    url,
    nextUrl: {
      searchParams: parsedUrl.searchParams,
    },
    headers: {
      get: (name: string) => headers.get(name) || null,
      has: (name: string) => headers.has(name),
      forEach: (callback: (value: string, key: string) => void) => {
        headers.forEach((value, key) => callback(value, key))
      },
    },
    json: async () => options.body || {},
  } as any
}

export function createMockNextResponse() {
  return {
    json: (data: any, init?: { status?: number }) => ({
      status: init?.status || 200,
      json: async () => data,
    }),
  } as any
}
