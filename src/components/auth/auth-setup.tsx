'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth/auth-provider'
import { getSafeRedirectPath } from '@/lib/redirect-utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AuthSetup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const { user, loading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Handle redirect after successful authentication
  useEffect(() => {
    if (!loading && user) {
      // Get redirect path from URL query parameter
      const redirectParam = searchParams.get('redirect')
      const safePath = getSafeRedirectPath(redirectParam)
      console.log('[AuthSetup] Redirecting to:', safePath)
      router.push(safePath)
    }
  }, [user, loading, router, searchParams])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        setMessage(`Anmeldefehler: ${error.message}`)
      }
      // On success, the redirect is handled by the useEffect above
    } catch (err) {
      setMessage('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-h3">Anmelden</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          {message && (
            <div className="text-sm p-3 rounded-md text-destructive bg-destructive/10">
              {message}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="deine-email@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Gib dein Passwort ein"
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Wird angemeldet...' : 'Anmelden'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}