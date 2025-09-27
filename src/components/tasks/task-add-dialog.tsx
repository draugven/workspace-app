'use client'

import { useState, useEffect } from 'react'
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
import { Plus, X, Tag } from 'lucide-react'
import type { Task, Department, TaskTag, User } from '@/types'

interface TaskAddDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (newTask: Partial<Task>) => void
  departments: Department[]
  tags: TaskTag[]
  users?: User[]
}

interface NewTaskData {
  title: string
  description: string
  status: Task['status']
  priority: Task['priority']
  department_id: string | 'none'
  assigned_to: string | 'none'
  due_date: string | null
  tags: string[]
  is_private: boolean
}

export function TaskAddDialog({
  open,
  onOpenChange,
  onSave,
  departments,
  tags,
  users = []
}: TaskAddDialogProps) {
  const [newTask, setNewTask] = useState<NewTaskData>({
    title: '',
    description: '',
    status: 'not_started',
    priority: 'medium',
    department_id: 'none',
    assigned_to: 'none',
    due_date: null,
    tags: [],
    is_private: false
  })
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // Get current user and reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      // Get current user to preselect as assignee
      supabase.auth.getUser().then(({ data: { user } }) => {
        const currentUserData = users.find(u => u.id === user?.id)
        setCurrentUser(currentUserData || null)

        setNewTask({
          title: '',
          description: '',
          status: 'not_started',
          priority: 'medium',
          department_id: 'none',
          assigned_to: currentUserData?.id || 'none',
          due_date: null,
          tags: [],
          is_private: false
        })
      })
    }
  }, [open, users])

  const handleSave = () => {
    if (!newTask.title.trim()) {
      return // Don't save without title
    }

    // Convert to the format expected by parent component
    const taskToSave: Partial<Task> = {
      title: newTask.title.trim(),
      description: newTask.description.trim() || null,
      status: newTask.status,
      priority: newTask.priority,
      department_id: newTask.department_id === 'none' ? null : newTask.department_id,
      assigned_to: newTask.assigned_to === 'none' ? null : newTask.assigned_to,
      due_date: newTask.due_date,
      is_private: newTask.is_private,
      tags: newTask.tags.map(tagId => tags.find(t => t.id === tagId)).filter(Boolean) as TaskTag[]
    }

    onSave(taskToSave)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleTagToggle = (tagId: string) => {
    setNewTask(prev => ({
      ...prev,
      tags: prev.tags.includes(tagId)
        ? prev.tags.filter(id => id !== tagId)
        : [...prev.tags, tagId]
    }))
  }

  const isFormValid = newTask.title.trim().length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Neue Aufgabe erstellen</DialogTitle>
          <DialogDescription>
            Erstelle eine neue Aufgabe für dein Team
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="grid gap-2">
            <Label htmlFor="title">Titel *</Label>
            <Input
              id="title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Aufgabentitel..."
              className={!isFormValid && newTask.title.length === 0 ? 'border-red-500' : ''}
            />
            {!isFormValid && newTask.title.length === 0 && (
              <p className="text-sm text-red-600">Titel ist erforderlich</p>
            )}
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Beschreibung</Label>
            <Textarea
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              placeholder="Beschreibung der Aufgabe..."
              rows={3}
            />
          </div>

          {/* Status and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newTask.status}
                onValueChange={(value: Task['status']) => setNewTask({ ...newTask, status: value })}
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
                value={newTask.priority}
                onValueChange={(value: Task['priority']) => setNewTask({ ...newTask, priority: value })}
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
                value={newTask.department_id}
                onValueChange={(value) => setNewTask({ ...newTask, department_id: value })}
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
                value={newTask.due_date || ''}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value || null })}
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
              value={newTask.assigned_to}
              onValueChange={(value) => setNewTask({ ...newTask, assigned_to: value })}
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
                        checked={newTask.tags.includes(tag.id)}
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
            {newTask.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {newTask.tags.map((tagId) => {
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
              checked={newTask.is_private}
              onCheckedChange={(checked) =>
                setNewTask(prev => ({ ...prev, is_private: checked }))
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
          <Button onClick={handleSave} disabled={!isFormValid}>
            <Plus className="h-4 w-4 mr-2" />
            Aufgabe erstellen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}