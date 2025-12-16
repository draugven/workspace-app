'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  rectIntersection,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  Active,
  Over,
  useDroppable,
  defaultDropAnimationSideEffects,
  DragOverlayProps
} from '@dnd-kit/core'
import { GripVertical, EyeOff } from 'lucide-react'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import {
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { restrictToWindowEdges } from '@dnd-kit/modifiers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TaskStatusBadge } from './task-status-badge'
import { PriorityBadge } from './priority-badge'
import { TaskDialog } from './task-dialog'
import { getDepartmentCardStyle } from "@/lib/utils"
import type { Task, Department, TaskTag, User } from "@/types"

interface TaskBoardProps {
  tasks: Task[]
  onTaskStatusChange?: (taskId: string, newStatus: Task['status']) => void
  onTaskUpdate?: (updatedTask: Task) => void
  onTaskRankingUpdate?: (taskId: string, newRanking: number, newStatus?: Task['status']) => void
  onTaskDelete?: (taskId: string) => void
  departments?: Department[]
  tags?: TaskTag[]
  users?: User[]
  currentUser?: User | null
}

const statusColumns = [
  { status: 'not_started', title: 'Zu erledigen', color: 'bg-muted/30' },
  { status: 'in_progress', title: 'In Bearbeitung', color: 'bg-blue-50 dark:bg-blue-950/20' },
  { status: 'done', title: 'Erledigt', color: 'bg-green-50 dark:bg-green-950/20' },
  { status: 'blocked', title: 'Blockiert', color: 'bg-red-50 dark:bg-red-950/20' }
] as const

// Droppable Column Component
interface DroppableColumnProps {
  status: string
  title: string
  color: string
  tasks: Task[]
  activeTask: Task | null
  onTaskClick: (task: Task) => void
  users?: User[]
}

function DroppableColumn({ status, title, color, tasks, activeTask, onTaskClick, users = [] }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: 'column',
      status
    }
  })

  const columnStyle = {
    backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : undefined,
    borderColor: isOver ? '#3b82f6' : undefined
  }


  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg p-4 ${color} min-h-[200px] border-2 border-transparent transition-all`}
      style={columnStyle}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        <Badge variant="outline" className="text-xs">
          {tasks.length}
        </Badge>
      </div>

      <div className="space-y-3 min-h-[150px]">
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
            users={users}
          />
        ))}

        {tasks.length === 0 && (
          <div className="text-center text-sm text-muted-foreground py-6">
            {activeTask && isOver ? 'Hier ablegen' : 'Keine Aufgaben'}
          </div>
        )}
      </div>
    </div>
  )
}

// Draggable Task Card Component
interface DraggableTaskCardProps {
  task: Task
  onClick: (task: Task) => void
  users?: User[]
  isOverlay?: boolean
}

function DraggableTaskCard({ task, onClick, users = [], isOverlay = false }: DraggableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    }
  })

  const departmentStyle = getDepartmentCardStyle(task.department)

  // Different styles for overlay vs normal card
  const style = isOverlay ? {
    ...departmentStyle,
    cursor: 'grabbing',
  } : {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
    ...departmentStyle
  }

  return (
    <Card
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      {...(isOverlay ? {} : attributes)}
      className={isOverlay
        ? "bg-card shadow-xl border-2 border-blue-400 transform rotate-2 scale-105 relative"
        : "bg-card shadow-sm hover:shadow-md transition-shadow relative"
      }
    >
      {/* Drag Handle - only show for non-overlay cards */}
      {!isOverlay && (
        <div
          {...listeners}
          className="absolute top-2 left-2 p-1 opacity-30 hover:opacity-60 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
      )}

      {/* Clickable Card Content */}
      <div
        onClick={() => onClick(task)}
        className={isOverlay ? "cursor-grabbing" : "cursor-pointer pl-6"}
      >
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-sm line-clamp-2">{task.title}</CardTitle>
            <PriorityBadge priority={task.priority} />
          </div>
          {task.description && (
            <CardDescription
              className="text-xs line-clamp-2 prose prose-xs max-w-none"
              dangerouslySetInnerHTML={{ __html: task.description }}
            />
          )}
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col gap-2">
            {task.is_private && (
              <Badge variant="secondary" className="gap-1 text-xs w-fit">
                <EyeOff className="h-3 w-3" />
                Privat
              </Badge>
            )}
            {task.department && (
              <Badge variant="outline" className="text-xs w-fit">
                {task.department.name}
              </Badge>
            )}
            {task.assigned_to && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                👤 {users.find(u => u.id === task.assigned_to)?.display_name || 'Unknown User'}
              </div>
            )}
            {task.due_date && (
              <div className="text-xs text-muted-foreground">
                📅 {new Date(task.due_date).toLocaleDateString('de-DE')}
              </div>
            )}
            {task.tags && task.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {task.tags
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .slice(0, 2)
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
                {task.tags.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{task.tags.length - 2}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}

export function TaskBoard({
  tasks,
  onTaskStatusChange,
  onTaskUpdate,
  onTaskRankingUpdate,
  onTaskDelete,
  departments = [],
  tags = [],
  users = [],
  currentUser
}: TaskBoardProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before starting drag
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setEditDialogOpen(true)
  }

  const handleTaskSave = (updatedTask: Partial<Task>) => {
    if (onTaskUpdate && updatedTask.id) {
      // In edit mode, we always have an id
      onTaskUpdate(updatedTask as Task)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (active.data.current?.type === 'task') {
      setActiveTask(active.data.current.task)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string
    const activeTask = tasks.find(t => t.id === activeId)

    if (!activeTask) return


    // Check if we're dropping over a status column or another task
    let targetStatus = activeTask.status
    let targetTaskIndex = -1

    // If dropped on a column
    if (statusColumns.find(col => col.status === overId)) {
      targetStatus = overId as Task['status']
    } else {
      // If dropped on another task
      const overTask = tasks.find(t => t.id === overId)
      if (overTask) {
        targetStatus = overTask.status
        // Find the target task's position in its priority group
        const tasksInStatus = tasks
          .filter(t => t.status === overTask.status && t.priority === activeTask.priority)
          .sort((a, b) => (a.ranking || 0) - (b.ranking || 0))
        targetTaskIndex = tasksInStatus.findIndex(t => t.id === overId)
      }
    }

    // Handle status change
    if (activeTask.status !== targetStatus) {
      if (onTaskStatusChange) {
        onTaskStatusChange(activeId, targetStatus)
      }
      return
    }

    // Handle ranking change within the same status and priority
    if (activeTask.status === targetStatus && targetTaskIndex >= 0 && onTaskRankingUpdate) {
      // Get all tasks in the same status and priority (INCLUDING the active task for now)
      const allTasksInPriority = tasks
        .filter(t => t.status === targetStatus && t.priority === activeTask.priority)
        .sort((a, b) => (a.ranking || 0) - (b.ranking || 0))

      // Find where we want to insert (the target task's current position)
      const targetTask = tasks.find(t => t.id === overId)
      const targetRanking = targetTask?.ranking || 0

      // Now get the list without the active task for calculating new position
      const tasksWithoutActive = allTasksInPriority.filter(t => t.id !== activeId)

      // Calculate new ranking based on where we want to insert relative to target
      let newRanking = 0

      if (tasksWithoutActive.length === 0) {
        // Only task in this priority group
        newRanking = 1000
      } else {
        // Find the target task in the filtered list
        const targetTaskInFiltered = tasksWithoutActive.find(t => t.id === overId)

        if (!targetTaskInFiltered) {
          // Target task is not in the same priority - shouldn't happen, but fallback
          newRanking = tasksWithoutActive[tasksWithoutActive.length - 1].ranking + 1000
        } else {
          const targetIndexInFiltered = tasksWithoutActive.indexOf(targetTaskInFiltered)

          if (targetIndexInFiltered === 0) {
            // Insert before the first task
            newRanking = Math.max(targetTaskInFiltered.ranking - 1000, 1)
          } else {
            // Insert between the previous task and the target task
            const prevTask = tasksWithoutActive[targetIndexInFiltered - 1]
            const gap = targetTaskInFiltered.ranking - prevTask.ranking

            if (gap > 1) {
              newRanking = Math.floor(prevTask.ranking + gap / 2)
            } else {
              newRanking = prevTask.ranking + 500
            }
          }
        }
      }

      if (newRanking !== activeTask.ranking) {
        onTaskRankingUpdate(activeId, newRanking)
      }
    }
  }
  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusColumns.map(({ status, title, color }) => {
            const columnTasks = tasks
              .filter(task => task.status === status)
              .sort((a, b) => {
                // First sort by priority (urgent > high > medium > low)
                const priorityOrder = { 'urgent': 4, 'high': 3, 'medium': 2, 'low': 1 }
                const priorityDiff = (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0)
                if (priorityDiff !== 0) return priorityDiff

                // Then sort by ranking within the same priority
                return (a.ranking || 0) - (b.ranking || 0)
              })

            return (
              <SortableContext
                key={status}
                id={status}
                items={columnTasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <DroppableColumn
                  status={status}
                  title={title}
                  color={color}
                  tasks={columnTasks}
                  activeTask={activeTask}
                  onTaskClick={handleTaskClick}
                  users={users}
                />
              </SortableContext>
            )
          })}
        </div>

        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            sideEffects: defaultDropAnimationSideEffects({
              styles: {
                active: {
                  opacity: '0.5',
                },
              },
            }),
          }}
        >
          {activeTask ? (
            <DraggableTaskCard
              task={activeTask}
              onClick={() => {}}
              users={users}
              isOverlay
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      <TaskDialog
        mode="edit"
        task={selectedTask}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSave={handleTaskSave}
        onDelete={onTaskDelete}
        departments={departments}
        tags={tags}
        users={users}
        currentUser={currentUser}
      />
    </>
  )
}