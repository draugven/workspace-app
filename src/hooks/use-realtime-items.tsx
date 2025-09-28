'use client'

import { useRealtimeData } from './use-realtime-data'
import type { Item } from '@/types'

export function useRealtimeItems(enableLogs = false) {
  return useRealtimeData<Item>({
    tableName: 'items',
    selectQuery: `
      *,
      category:categories(*),
      item_characters(character_id, character:characters(*)),
      item_files(*)
    `,
    orderBy: { column: 'updated_at', ascending: false },
    enableLogs,
    onInsert: (item) => {
      if (enableLogs) {
        console.log('🆕 New item created:', item.name)
      }
    },
    onUpdate: (item) => {
      if (enableLogs) {
        console.log('✏️ Item updated:', item.name)
      }
    },
    onDelete: (id) => {
      if (enableLogs) {
        console.log('🗑️ Item deleted:', id)
      }
    }
  })
}