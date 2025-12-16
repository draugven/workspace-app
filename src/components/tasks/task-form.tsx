'use client'

import { Input } from '@/components/ui/input'
import { TaskDescriptionEditorWrapper } from './task-description-editor-wrapper'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Combobox } from '@/components/ui/combobox'
import { MultiSelect } from '@/components/ui/multi-select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { Task, Department, TaskTag, User } from '@/types'

export interface TaskFormData {
  title: string
  description: string
  status: Task['status']
  priority: Task['priority']
  department_id: string | undefined
  assigned_to: string | undefined
  due_date: string | undefined
  selectedTagIds: string[]
  is_private: boolean
}

interface TaskFormProps {
  data: TaskFormData
  onChange: (data: TaskFormData) => void
  departments: Department[]
  tags: TaskTag[]
  users: User[]
  mode: 'add' | 'edit'
  /** Show privacy toggle (only for creator in edit mode, always in add mode) */
  showPrivacyToggle: boolean
  /** Validation state */
  showValidation?: boolean
}

export function TaskForm({
  data,
  onChange,
  departments,
  tags,
  users,
  mode,
  showPrivacyToggle,
  showValidation = false
}: TaskFormProps) {
  const isFormValid = data.title.trim().length > 0
  const showTitleError = showValidation && !isFormValid

  const updateField = <K extends keyof TaskFormData>(field: K, value: TaskFormData[K]) => {
    onChange({ ...data, [field]: value })
  }

  return (
    <div className="grid gap-4 py-4">
      {/* Title */}
      <div className="grid gap-2">
        <Label htmlFor="title">Titel *</Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => updateField('title', e.target.value)}
          placeholder="Aufgabentitel..."
          className={showTitleError ? 'border-red-500' : ''}
        />
        {showTitleError && (
          <p className="text-sm text-red-600">Titel ist erforderlich</p>
        )}
      </div>

      {/* Description */}
      <div className="grid gap-2">
        <Label htmlFor="description">Beschreibung</Label>
        <TaskDescriptionEditorWrapper
          content={data.description}
          onChange={(content) => updateField('description', content)}
          placeholder="Beschreibung der Aufgabe..."
        />
      </div>

      {/* Status and Priority Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select
            value={data.status}
            onValueChange={(value: Task['status']) => updateField('status', value)}
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
            value={data.priority}
            onValueChange={(value: Task['priority']) => updateField('priority', value)}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="department">Abteilung</Label>
          <Combobox
            options={[
              { value: "none", label: "Keine Abteilung" },
              ...departments.map(dept => ({ value: dept.id, label: dept.name }))
            ]}
            value={data.department_id || 'none'}
            onValueChange={(value) => updateField('department_id', value === 'none' ? undefined : value)}
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
            value={data.due_date || ''}
            onChange={(e) => updateField('due_date', e.target.value || undefined)}
          />
        </div>
      </div>

      {/* Assignee Row */}
      <div className="grid gap-2">
        <Label htmlFor="assigned_to">Zugewiesen an</Label>
        <Combobox
          options={[
            { value: "none", label: "Niemandem zugewiesen" },
            ...users.map(user => ({ value: user.id, label: `${user.display_name} (${user.email})` }))
          ]}
          value={data.assigned_to || 'none'}
          onValueChange={(value) => updateField('assigned_to', value === 'none' ? undefined : value)}
          placeholder="Person zuweisen..."
          searchPlaceholder="Person suchen..."
          emptyText="Keine Person gefunden."
        />
      </div>

      {/* Tags Selection */}
      <div className="grid gap-2">
        <Label>Tags</Label>
        <MultiSelect
          options={tags.map(tag => ({
            value: tag.id,
            label: tag.name,
            color: tag.color
          }))}
          selected={data.selectedTagIds}
          onChange={(values) => updateField('selectedTagIds', values)}
          placeholder="Tags auswählen..."
          emptyText="Keine Tags gefunden."
        />
      </div>

      {/* Privacy Toggle */}
      {showPrivacyToggle && (
        <div className="flex items-center space-x-2">
          <Switch
            id="is_private"
            checked={data.is_private}
            onCheckedChange={(checked) => updateField('is_private', checked)}
          />
          <Label htmlFor="is_private" className="text-sm">
            Privat (nur für mich sichtbar)
          </Label>
        </div>
      )}
    </div>
  )
}
