'use client'

import { useCallback } from 'react'
import { useRealtimeData } from './use-realtime-data'
import type { Task } from '@/types'

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

  return useRealtimeData<Task>({
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
}