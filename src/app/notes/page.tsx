'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { NoteCard } from '@/components/notes/note-card'
import { NoteAddDialog } from '@/components/notes/note-add-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'
import { StatsBar } from '@/components/ui/stats-bar'
import { useRealtimeNotesV2 } from '@/hooks/use-realtime-notes-v2'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { supabase } from '@/lib/supabase'
import { Plus, Search, Users, ChevronDown, ChevronUp, X, Filter } from 'lucide-react'
import type { Note, Department, User } from '@/types'

export default function NotesPage() {
  // Persisted filter states
  const [searchTerm, setSearchTerm] = usePersistedState('back2stage-notes-search', '')
  const [filterDepartment, setFilterDepartment] = usePersistedState<string | null>('back2stage-notes-department', null)

  // Non-persisted UI state
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const {
    notes,
    loading,
    error,
    refresh,
    createNote,
    saveNote,
    deleteNote,
    toggleNoteLock,
    canEdit,
    isLocking,
    restoreVersion
  } = useRealtimeNotesV2({ enableLogs: false })

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

  // Check if any filters are active (search is now separate)
  const hasActiveFilters = filterDepartment

  // Auto-expand filters when filters become active
  useEffect(() => {
    if (hasActiveFilters && !filtersExpanded) {
      setFiltersExpanded(true)
    }
  }, [hasActiveFilters, filtersExpanded])

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = !filterDepartment || note.department_id === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const handleSaveNote = async (noteId: string, content: string, title?: string, departmentId?: string | null, isPrivate?: boolean) => {
    try {
      await saveNote(noteId, content, title, departmentId, isPrivate)
      await toggleNoteLock(noteId, false) // Unlock after saving
    } catch (error) {
      console.error('Failed to save note:', error)
    }
  }

  const handleLockNote = async (noteId: string, lock: boolean) => {
    try {
      await toggleNoteLock(noteId, lock)
    } catch (error) {
      console.error('Failed to lock/unlock note:', error)
    }
  }

  const handleCreateNote = async (noteData: Partial<Note>) => {
    try {
      await createNote(noteData)
    } catch (error) {
      console.error('Failed to create note:', error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      await deleteNote(noteId)
    } catch (error) {
      console.error('Failed to delete note:', error)
      alert('Fehler beim Löschen der Notiz')
    }
  }

  const handleOpenAddDialog = () => {
    setShowAddDialog(true)
  }

  const handleRestoreVersion = async (noteId: string, versionId: string) => {
    try {
      await restoreVersion(noteId, versionId)
    } catch (error) {
      console.error('Failed to restore version:', error)
      alert('Fehler beim Wiederherstellen der Version')
    }
  }

  const statsData = {
    total: notes.length,
    locked: notes.filter(n => n.is_locked).length,
    byDepartment: departments.map(dept => ({
      ...dept,
      count: notes.filter(n => n.department_id === dept.id).length
    }))
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-4 space-y-4">
        <PageHeader
          title="Notizen"
          description="Kollaborative Notizen für die Produktion"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Notizen durchsuchen..."
          actions={
            <>
              {!filtersExpanded && (
                <Button
                  variant="outline"
                  onClick={() => setFiltersExpanded(true)}
                  className="gap-2"
                  title="Filter"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1">
                      {[filterDepartment && 'Abteilung'].filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
              )}
              <Button className="gap-2" onClick={handleOpenAddDialog} disabled={loading} title="Neue Notiz">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Neue Notiz</span>
              </Button>
            </>
          }
        />

        <StatsBar
          stats={[
            { label: 'Gesamt Notizen:', value: statsData.total },
            { label: 'Gesperrt:', value: statsData.locked, className: 'text-yellow-600' },
            { label: 'Bearbeitbar:', value: statsData.total - statsData.locked, className: 'text-green-600' },
          ]}
        />

        {/* Filters - only show when expanded */}
        {filtersExpanded && (
          <Card>
            <CardHeader>
              <CardTitle
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
              >
                <div className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5" />
                  Filter
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {[filterDepartment && 'Abteilung'].filter(Boolean).length} aktiv
                    </Badge>
                  )}
                  <div className="flex flex-wrap gap-2 ml-4">
                    <Button
                      variant={filterDepartment === null ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setFilterDepartment(null)
                      }}
                    >
                      Alle ({statsData.total})
                    </Button>
                    {statsData.byDepartment.map((dept) => (
                      <Button
                        key={dept.id}
                        variant={filterDepartment === dept.id ? "default" : "outline"}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setFilterDepartment(dept.id)
                        }}
                        style={{
                          backgroundColor: filterDepartment === dept.id ? dept.color : undefined,
                          borderColor: dept.color
                        }}
                      >
                        {dept.name} ({dept.count})
                      </Button>
                    ))}
                  </div>
                </div>
                <ChevronUp className="h-5 w-5" />
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        {/* Active Filters Summary (shown when collapsed) */}
        {!filtersExpanded && hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 py-1">
            <span className="text-sm text-muted-foreground">Aktive Filter:</span>
            {filterDepartment && (
              <Badge variant="secondary" className="gap-1">
                {departments.find(d => d.id === filterDepartment)?.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setFilterDepartment(null)}
                />
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterDepartment(null)
              }}
              className="text-muted-foreground hover:text-foreground"
            >
              Alle löschen
            </Button>
          </div>
        )}

        {/* Loading and Error States */}
        {loading && (
          <Card>
            <CardContent className="py-6 text-center">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                currentUser={currentUser}
                onSave={handleSaveNote}
                onDelete={handleDeleteNote}
                onLock={handleLockNote}
                onRestoreVersion={handleRestoreVersion}
                departments={departments}
                isBeingEditedByOthers={false} // Simplified for now
              />
            ))}
          </div>
        )}

        {!loading && !error && filteredNotes.length === 0 && (
          <Card>
            <CardContent className="py-6 text-center">
              <div className="text-muted-foreground">
                {searchTerm || filterDepartment
                  ? 'Keine Notizen gefunden, die den Filterkriterien entsprechen.'
                  : 'Noch keine Notizen vorhanden. Erstelle deine erste Notiz!'
                }
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Note Dialog */}
        <NoteAddDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSave={handleCreateNote}
          departments={departments}
          defaultDepartmentId={filterDepartment || undefined}
        />
      </div>
    </ProtectedRoute>
  )
}