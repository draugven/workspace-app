'use client'

import dynamic from 'next/dynamic'
import type { TaskDescriptionEditorProps } from './task-description-editor'

const TaskDescriptionEditor = dynamic(() => import('./task-description-editor').then(mod => ({ default: mod.TaskDescriptionEditor })), {
  ssr: false,
  loading: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 border rounded-md bg-gray-50">
        <div className="text-sm text-gray-500">Editor wird geladen...</div>
      </div>
      <div className="min-h-[60px] p-3 border rounded-md bg-gray-50 animate-pulse"></div>
    </div>
  ),
})

export function TaskDescriptionEditorWrapper(props: TaskDescriptionEditorProps) {
  return <TaskDescriptionEditor {...props} />
}