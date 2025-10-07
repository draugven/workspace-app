'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/components/auth/auth-provider'
import { useRealtimeData } from '@/hooks/use-realtime-data'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageHeader } from '@/components/ui/page-header'
import { Copy, Check, UserPlus, XCircle, Clock, CheckCircle, Ban } from 'lucide-react'
import { format } from 'date-fns'
import { de } from 'date-fns/locale'
import { Badge } from '@/components/ui/badge'

interface Invitation {
  id: string
  email: string
  token: string
  invited_by: string | null
  invited_at: string
  accepted_at: string | null
  expires_at: string
  status: 'pending' | 'accepted' | 'expired' | 'revoked'
}

export default function InvitationsPage() {
  const router = useRouter()
  const { isAdmin, adminLoading } = useAuth()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const { data: invitations, loading: invitationsLoading } = useRealtimeData<Invitation>({
    tableName: 'invitations',
    orderBy: { column: 'invited_at', ascending: false }
  })

  // Redirect non-admin users
  useEffect(() => {
    if (!adminLoading && !isAdmin) {
      router.push('/')
    }
  }, [adminLoading, isAdmin, router])

  if (adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Lade...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  async function handleCreateInvitation(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGeneratedUrl('')
    setCopied(false)

    try {
      // Get current session token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Session error:', sessionError)
        setError('Fehler beim Abrufen der Sitzung')
        setLoading(false)
        return
      }

      if (!session?.access_token) {
        console.error('No session or access token found')
        setError('Nicht authentifiziert')
        setLoading(false)
        return
      }

      const response = await fetch('/api/admin/invitations/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ email })
      })

      const result = await response.json()

      if (response.ok) {
        const inviteUrl = `${window.location.origin}/accept-invite?token=${result.invitation.token}`
        setGeneratedUrl(inviteUrl)
        setEmail('')
      } else {
        setError(result.error || 'Fehler beim Erstellen der Einladung')
      }
    } catch (err) {
      setError('Netzwerkfehler beim Erstellen der Einladung')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(generatedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  async function handleRevoke(invitationId: string) {
    if (!confirm('Möchten Sie diese Einladung wirklich widerrufen?')) {
      return
    }

    try {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        alert('Nicht authentifiziert')
        return
      }

      const response = await fetch(`/api/admin/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      })

      if (!response.ok) {
        throw new Error('Fehler beim Widerrufen')
      }
    } catch (err) {
      console.error('Error revoking invitation:', err)
      alert('Fehler beim Widerrufen der Einladung')
    }
  }

  function getStatusBadge(invitation: Invitation) {
    const now = new Date()
    const expiresAt = new Date(invitation.expires_at)

    switch (invitation.status) {
      case 'accepted':
        return (
          <Badge variant="success" className="gap-1">
            <CheckCircle className="h-3 w-3" />
            Akzeptiert
          </Badge>
        )
      case 'expired':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Abgelaufen
          </Badge>
        )
      case 'revoked':
        return (
          <Badge variant="destructive" className="gap-1">
            <Ban className="h-3 w-3" />
            Widerrufen
          </Badge>
        )
      case 'pending':
        if (expiresAt < now) {
          return (
            <Badge variant="secondary" className="gap-1">
              <Clock className="h-3 w-3" />
              Abgelaufen
            </Badge>
          )
        }
        return (
          <Badge variant="warning" className="gap-1">
            <Clock className="h-3 w-3" />
            Ausstehend
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <PageHeader
        title="Einladungen"
        description="Benutzer zur Plattform einladen"
      />

      {/* Create Invitation Form */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Neue Einladung erstellen</h2>

        <form onSubmit={handleCreateInvitation} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-Mail-Adresse</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="benutzer@example.com"
              required
              disabled={loading}
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? 'Erstelle...' : 'Einladung erstellen'}
          </Button>
        </form>

        {error && (
          <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
            {error}
          </div>
        )}

        {generatedUrl && (
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 space-y-3">
            <p className="text-sm font-medium text-success-foreground">
              Einladung erfolgreich erstellt!
            </p>

            <div className="space-y-2">
              <Label htmlFor="invite-url">Einladungs-URL</Label>
              <div className="flex gap-2">
                <Input
                  id="invite-url"
                  type="text"
                  value={generatedUrl}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleCopyUrl}
                  className="flex-shrink-0"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-success" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Teilen Sie diese URL mit dem eingeladenen Benutzer. Die Einladung ist 7 Tage gültig.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Invitations List */}
      <div className="bg-card border rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Alle Einladungen</h2>

        {invitationsLoading ? (
          <p className="text-muted-foreground">Lade Einladungen...</p>
        ) : invitations.length === 0 ? (
          <p className="text-muted-foreground">Noch keine Einladungen erstellt.</p>
        ) : (
          <div className="space-y-2">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{invitation.email}</p>
                    {getStatusBadge(invitation)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-0.5">
                    <p>
                      Erstellt: {format(new Date(invitation.invited_at), 'dd. MMM yyyy, HH:mm', { locale: de })}
                    </p>
                    <p>
                      Läuft ab: {format(new Date(invitation.expires_at), 'dd. MMM yyyy, HH:mm', { locale: de })}
                    </p>
                    {invitation.accepted_at && (
                      <p>
                        Akzeptiert: {format(new Date(invitation.accepted_at), 'dd. MMM yyyy, HH:mm', { locale: de })}
                      </p>
                    )}
                  </div>
                </div>

                {invitation.status === 'pending' && new Date(invitation.expires_at) > new Date() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRevoke(invitation.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Widerrufen
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
