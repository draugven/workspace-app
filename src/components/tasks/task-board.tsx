'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TaskStatusBadge } from './task-status-badge'
import { PriorityBadge } from './priority-badge'
import { TaskEditDialog } from './task-edit-dialog'
import type { Task, Department, TaskTag } from "@/types"

interface TaskBoardProps {
  tasks: Task[]
  onTaskStatusChange?: (taskId: string, newStatus: Task['status']) => void
  onTaskUpdate?: (updatedTask: Task) => void
  departments?: Department[]
  tags?: TaskTag[]
}

const statusColumns = [
  { status: 'not_started', title: 'Zu erledigen', color: 'bg-gray-50' },
  { status: 'in_progress', title: 'In Bearbeitung', color: 'bg-blue-50' },
  { status: 'done', title: 'Erledigt', color: 'bg-green-50' },
  { status: 'blocked', title: 'Blockiert', color: 'bg-red-50' }
] as const

export function TaskBoard({
  tasks,
  onTaskStatusChange,
  onTaskUpdate,
  departments = [],
  tags = []
}: TaskBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statusColumns.map(({ status, title, color }) => {
          const columnTasks = tasks.filter(task => task.status === status)

          return (
            <div key={status} className={`rounded-lg p-4 ${color}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
                <Badge variant="outline" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>

              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <Card
                    key={task.id}
                    className="bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-sm line-clamp-2">{task.title}</CardTitle>
                        <PriorityBadge priority={task.priority} />
                      </div>
                      {task.description && (
                        <CardDescription className="text-xs line-clamp-2">
                          {task.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-col gap-2">
                        {task.department && (
                          <Badge variant="outline" className="text-xs w-fit">
                            {task.department.name}
                          </Badge>
                        )}
                        {task.assignee && (
                          <div className="text-xs text-muted-foreground">
                            👤 {task.assignee.full_name}
                          </div>
                        )}
                        {task.due_date && (
                          <div className="text-xs text-muted-foreground">
                            📅 {new Date(task.due_date).toLocaleDateString('de-DE')}
                          </div>
                        )}
                        {task.tags && task.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {task.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="outline"
                                className="text-xs"
                                style={{ backgroundColor: tag.color + '20', borderColor: tag.color }}
                              >
                                #{tag.name}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {columnTasks.length === 0 && (
                  <div className="text-center text-sm text-gray-400 py-8">
                    Keine Aufgaben
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <TaskEditDialog
        task={selectedTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleTaskSave}
        departments={departments}
        tags={tags}
      />
    </>
  )
}