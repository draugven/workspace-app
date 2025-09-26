'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { supabase } from '@/lib/supabase'
import type { Item, Category, Character } from '@/types'

interface ItemFormProps {
  open: boolean
  onClose: () => void
  onSave: (item: Partial<Item>) => void
  editingItem?: Item | null
}

export function ItemForm({ open, onClose, onSave, editingItem }: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'prop' as 'prop' | 'costume',
    scene: '',
    status: 'klären' as Item['status'],
    is_consumable: false,
    needs_clarification: false,
    needed_for_rehearsal: false,
    source: 'none' as Item['source'],
    notes: '',
    category_id: 'none',
    character_ids: [] as string[]
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // Load categories and characters
  useEffect(() => {
    if (open) {
      loadFormData()
    }
  }, [open])

  // Populate form when editing
  useEffect(() => {
    if (editingItem) {
      setFormData({
        name: editingItem.name,
        type: editingItem.type,
        scene: editingItem.scene || '',
        status: editingItem.status,
        is_consumable: editingItem.is_consumable,
        needs_clarification: editingItem.needs_clarification,
        needed_for_rehearsal: editingItem.needed_for_rehearsal,
        source: editingItem.source || 'none',
        notes: editingItem.notes || '',
        category_id: editingItem.category_id || 'none',
        character_ids: editingItem.characters?.map(c => c.id) || []
      })
    } else {
      // Reset form for new item
      setFormData({
        name: '',
        type: 'prop',
        scene: '',
        status: 'klären',
        is_consumable: false,
        needs_clarification: false,
        needed_for_rehearsal: false,
        source: 'none',
        notes: '',
        category_id: 'none',
        character_ids: []
      })
    }
  }, [editingItem, open])

  const loadFormData = async () => {
    setLoading(true)
    try {
      // Load categories
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      // Load characters
      const { data: charactersData } = await supabase
        .from('characters')
        .select('*')
        .order('name')

      setCategories(categoriesData || [])
      setCharacters(charactersData || [])
    } catch (error) {
      console.error('Failed to load form data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      return
    }

    setSaving(true)
    try {
      const itemData: Partial<Item> & { character_ids?: string[] } = {
        ...formData,
        name: formData.name.trim(),
        scene: formData.scene.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        source: formData.source === 'none' ? undefined : formData.source,
        category_id: formData.category_id === 'none' ? undefined : formData.category_id,
        character_ids: formData.character_ids
      }

      await onSave(itemData)
      onClose()
    } catch (error) {
      console.error('Failed to save item:', error)
    } finally {
      setSaving(false)
    }
  }

  const statusOptions = [
    { value: 'erhalten', label: 'Erhalten' },
    { value: 'in progress', label: 'In Progress' },
    { value: 'bestellt', label: 'Bestellt' },
    { value: 'verloren', label: 'Verloren' },
    { value: 'klären', label: 'Klären' },
    { value: 'reparatur benötigt', label: 'Reparatur benötigt' },
    { value: 'anpassung benötigt', label: 'Anpassung benötigt' }
  ]

  const sourceOptions = [
    { value: 'Staatstheater', label: 'Staatstheater' },
    { value: 'Gekauft', label: 'Gekauft' },
    { value: 'Produziert', label: 'Produziert' },
    { value: 'Darsteller*in', label: 'Darsteller*in' }
  ]

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Item bearbeiten' : 'Neues Item erstellen'}
          </DialogTitle>
          <DialogDescription>
            {editingItem
              ? 'Bearbeite die Details des Items'
              : 'Erstelle ein neues Requisit oder Kostüm für die Produktion'
            }
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="p-4 text-center">Lade Formulardaten...</div>
        ) : (
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="z.B. Gladstone-Koffer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Typ</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as 'prop' | 'costume' }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prop">Requisit</SelectItem>
                    <SelectItem value="costume">Kostüm</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scene">Szene</Label>
                <Input
                  id="scene"
                  value={formData.scene}
                  onChange={(e) => setFormData(prev => ({ ...prev, scene: e.target.value }))}
                  placeholder="z.B. 1, 2a, Finale"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as Item['status'] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Kategorie</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategorie auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keine Kategorie</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Quelle</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, source: value as Item['source'] }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Quelle auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Keine Angabe</SelectItem>
                    {sourceOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Flags */}
            <div className="space-y-4">
              <Label>Eigenschaften</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="consumable"
                    checked={formData.is_consumable}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_consumable: checked }))}
                  />
                  <Label htmlFor="consumable" className="text-sm">
                    Verbrauchsgegenstand
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="clarification"
                    checked={formData.needs_clarification}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, needs_clarification: checked }))}
                  />
                  <Label htmlFor="clarification" className="text-sm">
                    Klärung erforderlich
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="rehearsal"
                    checked={formData.needed_for_rehearsal}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, needed_for_rehearsal: checked }))}
                  />
                  <Label htmlFor="rehearsal" className="text-sm">
                    Für Probe benötigt
                  </Label>
                </div>
              </div>
            </div>

            {/* Characters */}
            <div className="space-y-2">
              <Label>Charaktere</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-32 overflow-y-auto border rounded p-2">
                {characters.map((character) => (
                  <div key={character.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`char-${character.id}`}
                      checked={formData.character_ids.includes(character.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            character_ids: [...prev.character_ids, character.id]
                          }))
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            character_ids: prev.character_ids.filter(id => id !== character.id)
                          }))
                        }
                      }}
                      className="rounded"
                    />
                    <Label htmlFor={`char-${character.id}`} className="text-sm">
                      {character.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notizen</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Zusätzliche Informationen..."
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button variant="outline" onClick={onClose} disabled={saving}>
                Abbrechen
              </Button>
              <Button onClick={handleSave} disabled={saving || !formData.name.trim()}>
                {saving ? 'Speichere...' : editingItem ? 'Speichern' : 'Erstellen'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}