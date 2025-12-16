'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { TaskForm, TaskFormData } from './task-form'
import { useMediaQuery } from '@/hooks/use-media-query'
import { useAuth } from '@/components/auth/auth-provider'
import { Plus, Save, X, Trash2 } from 'lucide-react'
import type { Task, Department, TaskTag, User } from '@/types'

interface TaskDialogProps {
  mode: 'add' | 'edit'
  /** The task to edit (required for edit mode, ignored for add mode) */
  task?: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (task: Partial<Task>) => void
  onDelete?: (taskId: string) => void
  departments: Department[]
  tags: TaskTag[]
  users?: User[]
  currentUser?: User | null
}

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  status: 'not_started',
  priority: 'medium',
  department_id: undefined,
  assigned_to: undefined,
  due_date: undefined,
  selectedTagIds: [],
  is_private: false
}

export function TaskDialog({
  mode,
  task,
  open,
  onOpenChange,
  onSave,
  onDelete,
  departments,
  tags,
  users = [],
  currentUser
}: TaskDialogProps) {
  const [formData, setFormData] = useState<TaskFormData>(initialFormData)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showValidation, setShowValidation] = useState(false)
  const { isAdmin } = useAuth()
  const isMobile = useMediaQuery('(max-width: 768px)')

  // Initialize form data when dialog opens
  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setShowDeleteConfirm(false)
      setShowValidation(false)
      return
    }

    if (mode === 'edit' && task) {
      // Edit mode: populate from existing task
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        department_id: task.department_id,
        assigned_to: task.assigned_to,
        due_date: task.due_date,
        selectedTagIds: task.tags?.map(tag => tag.id) || [],
        is_private: task.is_private || false
      })
    } else {
      // Add mode: get current user to preselect as assignee
      supabase.auth.getUser().then(({ data: { user } }) => {
        const currentUserData = users.find(u => u.id === user?.id)
        setFormData({
          ...initialFormData,
          assigned_to: currentUserData?.id
        })
      })
    }
  }, [open, mode, task, users])

  const handleSave = () => {
    if (!formData.title.trim()) {
      setShowValidation(true)
      return
    }

    // Check if description has meaningful content (not just empty HTML)
    const descriptionText = formData.description.replace(/<[^>]*>/g, '').trim()
    const selectedTags = tags.filter(tag => formData.selectedTagIds.includes(tag.id))

    const taskToSave: Partial<Task> = {
      ...(mode === 'edit' && task ? { id: task.id } : {}),
      title: formData.title.trim(),
      description: descriptionText ? formData.description : undefined,
      status: formData.status,
      priority: formData.priority,
      department_id: formData.department_id,
      assigned_to: formData.assigned_to,
      due_date: formData.due_date,
      is_private: formData.is_private,
      tags: selectedTags
    }

    onSave(taskToSave)
    onOpenChange(false)
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleDelete = async () => {
    if (mode === 'edit' && task && onDelete && showDeleteConfirm) {
      await onDelete(task.id)
      onOpenChange(false)
    }
  }

  const isFormValid = formData.title.trim().length > 0

  // Determine if privacy toggle should be shown
  // Add mode: always show
  // Edit mode: only show to creator
  const showPrivacyToggle = mode === 'add' || (mode === 'edit' && task && currentUser && task.created_by === currentUser.id)

  // Dialog titles and descriptions
  const title = mode === 'add' ? 'Neue Aufgabe erstellen' : 'Aufgabe bearbeiten'
  const description = mode === 'add'
    ? 'Erstelle eine neue Aufgabe für dein Team'
    : 'Ändere die Details dieser Aufgabe'

  // Footer content (shared between Dialog and Sheet)
  const footerContent = (
    <>
      {/* Admin delete button (edit mode only) */}
      {mode === 'edit' && isAdmin && (
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
                <span className="hidden sm:inline">Abbrechen</span>
                <X className="h-4 w-4 sm:hidden" />
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Löschen</span>
            </Button>
          )}
        </div>
      )}
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleCancel}>
          <X className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Abbrechen</span>
        </Button>
        <Button onClick={handleSave} disabled={!isFormValid}>
          {mode === 'add' ? (
            <>
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Aufgabe erstellen</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Speichern</span>
            </>
          )}
        </Button>
      </div>
    </>
  )

  // Form content (shared between Dialog and Sheet)
  const formContent = (
    <TaskForm
      data={formData}
      onChange={setFormData}
      departments={departments}
      tags={tags}
      users={users}
      mode={mode}
      showPrivacyToggle={showPrivacyToggle || false}
      showValidation={showValidation}
    />
  )

  // Render Sheet on mobile, Dialog on desktop
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="h-[90vh] flex flex-col"
        >
          <SheetHeader className="flex-shrink-0">
            <SheetTitle>{title}</SheetTitle>
            <SheetDescription>{description}</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto overflow-x-hidden px-1">
            {formContent}
          </div>

          <SheetFooter className="flex-shrink-0 flex flex-row justify-between items-center pt-4 border-t">
            {footerContent}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {formContent}
        </div>

        <DialogFooter className="flex-shrink-0 flex flex-row justify-between items-center">
          {footerContent}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
