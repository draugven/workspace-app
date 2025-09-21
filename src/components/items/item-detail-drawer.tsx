'use client'

import { useState, useEffect } from 'react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { FileUpload } from '@/components/files/file-upload'
import { supabase } from '@/lib/supabase'
import {
  Calendar,
  User,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  Package,
  FileImage,
  Edit
} from 'lucide-react'
import type { Item, ItemFile } from '@/types'

interface ItemDetailDrawerProps {
  item: Item | null
  open: boolean
  onClose: () => void
  onEdit?: (item: Item) => void
}

export function ItemDetailDrawer({ item, open, onClose, onEdit }: ItemDetailDrawerProps) {
  const [files, setFiles] = useState<ItemFile[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (item && open) {
      loadFiles()
    }
  }, [item?.id, open])

  const loadFiles = async () => {
    if (!item) return

    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('item_files')
        .select('*')
        .eq('item_id', item.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setFiles(data || [])
    } catch (error) {
      console.error('Error loading files:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUploaded = (newFile: ItemFile) => {
    setFiles(prev => [newFile, ...prev])
  }

  const handleFileDeleted = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'erhalten':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in progress':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'klären':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case 'verloren':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'erhalten':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'bestellt':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'klären':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'verloren':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'reparatur benötigt':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'anpassung benötigt':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (!item) return null

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <SheetTitle className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                {item.name}
              </SheetTitle>
              <SheetDescription>
                {item.type === 'prop' ? 'Requisite' : 'Kostüm'} •
                {item.category?.name && ` ${item.category.name}`}
              </SheetDescription>
            </div>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(item)}
                className="gap-2"
              >
                <Edit className="h-4 w-4" />
                Bearbeiten
              </Button>
            )}
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status and Basic Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Typ</label>
                  <p className="text-sm text-gray-900 mt-1">
                    {item.type === 'prop' ? 'Requisite' : 'Kostüm'}
                  </p>
                </div>

                {item.scene && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Szene</label>
                    <p className="text-sm text-gray-900 mt-1">{item.scene}</p>
                  </div>
                )}

                {item.source && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Quelle</label>
                    <p className="text-sm text-gray-900 mt-1">{item.source}</p>
                  </div>
                )}
              </div>

              {/* Flags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Eigenschaften</label>
                <div className="flex flex-wrap gap-2">
                  {item.is_consumable && (
                    <Badge variant="outline">Verbrauchsgegenstand</Badge>
                  )}
                  {item.needs_clarification && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      Klärung erforderlich
                    </Badge>
                  )}
                  {item.needed_for_rehearsal && (
                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                      Für Probe benötigt
                    </Badge>
                  )}
                </div>
              </div>

              {/* Characters */}
              {item.characters && item.characters.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Charaktere</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.characters.map((character) => (
                      <Badge key={character.id} variant="secondary">
                        {character.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {item.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notizen</label>
                  <p className="text-sm text-gray-900 mt-1 p-3 bg-gray-50 rounded-md">
                    {item.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Metadaten</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-700">Erstellt:</span>{' '}
                    {new Date(item.created_at).toLocaleDateString('de-DE')}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-700">Geändert:</span>{' '}
                    {new Date(item.updated_at).toLocaleDateString('de-DE')}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* File Attachments */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileImage className="h-5 w-5" />
                Dateien & Bilder
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">
                  <div className="text-sm text-gray-600">Dateien werden geladen...</div>
                </div>
              ) : (
                <FileUpload
                  itemId={item.id}
                  existingFiles={files}
                  onFileUploaded={handleFileUploaded}
                  onFileDeleted={handleFileDeleted}
                  maxFiles={10}
                  maxSizeMB={5}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}