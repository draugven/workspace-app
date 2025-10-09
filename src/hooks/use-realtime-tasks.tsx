'use client'

import { useCallback } from 'react'
import { useRealtimeData } from './use-realtime-data'
import type { Task } from '@/types'

// Transform function to flatten nested tag structure from Supabase
const transformTaskData = (rawTask: any): Task => {
  const { task_tag_assignments, ...taskData } = rawTask

  // Transform nested task_tag_assignments structure to flat tags array
  const tags = task_tag_assignments?.map((assignment: any) => assignment.task_tags).filter(Boolean) || []

  return {
    ...taskData,
    tags
  } as Task
}

export function useRealtimeTasks(enableLogs = false) {
  // Stable filter function to prevent infinite re-renders
  const tasksFilter = useCallback((user: any) =>
    `is_private.eq.false,and(is_private.eq.true,created_by.eq.${user.id})`, [])

  // Stable callback functions to prevent infinite re-renders
  const onInsertCallback = useCallback((task: Task) => {
    if (enableLogs) {
      console.log('🆕 New task created:', task.title)
    }
  }, [enableLogs])

  const onUpdateCallback = useCallback((task: Task) => {
    if (enableLogs) {
      console.log('✏️ Task updated:', task.title, 'Status:', task.status)
    }
  }, [enableLogs])

  const onDeleteCallback = useCallback((id: string) => {
    if (enableLogs) {
      console.log('🗑️ Task deleted:', id)
    }
  }, [enableLogs])

  // Type for raw task data from Supabase (before transformation)
  type RawTask = Omit<Task, 'tags'> & {
    task_tag_assignments?: Array<{ task_tags: any }>
  }

  const result = useRealtimeData<RawTask>({
    tableName: 'tasks',
    selectQuery: `
      *,
      department:departments(*),
      task_tag_assignments(
        task_tags(*)
      )
    `,
    orderBy: { column: 'created_at', ascending: false },
    filter: tasksFilter,
    enableLogs,
    onInsert: onInsertCallback,
    onUpdate: onUpdateCallback,
    onDelete: onDeleteCallback
  })

  // Transform the data to flatten nested tags structure
  return {
    ...result,
    data: result.data.map(transformTaskData) as Task[]
  }
}