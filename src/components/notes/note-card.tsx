'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Combobox } from "@/components/ui/combobox"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { TiptapEditorWrapper } from './tiptap-editor-wrapper'
import { VersionHistoryDialog } from './version-history-dialog'
import { VersionViewerDialog } from './version-viewer-dialog'
import type { Note, Department, User, NoteVersion } from "@/types"
import { Edit, Lock, History, Save, Users, AlertTriangle, Eye, EyeOff, Trash2, X } from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'

interface NoteCardProps {
  note: Note & {
    activeEditors?: Array<{
      noteId: string
      userId: string
      userEmail: string
      timestamp: number
    }>
  }
  currentUser?: User | null
  onSave: (noteId: string, content: string, title?: string, departmentId?: string | null, isPrivate?: boolean) => void
  onDelete?: (noteId: string) => void
  onLock?: (noteId: string, lock: boolean) => void
  onRestoreVersion?: (noteId: string, versionId: string) => void
  departments?: Department[]
  isBeingEditedByOthers?: boolean
}

export function NoteCard({
  note,
  currentUser,
  onSave,
  onDelete,
  onLock,
  onRestoreVersion,
  departments = [],
  isBeingEditedByOthers = false
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(note.content || '')
  const [editTitle, setEditTitle] = useState(note.title)
  const [editDepartmentId, setEditDepartmentId] = useState<string | null>(note.department_id || null)
  const [editIsPrivate, setEditIsPrivate] = useState(note.is_private || false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showVersionHistory, setShowVersionHistory] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<NoteVersion | null>(null)
  const [showVersionViewer, setShowVersionViewer] = useState(false)
  const { isAdmin } = useAuth()

  const isLocked = note.is_locked && note.locked_by !== currentUser?.id
  const lockedByCurrentUser = note.is_locked && note.locked_by === currentUser?.id
  const department = departments.find(d => d.id === note.department_id)

  const handleEdit = async () => {
    if (!isEditing) {
      // Start editing - lock the note
      if (onLock) {
        await onLock(note.id, true)
      }
      setIsEditing(true)
    }
  }

  const handleSave = async () => {
    await onSave(note.id, editContent, editTitle, editDepartmentId, editIsPrivate)
    if (onLock) {
      await onLock(note.id, false) // Unlock after saving
    }
    setIsEditing(false)
  }

  const handleCancel = async () => {
    setEditContent(note.content || '')
    setEditTitle(note.title)
    setEditDepartmentId(note.department_id || null)
    setEditIsPrivate(note.is_private || false)
    if (onLock && lockedByCurrentUser) {
      await onLock(note.id, false) // Unlock on cancel
    }
    setIsEditing(false)
  }

  const getLockedByName = () => {
    // In a real app, you'd fetch this from the users table
    return 'Ein anderer Benutzer'
  }

  const handleDelete = async () => {
    if (onDelete && showDeleteConfirm) {
      await onDelete(note.id)
    }
  }

  const handleViewVersion = (version: NoteVersion) => {
    setSelectedVersion(version)
    setShowVersionHistory(false)
    setShowVersionViewer(true)
  }

  const handleRestoreVersion = async (versionId: string) => {
    if (onRestoreVersion) {
      await onRestoreVersion(note.id, versionId)
      setShowVersionViewer(false)
      setShowVersionHistory(false)
    }
  }

  const handleBackToHistory = () => {
    setShowVersionViewer(false)
    setShowVersionHistory(true)
    setSelectedVersion(null)
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="sm:flex sm:items-start sm:justify-between sm:gap-2 space-y-2 sm:space-y-0">
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-lg font-semibold bg-transparent border-none outline-none w-full"
                placeholder="Notiz Titel..."
              />
            ) : (
              <CardTitle className="text-lg">{note.title}</CardTitle>
            )}
            <CardDescription className="flex items-center gap-2 mt-1 hidden sm:flex">
              <span>Erstellt: {new Date(note.created_at).toLocaleDateString('de-DE')}</span>
              {note.updated_at !== note.created_at && (
                <span>• Geändert: {new Date(note.updated_at).toLocaleDateString('de-DE')}</span>
              )}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {note.is_private && (
              <Badge variant="secondary" className="gap-1">
                <EyeOff className="h-3 w-3" />
                <span className="hidden sm:inline">Privat</span>
              </Badge>
            )}

            {department && (
              <Badge
                variant="outline"
                style={{
                  backgroundColor: department.color + '20',
                  borderColor: department.color
                }}
              >
                {department.name}
              </Badge>
            )}

            {isLocked && (
              <Badge variant="destructive" className="gap-1">
                <Lock className="h-3 w-3" />
                Gesperrt
              </Badge>
            )}

            {isBeingEditedByOthers && !isLocked && (
              <Badge variant="outline" className="gap-1 bg-yellow-50 text-yellow-700 border-yellow-300">
                <Users className="h-3 w-3" />
                In Bearbeitung
              </Badge>
            )}

            {note.activeEditors && note.activeEditors.length > 0 && !isLocked && (
              <div className="flex items-center gap-1 text-xs text-blue-600">
                <Users className="h-3 w-3" />
                {note.activeEditors.length}
              </div>
            )}

            {!isEditing && !isLocked && !isBeingEditedByOthers && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                <span className="hidden sm:inline">Bearbeiten</span>
              </Button>
            )}

            {!isEditing && !isLocked && isBeingEditedByOthers && (
              <Button
                variant="outline"
                size="sm"
                disabled
                className="gap-2 opacity-50"
                title="Wird gerade von einem anderen Benutzer bearbeitet"
              >
                <AlertTriangle className="h-4 w-4" />
                In Bearbeitung
              </Button>
            )}

            {note.versions && note.versions.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowVersionHistory(true)}
                className="gap-2"
                title="Versionshistorie anzeigen"
              >
                <History className="h-4 w-4" />
                <span className="hidden sm:inline">v{note.versions.length}</span>
              </Button>
            )}

            {/* Admin delete button */}
            {isAdmin && !isEditing && (
              showDeleteConfirm ? (
                <div className="flex gap-1">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDelete}
                    className="gap-1 text-xs"
                  >
                    Bestätigen
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="gap-1 text-xs"
                  >
                    Abbrechen
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  title="Als Admin löschen"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Löschen</span>
                </Button>
              )
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="space-y-3 sm:space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="department" className="text-sm">Abteilung</Label>
              <Combobox
                options={[
                  { value: "none", label: "Keine Abteilung" },
                  ...departments.map(dept => ({ value: dept.id, label: dept.name }))
                ]}
                value={editDepartmentId || 'none'}
                onValueChange={(value) => {
                  setEditDepartmentId(value === 'none' ? null : value)
                }}
                placeholder="Abteilung wählen..."
                searchPlaceholder="Abteilung suchen..."
              />
            </div>

            {/* Privacy Toggle - only show to creator */}
            {currentUser && note.created_by === currentUser.id && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_private"
                  checked={editIsPrivate}
                  onCheckedChange={setEditIsPrivate}
                />
                <Label htmlFor="is_private" className="text-xs sm:text-sm">
                  Privat (nur für mich sichtbar)
                </Label>
              </div>
            )}

            <TiptapEditorWrapper
              content={editContent}
              onChange={setEditContent}
              onSave={handleSave}
              isLocked={isLocked}
              lockedBy={isLocked ? getLockedByName() : undefined}
              placeholder="Schreibe deine Notizen für die Produktion..."
            />
            <div className="flex gap-2 pt-2">
              <Button onClick={handleSave} className="gap-2 flex-1 sm:flex-none">
                <Save className="h-4 w-4" />
                <span className="hidden sm:inline">Speichern</span>
              </Button>
              <Button variant="outline" onClick={handleCancel} className="flex-1 sm:flex-none">
                <X className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Abbrechen</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {note.content_html ? (
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: note.content_html }}
              />
            ) : (
              <div className="text-muted-foreground italic">
                Keine Inhalte vorhanden. Klicke auf &quot;Bearbeiten&quot; um Notizen hinzuzufügen.
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Version History Dialog */}
      <VersionHistoryDialog
        open={showVersionHistory}
        onOpenChange={setShowVersionHistory}
        note={note}
        onViewVersion={handleViewVersion}
        onRestoreVersion={handleRestoreVersion}
      />

      {/* Version Viewer Dialog */}
      <VersionViewerDialog
        open={showVersionViewer}
        onOpenChange={setShowVersionViewer}
        version={selectedVersion}
        onBack={handleBackToHistory}
        onRestore={handleRestoreVersion}
        isCurrentVersion={selectedVersion?.version_number === note.versions?.[0]?.version_number}
      />
    </Card>
  )
}