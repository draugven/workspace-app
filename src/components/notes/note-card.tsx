'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TiptapEditorWrapper } from './tiptap-editor-wrapper'
import type { Note, Department, User } from "@/types"
import { Edit, Lock, History, Save, Users, AlertTriangle } from 'lucide-react'

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
  onSave: (noteId: string, content: string, title?: string) => void
  onLock?: (noteId: string, lock: boolean) => void
  departments?: Department[]
  isBeingEditedByOthers?: boolean
}

export function NoteCard({
  note,
  currentUser,
  onSave,
  onLock,
  departments = [],
  isBeingEditedByOthers = false
}: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(note.content || '')
  const [editTitle, setEditTitle] = useState(note.title)

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
    await onSave(note.id, editContent, editTitle)
    if (onLock) {
      await onLock(note.id, false) // Unlock after saving
    }
    setIsEditing(false)
  }

  const handleCancel = async () => {
    setEditContent(note.content || '')
    setEditTitle(note.title)
    if (onLock && lockedByCurrentUser) {
      await onLock(note.id, false) // Unlock on cancel
    }
    setIsEditing(false)
  }

  const getLockedByName = () => {
    // In a real app, you'd fetch this from the users table
    return 'Ein anderer Benutzer'
  }

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
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
            <CardDescription className="flex items-center gap-2 mt-1">
              <span>Erstellt: {new Date(note.created_at).toLocaleDateString('de-DE')}</span>
              {note.updated_at !== note.created_at && (
                <span>• Geändert: {new Date(note.updated_at).toLocaleDateString('de-DE')}</span>
              )}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
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
                Bearbeiten
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

            {note.versions && note.versions.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <History className="h-4 w-4" />
                v{note.versions.length}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <TiptapEditorWrapper
              content={editContent}
              onChange={setEditContent}
              onSave={handleSave}
              isLocked={isLocked}
              lockedBy={isLocked ? getLockedByName() : undefined}
              placeholder="Schreibe deine Notizen für die Produktion..."
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Speichern
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Abbrechen
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
                Keine Inhalte vorhanden. Klicke auf "Bearbeiten" um Notizen hinzuzufügen.
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}