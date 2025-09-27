'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TaskDescriptionEditorWrapper } from './task-description-editor-wrapper'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'
import { MultiCombobox } from '@/components/ui/multi-combobox'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Calendar, Save, X, Tag, Trash2 } from 'lucide-react'
import { useAdminCheck } from '@/hooks/use-admin-check'
import type { Task, Department, TaskTag, User } from '@/types'

interface TaskEditDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedTask: Task) => void
  onDelete?: (taskId: string) => void
  departments: Department[]
  tags: TaskTag[]
  users?: User[]
  currentUser?: User | null
}

export function TaskEditDialog({
  task,
  open,
  onOpenChange,
  onSave,
  onDelete,
  departments,
  tags,
  users = [],
  currentUser
}: TaskEditDialogProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { isAdmin } = useAdminCheck()

  // Initialize edited task when dialog opens
  if (task && !editedTask && open) {
    setEditedTask(task)
    setSelectedTagIds(task.tags?.map(tag => tag.id) || [])
  }

  // Reset when dialog closes
  if (!open && editedTask) {
    setEditedTask(null)
    setSelectedTagIds([])
  }

  if (!editedTask) return null

  const handleSave = () => {
    // Update task with selected tags
    const selectedTags = tags.filter(tag => selectedTagIds.includes(tag.id))
    // Check if description has meaningful content (not just empty HTML)
    const descriptionText = editedTask.description?.replace(/<[^>]*>/g, '').trim()
    const taskWithTags = {
      ...editedTask,
      description: descriptionText ? editedTask.description : undefined,
      tags: selectedTags
    }
    onSave(taskWithTags)
    onOpenChange(false)
    setEditedTask(null)
  }

  const handleCancel = () => {
    onOpenChange(false)
    setEditedTask(null)
    setSelectedTagIds([])
    setShowDeleteConfirm(false)
  }

  const handleDelete = async () => {
    if (onDelete && editedTask && showDeleteConfirm) {
      await onDelete(editedTask.id)
      onOpenChange(false)
      setEditedTask(null)
      setSelectedTagIds([])
      setShowDeleteConfirm(false)
    }
  }


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Aufgabe bearbeiten</DialogTitle>
          <DialogDescription>
            Ändere die Details dieser Aufgabe
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Titel</Label>
            <Input
              id="title"
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              placeholder="Aufgabentitel..."
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Beschreibung</Label>
            <TaskDescriptionEditorWrapper
              content={editedTask.description || ''}
              onChange={(content) => setEditedTask({ ...editedTask, description: content })}
              placeholder="Beschreibung der Aufgabe..."
            />
          </div>

          {/* Status and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editedTask.status}
                onValueChange={(value: Task['status']) => setEditedTask({ ...editedTask, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Zu erledigen</SelectItem>
                  <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                  <SelectItem value="done">Erledigt</SelectItem>
                  <SelectItem value="blocked">Blockiert</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority">Priorität</Label>
              <Select
                value={editedTask.priority}
                onValueChange={(value: Task['priority']) => setEditedTask({ ...editedTask, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Dringend</SelectItem>
                  <SelectItem value="high">Hoch</SelectItem>
                  <SelectItem value="medium">Mittel</SelectItem>
                  <SelectItem value="low">Niedrig</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Department and Due Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="department">Abteilung</Label>
              <Combobox
                options={[
                  { value: "none", label: "Keine Abteilung" },
                  ...departments.map(dept => ({ value: dept.id, label: dept.name }))
                ]}
                value={editedTask.department_id || 'none'}
                onValueChange={(value) => {
                  const department = departments.find(d => d.id === value)
                  setEditedTask({
                    ...editedTask,
                    department_id: value === 'none' ? undefined : value,
                    department: value === 'none' ? undefined : department || undefined
                  })
                }}
                placeholder="Abteilung wählen..."
                searchPlaceholder="Abteilung suchen..."
                emptyText="Keine Abteilung gefunden."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="due_date">Fälligkeitsdatum</Label>
              <Input
                id="due_date"
                type="date"
                value={editedTask.due_date || ''}
                onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value || undefined })}
              />
            </div>
          </div>

          {/* Assignee Row */}
          <div className="grid gap-2">
            <Label htmlFor="assigned_to">Zugewiesen an</Label>
            <Combobox
              options={[
                { value: "none", label: "Niemandem zugewiesen" },
                ...users.map(user => ({ value: user.id, label: `${user.full_name} (${user.email})` }))
              ]}
              value={editedTask.assigned_to || 'none'}
              onValueChange={(value) => setEditedTask({ ...editedTask, assigned_to: value === 'none' ? undefined : value })}
              placeholder="Person zuweisen..."
              searchPlaceholder="Person suchen..."
              emptyText="Keine Person gefunden."
            />
          </div>

          {/* Tags Selection */}
          <div className="grid gap-2">
            <Label>Tags</Label>
            <MultiCombobox
              options={tags.map(tag => ({
                value: tag.id,
                label: tag.name,
                color: tag.color
              }))}
              values={selectedTagIds}
              onValuesChange={setSelectedTagIds}
              placeholder="Tags auswählen..."
              searchPlaceholder="Tags suchen..."
              emptyText="Keine Tags gefunden."
            />
          </div>

          {/* Privacy Toggle - only show to creator */}
          {currentUser && editedTask.created_by === currentUser.id && (
            <div className="flex items-center space-x-2">
              <Switch
                id="is_private"
                checked={editedTask.is_private || false}
                onCheckedChange={(checked) =>
                  setEditedTask(prev => ({ ...prev!, is_private: checked }))
                }
              />
              <Label htmlFor="is_private" className="text-sm">
                Privat (nur für mich sichtbar)
              </Label>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          {/* Admin delete button */}
          {isAdmin && (
            <div className="flex gap-2">
              {showDeleteConfirm ? (
                <>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                    className="gap-2"
                  >
                    Bestätigen
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Abbrechen
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  <Trash2 className="h-4 w-4" />
                  Löschen
                </Button>
              )}
            </div>
          )}
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Abbrechen
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Speichern
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}