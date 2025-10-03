'use client'

import { useRealtimeData } from './use-realtime-data'
import type { Item } from '@/types'

// Transform function to flatten the nested character structure
function transformItemData(items: any[]): Item[] {
  return items.map((item) => ({
    ...item,
    // Transform item_characters array to characters array
    characters: item.item_characters?.map((ic: any) => ic.character) || [],
    // Keep item_characters for reference if needed
    // item_characters: undefined
  }))
}

export function useRealtimeItems(enableLogs = false) {
  const result = useRealtimeData<any>({
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

  // Transform the data before returning
  return {
    ...result,
    data: transformItemData(result.data)
  } as typeof result & { data: Item[] }
}