'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

function AcceptInviteContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [email, setEmail] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [validating, setValidating] = useState(true)
  const [error, setError] = useState('')
  const [validationError, setValidationError] = useState('')

  useEffect(() => {
    if (!token) {
      setValidationError('Ungültiger Einladungslink')
      setValidating(false)
      return
    }

    validateToken()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  async function validateToken() {
    try {
      const response = await fetch(`/api/invitations/validate?token=${token}`)
      const result = await response.json()

      if (response.ok && result.valid) {
        setEmail(result.email)
      } else {
        setValidationError(result.error || 'Ungültige Einladung')
      }
    } catch (err) {
      setValidationError('Fehler beim Validieren der Einladung')
    } finally {
      setValidating(false)
    }
  }

  async function handleAccept(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!displayName.trim()) {
      setError('Bitte gib einen Namen ein')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwörter stimmen nicht überein')
      return
    }

    if (password.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen lang sein')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token, email, password, displayName })
      })

      const result = await response.json()

      if (response.ok) {
        // Sign in the user
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (signInError) {
          throw signInError
        }

        // Redirect to dashboard
        router.push('/')
      } else {
        setError(result.error || 'Fehler beim Erstellen des Kontos')
      }
    } catch (err) {
      console.error('Error accepting invitation:', err)
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    } finally {
      setLoading(false)
    }
  }

  if (validating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Validiere Einladung...</p>
        </div>
      </div>
    )
  }

  if (validationError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <div className="max-w-md w-full bg-card border rounded-lg p-6 space-y-4">
          <div className="flex items-center gap-2 text-destructive">
            <XCircle className="h-6 w-6" />
            <h1 className="text-xl font-bold">Ungültige Einladung</h1>
          </div>
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            {validationError}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => router.push('/login')}
          >
            Zur Anmeldeseite
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="max-w-md w-full bg-card border rounded-lg p-6 space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-primary/10 p-3 rounded-full">
              <CheckCircle className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Konto erstellen</h1>
          <p className="text-muted-foreground">
            Du wurdest eingeladen, der Plattform beizutreten
          </p>
        </div>

        <form onSubmit={handleAccept} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="displayName">Name</Label>
            <Input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Dein Name"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Passwort</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mindestens 6 Zeichen"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Passwort wiederholen"
              required
              minLength={6}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Erstelle Konto...
              </>
            ) : (
              'Konto erstellen'
            )}
          </Button>
        </form>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            {error}
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Mit der Kontoerstellung stimmst du den Nutzungsbedingungen zu
        </p>
      </div>
    </div>
  )
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <AcceptInviteContent />
    </Suspense>
  )
}
