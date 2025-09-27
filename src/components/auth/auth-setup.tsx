'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function AuthSetup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isSignUp, setIsSignUp] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName.trim() || email.split('@')[0], // Use custom display name or email prefix fallback
            }
          }
        })
        if (error) {
          setMessage(`Registrierungsfehler: ${error.message}`)
        } else {
          setMessage('Überprüfen Sie Ihre E-Mail für den Bestätigungslink!')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) {
          setMessage(`Anmeldefehler: ${error.message}`)
        }
      }
    } catch (err) {
      setMessage('Ein unerwarteter Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isSignUp ? 'Konto erstellen' : 'Anmelden'}</CardTitle>
        <CardDescription>
          {isSignUp
            ? 'Erstellen Sie Ihr Konto für die Theater-Produktions-App'
            : 'Melden Sie sich an, um auf die Theater-Produktions-App zuzugreifen'
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleAuth} className="space-y-4">
          {message && (
            <div className={`text-sm p-3 rounded-md ${
              message.includes('error') || message.includes('Error')
                ? 'text-destructive bg-destructive/10'
                : 'text-green-700 bg-green-50'
            }`}>
              {message}
            </div>
          )}

          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="displayName">Anzeigename (optional)</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ihr Anzeigename"
              />
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
              placeholder="ihre-email@example.com"
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
              placeholder="Geben Sie Ihr Passwort ein"
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? (isSignUp ? 'Konto wird erstellt...' : 'Wird angemeldet...')
              : (isSignUp ? 'Konto erstellen' : 'Anmelden')
            }
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setMessage(null)
                setDisplayName('') // Clear display name when switching
              }}
              className="text-sm text-muted-foreground hover:text-foreground underline"
            >
              {isSignUp
                ? 'Haben Sie bereits ein Konto? Anmelden'
                : 'Benötigen Sie ein Konto? Erstellen Sie eines'
              }
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}