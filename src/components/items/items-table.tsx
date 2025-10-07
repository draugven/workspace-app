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
import { StatusBadge } from './status-badge'
import { ItemDetailDrawer } from './item-detail-drawer'
import { Paperclip } from 'lucide-react'
import { getLightBackgroundColor, getBadgeStyle } from '@/lib/color-utils'
import type { Item } from "@/types"

interface ItemsTableProps {
  items: Item[]
  onEditItem?: (item: Item) => void
  onDeleteItem?: (itemId: string) => void
  sortField?: keyof Item
  sortDirection?: 'asc' | 'desc'
  onSortChange?: (field: keyof Item, direction: 'asc' | 'desc') => void
}

export function ItemsTable({
  items,
  onEditItem,
  onDeleteItem,
  sortField = 'name',
  sortDirection = 'asc',
  onSortChange
}: ItemsTableProps) {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const sortedItems = [...items].sort((a, b) => {
    let aVal: string
    let bVal: string

    // Handle nested fields for sorting
    if (sortField === 'source') {
      aVal = a.source || ''
      bVal = b.source || ''
    } else if (sortField === 'category') {
      aVal = a.category?.name || ''
      bVal = b.category?.name || ''
    } else if (sortField === 'characters') {
      // Sort by first character name
      aVal = a.characters?.[0]?.name || ''
      bVal = b.characters?.[0]?.name || ''
    } else {
      aVal = (a[sortField] || '').toString()
      bVal = (b[sortField] || '').toString()
    }

    if (sortDirection === 'asc') {
      return aVal.localeCompare(bVal)
    } else {
      return bVal.localeCompare(aVal)
    }
  })

  const handleSort = (field: keyof Item) => {
    if (onSortChange) {
      if (sortField === field) {
        onSortChange(field, sortDirection === 'asc' ? 'desc' : 'asc')
      } else {
        onSortChange(field, 'asc')
      }
    }
  }

  const handleRowClick = (item: Item) => {
    setSelectedItem(item)
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
    setSelectedItem(null)
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Seite(n)</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('name')}
            >
              Requisit {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('characters' as keyof Item)}
            >
              Charaktere {sortField === 'characters' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('status')}
            >
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="max-w-md">Notizen</TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('source')}
            >
              Quelle {sortField === 'source' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('category' as keyof Item)}
            >
              Kategorie {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="w-24">Flags</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-muted/50 cursor-pointer"
              style={{
                backgroundColor: getLightBackgroundColor(item.category?.color, 0.05)
              }}
              onClick={() => handleRowClick(item)}
            >
              <TableCell className="text-sm text-muted-foreground">
                {item.scene || '—'}
              </TableCell>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {item.name}
                  {item.files && item.files.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Paperclip className="h-3 w-3 text-blue-600" />
                      <span className="text-xs text-blue-600">
                        {item.files.length}
                      </span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.characters?.map((character) => {
                    const badgeStyle = getBadgeStyle(character.color);
                    return (
                      <Badge
                        key={character.id}
                        variant="outline"
                        className="text-xs"
                        style={badgeStyle}
                      >
                        {character.name}
                      </Badge>
                    );
                  }) || '—'}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell className="max-w-md">
                <div className="text-sm text-muted-foreground truncate">
                  {item.notes || '—'}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {item.source || '—'}
              </TableCell>
              <TableCell>
                {item.category?.name || '—'}
              </TableCell>
              <TableCell className="w-24">
                <div className="flex flex-col gap-1 text-xs">
                  {item.is_consumable && (
                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400">
                      Verbrauchbar
                    </Badge>
                  )}
                  {item.is_used && (
                    <Badge variant="outline" className="text-xs bg-gray-50 text-gray-700 dark:bg-gray-800/30 dark:text-gray-400">
                      Benutzt
                    </Badge>
                  )}
                  {item.is_changeable && (
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
                      Änderbar
                    </Badge>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ItemDetailDrawer
        item={selectedItem}
        open={drawerOpen}
        onClose={handleDrawerClose}
        onEdit={onEditItem}
        onDelete={onDeleteItem}
      />
    </div>
  )
}