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
import { Eye, Paperclip } from 'lucide-react'
import type { Item } from "@/types"

interface ItemsTableProps {
  items: Item[]
  onEditItem?: (item: Item) => void
}

export function ItemsTable({ items, onEditItem }: ItemsTableProps) {
  const [sortField, setSortField] = useState<keyof Item>('name')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const sortedItems = [...items].sort((a, b) => {
    const aVal = a[sortField] || ''
    const bVal = b[sortField] || ''

    if (sortDirection === 'asc') {
      return aVal.toString().localeCompare(bVal.toString())
    } else {
      return bVal.toString().localeCompare(aVal.toString())
    }
  })

  const handleSort = (field: keyof Item) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
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
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('name')}
            >
              Requisit {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('type')}
            >
              Typ {sortField === 'type' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => handleSort('status')}
            >
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Szene</TableHead>
            <TableHead>Charaktere</TableHead>
            <TableHead>Quelle</TableHead>
            <TableHead>Kategorie</TableHead>
            <TableHead>Flags</TableHead>
            <TableHead>Notizen</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedItems.map((item) => (
            <TableRow
              key={item.id}
              className="hover:bg-muted/50 cursor-pointer"
              onClick={() => handleRowClick(item)}
            >
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
                <Badge variant={item.type === 'prop' ? 'default' : 'secondary'}>
                  {item.type === 'prop' ? 'Requisit' : 'Kostüm'}
                </Badge>
              </TableCell>
              <TableCell>
                <StatusBadge status={item.status} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {item.scene || '—'}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {item.characters?.map((character) => (
                    <Badge key={character.id} variant="outline" className="text-xs">
                      {character.name}
                    </Badge>
                  )) || '—'}
                </div>
              </TableCell>
              <TableCell className="text-sm">
                {item.source || '—'}
              </TableCell>
              <TableCell>
                {item.category?.name || '—'}
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-xs">
                  {item.is_consumable && (
                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                      Verbrauchbar
                    </Badge>
                  )}
                  {item.needs_clarification && (
                    <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700">
                      Klären
                    </Badge>
                  )}
                  {item.needed_for_rehearsal && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                      Probe
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-xs">
                <div className="text-sm text-muted-foreground truncate">
                  {item.notes || '—'}
                </div>
              </TableCell>
              <TableCell>
                <Eye className="h-4 w-4 text-muted-foreground" />
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
      />
    </div>
  )
}