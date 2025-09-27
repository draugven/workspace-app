'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Calendar, Save, X, Tag } from 'lucide-react'
import type { Task, Department, TaskTag, User } from '@/types'

interface TaskEditDialogProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedTask: Task) => void
  departments: Department[]
  tags: TaskTag[]
  users?: User[]
}

export function TaskEditDialog({
  task,
  open,
  onOpenChange,
  onSave,
  departments,
  tags,
  users = []
}: TaskEditDialogProps) {
  const [editedTask, setEditedTask] = useState<Task | null>(null)
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([])

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
    const taskWithTags = {
      ...editedTask,
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
  }

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId)
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
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
            <Textarea
              id="description"
              value={editedTask.description || ''}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              placeholder="Beschreibung der Aufgabe..."
              rows={3}
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
                    department_id: value === 'none' ? null : value,
                    department: value === 'none' ? null : department || null
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
                onChange={(e) => setEditedTask({ ...editedTask, due_date: e.target.value || null })}
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
              onValueChange={(value) => setEditedTask({ ...editedTask, assigned_to: value === 'none' ? null : value })}
              placeholder="Person zuweisen..."
              searchPlaceholder="Person suchen..."
              emptyText="Keine Person gefunden."
            />
          </div>

          {/* Tags Selection */}
          <div className="grid gap-2">
            <Label>Tags</Label>
            <div className="border rounded-md p-3 max-h-40 overflow-y-auto">
              {tags.length > 0 ? (
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <div key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tag-${tag.id}`}
                        checked={selectedTagIds.includes(tag.id)}
                        onCheckedChange={() => handleTagToggle(tag.id)}
                      />
                      <Label
                        htmlFor={`tag-${tag.id}`}
                        className="flex items-center gap-2 cursor-pointer text-sm"
                      >
                        <Tag className="h-3 w-3" style={{ color: tag.color }} />
                        <span>#{tag.name}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Keine Tags verfügbar
                </p>
              )}
            </div>

            {/* Selected Tags Preview */}
            {selectedTagIds.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedTagIds.map((tagId) => {
                  const tag = tags.find(t => t.id === tagId)
                  if (!tag) return null
                  return (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      style={{ borderColor: tag.color, color: tag.color }}
                      className="text-xs"
                    >
                      #{tag.name}
                    </Badge>
                  )
                })}
              </div>
            )}
          </div>

          {/* Privacy Toggle */}
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            <X className="h-4 w-4 mr-2" />
            Abbrechen
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Speichern
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}