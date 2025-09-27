'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EyeOff } from 'lucide-react'
import { TaskStatusBadge } from './task-status-badge'
import { PriorityBadge } from './priority-badge'
import { TaskEditDialog } from './task-edit-dialog'
import { getDepartmentRowStyle } from "@/lib/utils"
import type { Task, Department, TaskTag, User } from "@/types"

interface TasksTableProps {
  tasks: Task[]
  onTaskUpdate?: (updatedTask: Task) => void
  departments?: Department[]
  tags?: TaskTag[]
  users?: User[]
  currentUser?: User | null
}

export function TasksTable({
  tasks,
  onTaskUpdate,
  departments = [],
  tags = [],
  users = [],
  currentUser
}: TasksTableProps) {
  const [sortField, setSortField] = useState<keyof Task>('priority')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 }

  const sortedTasks = [...tasks].sort((a, b) => {
    let aVal: any = a[sortField] || ''
    let bVal: any = b[sortField] || ''

    // Special handling for priority sorting
    if (sortField === 'priority') {
      aVal = priorityOrder[a.priority as keyof typeof priorityOrder] || 0
      bVal = priorityOrder[b.priority as keyof typeof priorityOrder] || 0
    }

    // Special handling for due date
    if (sortField === 'due_date') {
      aVal = a.due_date ? new Date(a.due_date).getTime() : 0
      bVal = b.due_date ? new Date(b.due_date).getTime() : 0
    }

    // Special handling for department sorting
    if (sortField === 'department') {
      aVal = a.department?.name || ''
      bVal = b.department?.name || ''
    }

    // Special handling for tags sorting
    if (sortField === 'tags') {
      aVal = a.tags?.map(tag => tag.name).sort().join(', ') || ''
      bVal = b.tags?.map(tag => tag.name).sort().join(', ') || ''
    }

    // Special handling for assignee sorting
    if (sortField === 'assigned_to') {
      const aAssignee = users.find(u => u.id === a.assigned_to)
      const bAssignee = users.find(u => u.id === b.assigned_to)
      aVal = aAssignee?.full_name || ''
      bVal = bAssignee?.full_name || ''
    }

    if (sortDirection === 'asc') {
      return aVal > bVal ? 1 : -1
    } else {
      return aVal < bVal ? 1 : -1
    }
  })

  const handleSort = (field: keyof Task) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setEditDialogOpen(true)
  }

  const handleTaskSave = (updatedTask: Task) => {
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask)
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('title')}
            >
              Aufgabe {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('status')}
            >
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('priority')}
            >
              Priorität {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('department')}
            >
              Abteilung {sortField === 'department' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('due_date')}
            >
              Fälligkeitsdatum {sortField === 'due_date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('tags')}
            >
              Tags {sortField === 'tags' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('assigned_to')}
            >
              Zugewiesen {sortField === 'assigned_to' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTasks.map((task) => (
            <TableRow
              key={task.id}
              className="hover:bg-muted/50 cursor-pointer"
              style={getDepartmentRowStyle(task.department)}
              onClick={() => handleTaskClick(task)}
            >
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium flex items-center gap-2">
                    {task.title}
                    {task.is_private && (
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <EyeOff className="h-3 w-3" />
                        Privat
                      </Badge>
                    )}
                  </div>
                  {task.description && (
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {task.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <TaskStatusBadge status={task.status} />
              </TableCell>
              <TableCell>
                <PriorityBadge priority={task.priority} />
              </TableCell>
              <TableCell>
                {task.department && (
                  <Badge
                    variant="outline"
                    style={{ backgroundColor: task.department.color + '20', borderColor: task.department.color }}
                  >
                    {task.department.name}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-sm">
                {task.due_date
                  ? new Date(task.due_date).toLocaleDateString('de-DE')
                  : '—'
                }
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {task.tags
                    ?.slice()
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .slice(0, 3)
                    .map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        className="text-xs"
                        style={{ backgroundColor: tag.color + '20', borderColor: tag.color }}
                      >
                        #{tag.name}
                      </Badge>
                    ))}
                  {task.tags && task.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{task.tags.length - 3}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {task.assigned_to ? (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">👤</span>
                    <span>{users.find(u => u.id === task.assigned_to)?.full_name || 'Unknown User'}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TaskEditDialog
        task={selectedTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleTaskSave}
        departments={departments}
        tags={tags}
        users={users}
        currentUser={currentUser}
      />
    </div>
  )
}