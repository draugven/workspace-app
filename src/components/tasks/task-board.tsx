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
  useDroppable
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
import { TaskEditDialog } from './task-edit-dialog'
import { getDepartmentCardStyle } from "@/lib/utils"
import type { Task, Department, TaskTag, User } from "@/types"

interface TaskBoardProps {
  tasks: Task[]
  onTaskStatusChange?: (taskId: string, newStatus: Task['status']) => void
  onTaskUpdate?: (updatedTask: Task) => void
  departments?: Department[]
  tags?: TaskTag[]
  users?: User[]
  currentUser?: User | null
}

const statusColumns = [
  { status: 'not_started', title: 'Zu erledigen', color: 'bg-gray-50' },
  { status: 'in_progress', title: 'In Bearbeitung', color: 'bg-blue-50' },
  { status: 'done', title: 'Erledigt', color: 'bg-green-50' },
  { status: 'blocked', title: 'Blockiert', color: 'bg-red-50' }
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
    borderColor: isOver ? '#3b82f6' : 'transparent'
  }

  console.log('Column', status, 'isOver:', isOver, 'activeTask:', !!activeTask)

  return (
    <div
      ref={setNodeRef}
      className={`rounded-lg p-4 ${color} min-h-[200px] border-2 transition-all`}
      style={columnStyle}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
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
          <div className="text-center text-sm text-gray-400 py-6">
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
}

function DraggableTaskCard({ task, onClick, users = [] }: DraggableTaskCardProps) {
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
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    ...departmentStyle
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white shadow-sm hover:shadow-md transition-shadow relative"
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        className="absolute top-2 left-2 p-1 opacity-30 hover:opacity-60 cursor-grab active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
      >
        <GripVertical className="h-3 w-3 text-gray-400" />
      </div>

      {/* Clickable Card Content */}
      <div onClick={() => onClick(task)} className="cursor-pointer pl-6">
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
                👤 {users.find(u => u.id === task.assigned_to)?.full_name || 'Unknown User'}
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

  const handleTaskSave = (updatedTask: Task) => {
    if (onTaskUpdate) {
      onTaskUpdate(updatedTask)
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

    console.log('Drag end:', { activeId, overId })

    // Check if we're dropping over a status column
    let targetStatus = overId
    if (!statusColumns.find(col => col.status === overId)) {
      // If not dropped on column directly, check if dropped on a task
      const overTask = tasks.find(t => t.id === overId)
      if (overTask) {
        targetStatus = overTask.status
      }
    }

    // Validate targetStatus
    const validStatus = statusColumns.find(col => col.status === targetStatus)?.status
    if (validStatus) {
      const task = tasks.find(t => t.id === activeId)
      if (task && task.status !== validStatus && onTaskStatusChange) {
        console.log('Updating task status:', activeId, 'to', validStatus)
        onTaskStatusChange(activeId, validStatus as Task['status'])
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
            const columnTasks = tasks.filter(task => task.status === status)

            return (
              <DroppableColumn
                key={status}
                status={status}
                title={title}
                color={color}
                tasks={columnTasks}
                activeTask={activeTask}
                onTaskClick={handleTaskClick}
                users={users}
              />
            )
          })}
        </div>

        <DragOverlay>
          {activeTask ? (
            <Card className="bg-white shadow-lg border-2 border-blue-500 opacity-90 rotate-3">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm line-clamp-2">{activeTask.title}</CardTitle>
                  <PriorityBadge priority={activeTask.priority} />
                </div>
              </CardHeader>
            </Card>
          ) : null}
        </DragOverlay>
      </DndContext>

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
    </>
  )
}