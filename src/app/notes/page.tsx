'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Navigation } from '@/components/layout/navigation'
import { NoteCard } from '@/components/notes/note-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useRealtimeNotes } from '@/hooks/use-realtime-notes'
import { supabase } from '@/lib/supabase'
import { Plus, Search, Users } from 'lucide-react'
import type { Note, Department, User } from '@/types'

// Mock data for now
const mockDepartments: Department[] = [
  { id: '1', name: 'Kostüme', description: 'Costume design and wardrobe', color: '#ec4899', created_at: '2024-01-01' },
  { id: '2', name: 'Requisiten', description: 'Props management', color: '#8b5cf6', created_at: '2024-01-01' },
  { id: '3', name: 'Technik', description: 'Technical production', color: '#10b981', created_at: '2024-01-01' },
  { id: '4', name: 'Administrative', description: 'Production admin', color: '#6b7280', created_at: '2024-01-01' }
]

const mockCurrentUser: User = {
  id: '1',
  email: 'liza@theater.com',
  full_name: 'Liza',
  created_at: '2024-01-01'
}

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Kostüm Anprobe Termine',
    content: `# Anprobe Termine - Dracula

## Neu besetzte Rollen
- **Toska**: Vampire Kostüm, Tarnung
- **Johanna**: Vampire Kostüm, blaues Kleid (Tarnung)

## Termine
- **15.12.2024**: Erste Anprobe neue Besetzung
- **18.12.2024**: Alle Kostüme final Check

## Notizen
- Schuhe und Safety Shorts selbst besorgen
- Anna Kleid Reißverschluss reparieren vor Rückgabe`,
    content_html: '<h1>Anprobe Termine - Dracula</h1><h2>Neu besetzte Rollen</h2><ul><li><strong>Toska</strong>: Vampire Kostüm, Tarnung</li><li><strong>Johanna</strong>: Vampire Kostüm, blaues Kleid (Tarnung)</li></ul><h2>Termine</h2><ul><li><strong>15.12.2024</strong>: Erste Anprobe neue Besetzung</li><li><strong>18.12.2024</strong>: Alle Kostüme final Check</li></ul><h2>Notizen</h2><ul><li>Schuhe und Safety Shorts selbst besorgen</li><li>Anna Kleid Reißverschluss reparieren vor Rückgabe</li></ul>',
    is_locked: false,
    department_id: '1',
    created_by: '1',
    created_at: '2024-12-01T10:00:00Z',
    updated_at: '2024-12-01T15:30:00Z',
    department: mockDepartments[0]
  },
  {
    id: '2',
    title: 'Technik Setup Checkliste',
    content: `# Video Wall Setup

## Beide Walls programmieren
- Wall 1: Haupt-Projektionen
- Wall 2: Atmosphere und Effekte

## Fledermäuse Sequenz
Anstatt double bei "Zu Ende":
- Schwarm attackiert nach vorne
- Sammelt sich in D Form ("Ich bin noch lange nicht tot")

## Batterien Liste
- LED Kerzen: 16-25 Stück
- Backup Batterien bestellen`,
    content_html: '<h1>Video Wall Setup</h1><h2>Beide Walls programmieren</h2><ul><li>Wall 1: Haupt-Projektionen</li><li>Wall 2: Atmosphere und Effekte</li></ul><h2>Fledermäuse Sequenz</h2><p>Anstatt double bei "Zu Ende":</p><ul><li>Schwarm attackiert nach vorne</li><li>Sammelt sich in D Form ("Ich bin noch lange nicht tot")</li></ul><h2>Batterien Liste</h2><ul><li>LED Kerzen: 16-25 Stück</li><li>Backup Batterien bestellen</li></ul>',
    is_locked: true,
    locked_by: '3',
    locked_at: '2024-12-01T16:00:00Z',
    department_id: '3',
    created_by: '3',
    created_at: '2024-11-28T14:00:00Z',
    updated_at: '2024-12-01T16:00:00Z',
    department: mockDepartments[2]
  },
  {
    id: '3',
    title: 'Requisiten Transport Planung',
    content: `# Transport zur Location

## Schwere Items
- Sarg (Mechanismus beachten!)
- Himmelbett (zerlegt transportieren)
- Servierwagen (Griff reparieren)

## Fragile Items
- Alle Gläser und Flaschen separat verpacken
- Perücken in Boxen
- Kunstblut sicher verschließen

## Checkliste vor Ort
- [ ] Werkzeugkasten mitbringen
- [ ] Gaffer Tape (bessere Qualität)
- [ ] Power Tools für Aufbau`,
    content_html: '<h1>Transport zur Location</h1><h2>Schwere Items</h2><ul><li>Sarg (Mechanismus beachten!)</li><li>Himmelbett (zerlegt transportieren)</li><li>Servierwagen (Griff reparieren)</li></ul><h2>Fragile Items</h2><ul><li>Alle Gläser und Flaschen separat verpacken</li><li>Perücken in Boxen</li><li>Kunstblut sicher verschließen</li></ul><h2>Checkliste vor Ort</h2><ul><li>[ ] Werkzeugkasten mitbringen</li><li>[ ] Gaffer Tape (bessere Qualität)</li><li>[ ] Power Tools für Aufbau</li></ul>',
    is_locked: false,
    department_id: '2',
    created_by: '1',
    created_at: '2024-11-30T09:00:00Z',
    updated_at: '2024-11-30T09:00:00Z',
    department: mockDepartments[1]
  },
  {
    id: '4',
    title: 'Aufführung 14.-15. Januar 2026',
    content: `# Neue Termine!

## Wichtige Änderungen
**Neue Aufführungstermine: 14.-15. Januar 2026**

## Auswirkungen checken
- [ ] Besetzung noch verfügbar?
- [ ] Location verfügbar?
- [ ] Alle Kostüme bis dahin fertig?

## Kommunikation
- Alle Beteiligten informieren
- Neue Deadlines definieren
- Probe-Termine anpassen`,
    content_html: '<h1>Neue Termine!</h1><h2>Wichtige Änderungen</h2><p><strong>Neue Aufführungstermine: 14.-15. Januar 2026</strong></p><h2>Auswirkungen checken</h2><ul><li>[ ] Besetzung noch verfügbar?</li><li>[ ] Location verfügbar?</li><li>[ ] Alle Kostüme bis dahin fertig?</li></ul><h2>Kommunikation</h2><ul><li>Alle Beteiligten informieren</li><li>Neue Deadlines definieren</li><li>Probe-Termine anpassen</li></ul>',
    is_locked: false,
    department_id: '4',
    created_by: '1',
    created_at: '2024-12-01T08:00:00Z',
    updated_at: '2024-12-01T08:00:00Z',
    department: mockDepartments[3]
  }
]

