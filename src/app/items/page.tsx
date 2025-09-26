'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Navigation } from '@/components/layout/navigation'
import { ItemsTable } from '@/components/items/items-table'
import { ItemForm } from '@/components/items/item-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { StatsBar } from '@/components/ui/stats-bar'
import { supabase } from '@/lib/supabase'
import { Plus, RefreshCw } from 'lucide-react'
import type { Item } from '@/types'

// Mock data for now - this will be replaced with actual Supabase queries
const mockItems: Item[] = [
  {
    id: '1',
    name: 'Gladstone-Koffer',
    type: 'prop',
    scene: '1',
    status: 'erhalten',
    is_consumable: false,
    needs_clarification: false,
    needed_for_rehearsal: true,
    source: 'Staatstheater',
    notes: '',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    category: { id: '1', name: 'Taschen & Koffer', type: 'both', created_at: '2024-01-01' },
    characters: [{ id: '1', name: 'Jonathan Harker', created_at: '2024-01-01' }]
  },
  {
    id: '2',
    name: 'Sarg',
    type: 'prop',
    scene: '5',
    status: 'klären',
    is_consumable: false,
    needs_clarification: true,
    needed_for_rehearsal: false,
    notes: 'Mechanismus zum verschwinden?',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    category: { id: '2', name: 'Möbel', type: 'prop', created_at: '2024-01-01' },
    characters: [{ id: '2', name: 'Dracula', created_at: '2024-01-01' }]
  },
  {
    id: '3',
    name: 'Brautstrauß',
    type: 'prop',
    status: 'in progress',
    is_consumable: false,
    needs_clarification: false,
    needed_for_rehearsal: true,
    source: 'Gekauft',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    category: { id: '3', name: 'Floristik', type: 'prop', created_at: '2024-01-01' },
    characters: [{ id: '3', name: 'Lucy Westenra', created_at: '2024-01-01' }]
  },
  {
    id: '4',
    name: 'Hochzeitsschleier',
    type: 'costume',
    status: 'in progress',
    is_consumable: false,
    needs_clarification: false,
    needed_for_rehearsal: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    category: { id: '4', name: 'Accessoires', type: 'both', created_at: '2024-01-01' },
    characters: [{ id: '3', name: 'Lucy Westenra', created_at: '2024-01-01' }]
  },
  {
    id: '5',
    name: 'Zigarre',
    type: 'prop',
    status: 'verloren',
    is_consumable: true,
    needs_clarification: false,
    needed_for_rehearsal: true,
    source: 'Produziert',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    category: { id: '5', name: 'Essen & Trinken', type: 'prop', created_at: '2024-01-01' },
    characters: [{ id: '4', name: 'Quincey Morris', created_at: '2024-01-01' }]
  }
]

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadItems()
  }, [])

  const loadItems = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('items')
        .select(`
          *,
          category:categories(*),
          characters:item_characters(character:characters(*)),
          files:item_files(*)
        `)
        .order('updated_at', { ascending: false })

      if (error) throw error

      // Transform the data to match our Item interface
      const transformedItems: Item[] = (data || []).map(item => ({
        ...item,
        characters: item.characters?.map((ic: any) => ic.character) || [],
        files: item.files || []
      }))

      setItems(transformedItems)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateItem = async (itemData: Partial<Item>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: newItem, error } = await supabase
        .from('items')
        .insert({
          ...itemData,
          created_by: user?.id
        })
        .select()
        .single()

      if (error) throw error

      // Handle character assignments
      if (itemData.character_ids && itemData.character_ids.length > 0) {
        const characterLinks = itemData.character_ids.map(charId => ({
          item_id: newItem.id,
          character_id: charId
        }))

        await supabase
          .from('item_characters')
          .insert(characterLinks)
      }

      await loadItems() // Reload to get the full data with relations
    } catch (error) {
      console.error('Failed to create item:', error)
      throw error
    }
  }

  const handleEditItem = async (itemData: Partial<Item>) => {
    if (!editingItem) return

    try {
      const { error } = await supabase
        .from('items')
        .update(itemData)
        .eq('id', editingItem.id)

      if (error) throw error

      // Handle character assignments - remove old ones and add new ones
      if (itemData.character_ids !== undefined) {
        // Remove existing character assignments
        await supabase
          .from('item_characters')
          .delete()
          .eq('item_id', editingItem.id)

        // Add new ones if any
        if (itemData.character_ids.length > 0) {
          const characterLinks = itemData.character_ids.map(charId => ({
            item_id: editingItem.id,
            character_id: charId
          }))

          await supabase
            .from('item_characters')
            .insert(characterLinks)
        }
      }

      await loadItems() // Reload to get updated data
      setEditingItem(null)
    } catch (error) {
      console.error('Failed to update item:', error)
      throw error
    }
  }

  const handleSaveItem = async (itemData: Partial<Item>) => {
    if (editingItem) {
      await handleEditItem(itemData)
    } else {
      await handleCreateItem(itemData)
    }
  }

  const openEditForm = (item: Item) => {
    setEditingItem(item)
    setFormOpen(true)
  }

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    searchTerm === '' ||
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
    item.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.characters?.some(char => char.name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalItems = items.length
  const propCount = items.filter(item => item.type === 'prop').length
  const costumeCount = items.filter(item => item.type === 'costume').length
  const statusCounts = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="container mx-auto py-4 space-y-4">
        <PageHeader
          title="Requisiten & Kostüme"
          description="Verwalte Requisiten und Kostüme für die Produktion"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Items durchsuchen..."
          actions={
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={loadItems}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Aktualisieren
              </Button>
              <Button
                onClick={() => {
                  setEditingItem(null)
                  setFormOpen(true)
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Neues Item
              </Button>
            </>
          }
        />

        <StatsBar
          stats={[
            { label: 'Gesamt:', value: totalItems },
            { label: 'Requisiten:', value: propCount },
            { label: 'Kostüme:', value: costumeCount },
            { label: 'Erhalten:', value: statusCounts['erhalten'] || 0, className: 'text-green-600' }
          ]}
          badges={Object.entries(statusCounts).map(([status, count]) => ({
            text: `${status}: ${count}`
          }))}
        />

        {/* Loading and Error States */}
        {loading && (
          <Card>
            <CardContent className="py-6 text-center">
              <div className="text-muted-foreground">Items werden geladen...</div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="py-6 text-center">
              <div className="text-red-800 mb-2">{error}</div>
              <Button
                variant="outline"
                onClick={loadItems}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Erneut versuchen
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Items Table */}
        {!loading && !error && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Alle Items</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {searchTerm ? `${filteredItems.length} von ${totalItems}` : totalItems} Items
                </span>
              </CardTitle>
              <CardDescription>
                Klicke auf die Spaltenüberschriften zum Sortieren oder auf eine Zeile für Details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredItems.length > 0 ? (
                <ItemsTable items={filteredItems} onEditItem={openEditForm} />
              ) : items.length === 0 ? (
                <div className="text-center py-6">
                  <div className="text-muted-foreground mb-4">
                    Noch keine Items vorhanden. Erstelle dein erstes Item!
                  </div>
                  <Button
                    onClick={() => {
                      setEditingItem(null)
                      setFormOpen(true)
                    }}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Erstes Item erstellen
                  </Button>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-muted-foreground">
                    Keine Items entsprechen der aktuellen Suche.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Item Form Dialog */}
        <ItemForm
          open={formOpen}
          onClose={() => {
            setFormOpen(false)
            setEditingItem(null)
          }}
          onSave={handleSaveItem}
          editingItem={editingItem}
        />
      </div>
    </ProtectedRoute>
  )
}