'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { ItemsTable } from '@/components/items/items-table'
import { ItemForm } from '@/components/items/item-form'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/ui/page-header'
import { StatsBar } from '@/components/ui/stats-bar'
import { Combobox } from '@/components/ui/combobox'
import { MultiSelect } from '@/components/ui/multi-select'
import { useRealtimeItems } from '@/hooks/use-realtime-items'
import { usePersistedState } from '@/hooks/use-persisted-state'
import { supabase } from '@/lib/supabase'
import { Plus, RefreshCw, Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import type { Item, Category, Character } from '@/types'


export default function ItemsPage() {
  // Use real-time hook instead of manual state management
  const {
    data: items,
    loading,
    error,
    refresh,
    insert: createItem,
    update: updateItem,
    remove: deleteItem
  } = useRealtimeItems(false) // Disable verbose logging

  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  // Persisted filter states
  const [searchTerm, setSearchTerm] = usePersistedState('back2stage-props-search', '')
  const [selectedCategory, setSelectedCategory] = usePersistedState<string | null>('back2stage-props-category', null)
  const [selectedSource, setSelectedSource] = usePersistedState<string | null>('back2stage-props-source', null)
  const [selectedCharacters, setSelectedCharacters] = usePersistedState<string[]>('back2stage-props-characters', [])
  const [selectedStatus, setSelectedStatus] = usePersistedState<string | null>('back2stage-props-status', null)
  const [sortField, setSortField] = usePersistedState<keyof Item>('back2stage-props-sortField', 'name')
  const [sortDirection, setSortDirection] = usePersistedState<'asc' | 'desc'>('back2stage-props-sortDirection', 'asc')

  // Non-persisted UI state
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  // Filter data from database
  const [categories, setCategories] = useState<Category[]>([])
  const [characters, setCharacters] = useState<Character[]>([])

  // Fetch categories and characters for filters
  useEffect(() => {
    const fetchFilterData = async () => {
      const [categoriesResult, charactersResult] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('characters').select('*').order('name')
      ])

      if (categoriesResult.data) setCategories(categoriesResult.data)
      if (charactersResult.data) setCharacters(charactersResult.data)
    }

    fetchFilterData()
  }, [])

  // Check if any filters are active
  const hasActiveFilters = searchTerm || selectedCategory || selectedSource || selectedCharacters.length > 0 || selectedStatus

  // Auto-expand filters when filters become active
  useEffect(() => {
    if (hasActiveFilters && !filtersExpanded) {
      setFiltersExpanded(true)
    }
  }, [hasActiveFilters, filtersExpanded])

  const handleCreateItem = async (itemData: Partial<Item> & { character_ids?: string[] }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { data: newItem, error } = await (supabase as any)
        .from('items')
        .insert({
          name: itemData.name!,
          type: itemData.type!,
          scene: itemData.scene,
          status: itemData.status || 'in progress',
          is_consumable: itemData.is_consumable || false,
          is_used: itemData.is_used || false,
          is_changeable: itemData.is_changeable !== undefined ? itemData.is_changeable : true,
          source: itemData.source,
          notes: itemData.notes,
          category_id: itemData.category_id,
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

        await (supabase as any)
          .from('item_characters')
          .insert(characterLinks)
      }

      // Real-time hook will automatically update the UI
    } catch (error) {
      console.error('Failed to create item:', error)
      throw error
    }
  }

  const handleEditItem = async (itemData: Partial<Item> & { character_ids?: string[] }) => {
    if (!editingItem) return

    try {
      const { error } = await (supabase as any)
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

          await (supabase as any)
            .from('item_characters')
            .insert(characterLinks)
        }
      }

      // Real-time hook will automatically update the UI
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

  const handleDeleteItem = async (itemId: string) => {
    try {
      // Get the current session token
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        alert('Nicht authentifiziert')
        return
      }

      const response = await fetch(`/api/admin/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Failed to delete item:', error)
        alert('Fehler beim Löschen des Items')
        return
      }

      // Real-time hook will automatically update the UI
    } catch (error) {
      console.error('Failed to delete item:', error)
      alert('Fehler beim Löschen des Items')
    }
  }

  // Filter items based on search term and filters
  const filteredItems = items.filter(item => {
    const matchesSearch = searchTerm === '' ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.characters?.some((char: any) => char.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = !selectedCategory || item.category_id === selectedCategory
    const matchesSource = !selectedSource || item.source === selectedSource
    const matchesCharacters = selectedCharacters.length === 0 ||
      (item.characters && item.characters.some((char: any) => selectedCharacters.includes(char.id)))
    const matchesStatus = !selectedStatus || item.status === selectedStatus

    return matchesSearch && matchesCategory && matchesSource && matchesCharacters && matchesStatus
  })

  const totalItems = items.length
  const statusCounts = items.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Calculate specific status counts
  const erhaltenCount = statusCounts['erhalten'] || 0
  const fehltCount = statusCounts['fehlt'] || 0

  // Calculate "In Arbeit" - sum of all statuses except 'erhalten' and 'fehlt'
  const inArbeitCount = Object.entries(statusCounts)
    .filter(([status]) => status !== 'erhalten' && status !== 'fehlt')
    .reduce((sum, [, count]) => sum + (count as number), 0)

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-4 space-y-4">
        <PageHeader
          title="Requisiten"
          description="Verwalte Requisiten für die Produktion"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Requisiten durchsuchen..."
          actions={
            <>
              {!filtersExpanded && (
                <Button
                  variant="outline"
                  onClick={() => setFiltersExpanded(true)}
                  className="gap-2"
                  title="Filter"
                >
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-1">
                      {[selectedCategory && 'Kategorie', selectedSource && 'Quelle',
                        selectedCharacters.length && 'Charaktere', selectedStatus && 'Status']
                        .filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={refresh}
                disabled={loading}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Aktualisieren</span>
              </Button>
              <Button
                onClick={() => {
                  setEditingItem(null)
                  setFormOpen(true)
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Neues Item</span>
              </Button>
            </>
          }
        />

        <StatsBar
          stats={[
            { label: 'Gesamt:', value: totalItems },
            { label: 'Erhalten:', value: erhaltenCount, className: 'text-green-600' },
            { label: 'Fehlt:', value: fehltCount, className: 'text-red-600' },
            { label: 'In Arbeit:', value: inArbeitCount, className: 'text-blue-600' }
          ]}
          badges={Object.entries(statusCounts).map(([status, count]) => ({
            text: `${status}: ${count}`
          }))}
        />

        {/* Filter Controls - only show when expanded */}
        {filtersExpanded && (
          <Card>
            <CardHeader>
              <CardTitle
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setFiltersExpanded(!filtersExpanded)}
              >
                <div className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5" />
                  Filter
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2">
                      {[selectedCategory && 'Kategorie', selectedSource && 'Quelle',
                        selectedCharacters.length && 'Charaktere', selectedStatus && 'Status']
                        .filter(Boolean).length} aktiv
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSearchTerm('')
                        setSelectedCategory(null)
                        setSelectedSource(null)
                        setSelectedCharacters([])
                        setSelectedStatus(null)
                      }}
                      className="gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                      Alle zurücksetzen
                    </Button>
                  )}
                  <ChevronUp className="h-5 w-5" />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Kategorie</label>
                  <Combobox
                    options={[
                      { value: 'all', label: 'Alle Kategorien' },
                      ...categories.map(cat => ({ value: cat.id, label: cat.name }))
                    ]}
                    value={selectedCategory || 'all'}
                    onValueChange={(value) => setSelectedCategory(value === 'all' ? null : value)}
                    placeholder="Alle Kategorien"
                    searchPlaceholder="Kategorie suchen..."
                    emptyText="Keine Kategorie gefunden."
                  />
                </div>

                {/* Source Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Quelle</label>
                  <Combobox
                    options={[
                      { value: 'all', label: 'Alle Quellen' },
                      ...Array.from(new Set(items.map(i => i.source).filter(Boolean)))
                        .map(source => ({ value: source!, label: source! }))
                    ]}
                    value={selectedSource || 'all'}
                    onValueChange={(value) => setSelectedSource(value === 'all' ? null : value)}
                    placeholder="Alle Quellen"
                    searchPlaceholder="Quelle suchen..."
                    emptyText="Keine Quelle gefunden."
                  />
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Combobox
                    options={[
                      { value: 'all', label: 'Alle Status' },
                      ...Array.from(new Set(items.map(i => i.status)))
                        .map(status => ({ value: status, label: status }))
                    ]}
                    value={selectedStatus || 'all'}
                    onValueChange={(value) => setSelectedStatus(value === 'all' ? null : value)}
                    placeholder="Alle Status"
                    searchPlaceholder="Status suchen..."
                    emptyText="Kein Status gefunden."
                  />
                </div>

                {/* Characters Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Charaktere</label>
                  <MultiSelect
                    options={characters.map(char => ({
                      value: char.id,
                      label: char.name,
                      color: char.color
                    }))}
                    selected={selectedCharacters}
                    onChange={setSelectedCharacters}
                    placeholder="Alle Charaktere"
                    emptyText="Keine Charaktere gefunden."
                  />
                </div>
              </div>

              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <span className="text-sm text-muted-foreground">Aktive Filter:</span>
                  {selectedCategory && (
                    <Badge variant="secondary" className="gap-1">
                      {categories.find(c => c.id === selectedCategory)?.name}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedCategory(null)}
                      />
                    </Badge>
                  )}
                  {selectedSource && (
                    <Badge variant="secondary" className="gap-1">
                      {selectedSource}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedSource(null)}
                      />
                    </Badge>
                  )}
                  {selectedStatus && (
                    <Badge variant="secondary" className="gap-1">
                      {selectedStatus}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSelectedStatus(null)}
                      />
                    </Badge>
                  )}
                  {selectedCharacters.map(charId => {
                    const char = characters.find(c => c.id === charId)
                    return char ? (
                      <Badge key={charId} variant="secondary" className="gap-1">
                        {char.name}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => setSelectedCharacters(prev => prev.filter(id => id !== charId))}
                        />
                      </Badge>
                    ) : null
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Active Filters Summary (shown when collapsed) */}
        {!filtersExpanded && hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 py-1">
            <span className="text-sm text-muted-foreground">Aktive Filter:</span>
            {selectedCategory && (
              <Badge variant="secondary" className="gap-1">
                {categories.find(c => c.id === selectedCategory)?.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedCategory(null)}
                />
              </Badge>
            )}
            {selectedSource && (
              <Badge variant="secondary" className="gap-1">
                {selectedSource}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedSource(null)}
                />
              </Badge>
            )}
            {selectedStatus && (
              <Badge variant="secondary" className="gap-1">
                {selectedStatus}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => setSelectedStatus(null)}
                />
              </Badge>
            )}
            {selectedCharacters.map(charId => {
              const char = characters.find(c => c.id === charId)
              return char ? (
                <Badge key={charId} variant="secondary" className="gap-1">
                  {char.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => setSelectedCharacters(prev => prev.filter(id => id !== charId))}
                  />
                </Badge>
              ) : null
            })}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory(null)
                setSelectedSource(null)
                setSelectedCharacters([])
                setSelectedStatus(null)
              }}
              className="gap-2 h-6 text-xs"
            >
              <X className="h-3 w-3" />
              Alle zurücksetzen
            </Button>
          </div>
        )}

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
                onClick={refresh}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Erneut versuchen</span>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Items Table */}
        {!loading && !error && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Alle Requisiten</span>
                <span className="text-sm font-normal text-muted-foreground">
                  {searchTerm ? `${filteredItems.length} von ${totalItems}` : totalItems} Requisiten
                </span>
              </CardTitle>
              <CardDescription>
                Klicke auf die Spaltenüberschriften zum Sortieren oder auf eine Zeile für Details
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredItems.length > 0 ? (
                <ItemsTable
                  items={filteredItems}
                  onEditItem={openEditForm}
                  onDeleteItem={handleDeleteItem}
                  sortField={sortField}
                  sortDirection={sortDirection}
                  onSortChange={(field, direction) => {
                    setSortField(field)
                    setSortDirection(direction)
                  }}
                />
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
                    <span className="hidden sm:inline">Erstes Item erstellen</span>
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