export default function NotesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null)
  const [departments, setDepartments] = useState<Department[]>(mockDepartments)
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  const {
    notes,
    loading,
    error,
    activeEditors,
    saveNote,
    createNote,
    startEditing,
    stopEditing,
    getActiveEditors
  } = useRealtimeNotes()

  // Load user and departments data
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setCurrentUser({
          id: user.id,
          email: user.email || '',
          full_name: user.user_metadata?.full_name || user.email || '',
          created_at: user.created_at || ''
        })
      }

      // Load departments from database
      const { data: deptData } = await supabase
        .from('departments')
        .select('*')
        .order('name')

      if (deptData) {
        setDepartments(deptData)
      }
    }

    loadUserData()
  }, [])

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !filterDepartment || note.department_id === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const handleSaveNote = async (noteId: string, content: string, title?: string) => {
    try {
      await saveNote(noteId, content, title)
      await stopEditing(noteId)
    } catch (error) {
      console.error('Failed to save note:', error)
    }
  }

  const handleLockNote = async (noteId: string, lock: boolean) => {
    try {
      if (lock) {
        await startEditing(noteId)
      } else {
        await stopEditing(noteId)
      }
    } catch (error) {
      console.error('Failed to lock/unlock note:', error)
    }
  }

  const handleCreateNote = async () => {
    try {
      await createNote({
        title: 'Neue Notiz',
        content: '',
        department_id: filterDepartment || undefined
      })
    } catch (error) {
      console.error('Failed to create note:', error)
    }
  }

  const statsData = {
    total: notes.length,
    locked: notes.filter(n => n.is_locked).length,
    activeEditors: activeEditors.length,
    byDepartment: departments.map(dept => ({
      ...dept,
      count: notes.filter(n => n.department_id === dept.id).length
    }))
  }

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Notizen</h1>
            <p className="text-muted-foreground">
              Kollaborative Notizen für die Produktion
            </p>
          </div>
          <Button className="gap-2" onClick={handleCreateNote} disabled={loading}>
            <Plus className="h-4 w-4" />
            Neue Notiz
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Gesamt Notizen</CardDescription>
              <CardTitle className="text-2xl">{statsData.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Gesperrt</CardDescription>
              <CardTitle className="text-2xl text-yellow-600">
                {statsData.locked}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Bearbeitbar</CardDescription>
              <CardTitle className="text-2xl text-green-600">
                {statsData.total - statsData.locked}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                Aktive Bearbeiter
              </CardDescription>
              <CardTitle className="text-2xl text-blue-600">
                {statsData.activeEditors}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter & Suche</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Notizen durchsuchen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterDepartment === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterDepartment(null)}
              >
                Alle ({statsData.total})
              </Button>
              {statsData.byDepartment.map((dept) => (
                <Button
                  key={dept.id}
                  variant={filterDepartment === dept.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterDepartment(dept.id)}
                  style={{
                    backgroundColor: filterDepartment === dept.id ? dept.color : undefined,
                    borderColor: dept.color
                  }}
                >
                  {dept.name} ({dept.count})
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loading and Error States */}
        {loading && (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="text-muted-foreground">Notizen werden geladen...</div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-6 text-center">
              <div className="text-red-800">{error}</div>
              <Button
                variant="outline"
                className="mt-2"
                onClick={() => window.location.reload()}
              >
                Neu laden
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Notes Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredNotes.map((note) => {
              const editors = getActiveEditors(note.id)
              const isBeingEdited = editors.length > 0 &&
                editors.some(e => e.userId !== currentUser?.id)

              return (
                <NoteCard
                  key={note.id}
                  note={{
                    ...note,
                    // Add real-time editing indicators
                    activeEditors: editors
                  }}
                  currentUser={currentUser}
                  onSave={handleSaveNote}
                  onLock={handleLockNote}
                  departments={departments}
                  isBeingEditedByOthers={isBeingEdited}
                />
              )
            })}
          </div>
        )}

        {!loading && !error && filteredNotes.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="text-muted-foreground">
                {searchTerm || filterDepartment
                  ? 'Keine Notizen gefunden, die den Filterkriterien entsprechen.'
                  : 'Noch keine Notizen vorhanden. Erstelle deine erste Notiz!'
                }
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  )
}