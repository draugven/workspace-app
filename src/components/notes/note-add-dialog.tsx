'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { TiptapEditorWrapper } from './tiptap-editor-wrapper'
import { Plus, X } from 'lucide-react'
import type { Note, Department } from '@/types'

interface NoteAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (newNote: Partial<Note>) => void
  departments: Department[]
  defaultDepartmentId?: string
}

interface NewNoteData {
  title: string
  content: string
  department_id: string | 'none'
  is_private: boolean
}

export function NoteAddDialog({
  open,
  onOpenChange,
  onSave,
  departments,
  defaultDepartmentId
}: NoteAddDialogProps) {
  const [newNote, setNewNote] = useState<NewNoteData>({
    title: '',
    content: '',
    department_id: defaultDepartmentId || 'none',
    is_private: false
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setNewNote({
        title: '',
        content: '',
        department_id: defaultDepartmentId || 'none',
        is_private: false
      })
    }
  }, [open, defaultDepartmentId])

  const handleSave = () => {
    if (!newNote.title.trim()) {
      return // Don't save without title
    }

    // Convert to the format expected by parent component
    const noteToSave: Partial<Note> = {
      title: newNote.title.trim(),
      content: newNote.content.trim(),
      department_id: newNote.department_id === 'none' ? undefined : newNote.department_id,
      is_private: newNote.is_private
    }

    onSave(noteToSave)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const isFormValid = newNote.title.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Neue Notiz erstellen</DialogTitle>
          <DialogDescription>
            Erstelle eine neue kollaborative Notiz für dein Team
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              placeholder="Notiztitel..."
              className={!isFormValid && newNote.title.length === 0 ? 'border-red-500' : ''}
            />
            {!isFormValid && newNote.title.length === 0 && (
              <p className="text-sm text-red-600">Titel ist erforderlich</p>
            )}
          </div>

          {/* Department */}
          <div className="grid gap-2">
            <Label htmlFor="department">Abteilung</Label>
            <Select
              value={newNote.department_id}
              onValueChange={(value) => setNewNote({ ...newNote, department_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Abteilung wählen..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Keine Abteilung</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Initial Content */}
          <div className="grid gap-2">
            <Label htmlFor="content">Inhalt (optional)</Label>
            <TiptapEditorWrapper
              content={newNote.content}
              onChange={(content) => setNewNote({ ...newNote, content })}
              placeholder="Beginne mit dem Schreiben deiner Notiz..."
              onSave={() => {}}
              isLocked={false}
            />
            <p className="text-xs text-muted-foreground">
              Verwende die Toolbar für Rich-Text-Formatierung
            </p>
          </div>

          {/* Privacy Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="is_private"
              checked={newNote.is_private}
              onCheckedChange={(checked) =>
                setNewNote(prev => ({ ...prev, is_private: checked }))
              }
            />
            <Label htmlFor="is_private" className="text-sm">
              Privat (nur für mich sichtbar)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Abbrechen</span>
          </Button>
          <Button onClick={handleSave} disabled={!isFormValid}>
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notiz erstellen</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}