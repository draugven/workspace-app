'use client'

import { useState, useEffect, useCallback } from 'react'
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
  Edit,
  Trash2
} from 'lucide-react'
import { useAuth } from '@/components/auth/auth-provider'
import { getBadgeStyle } from '@/lib/color-utils'
import type { Item, ItemFile } from '@/types'

interface ItemDetailDrawerProps {
  item: Item | null
  open: boolean
  onClose: () => void
  onEdit?: (item: Item) => void
  onDelete?: (itemId: string) => void
}

export function ItemDetailDrawer({ item, open, onClose, onEdit, onDelete }: ItemDetailDrawerProps) {
  const [files, setFiles] = useState<ItemFile[]>([])
  const [loading, setLoading] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { isAdmin } = useAuth()

  const loadFiles = useCallback(async () => {
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
  }, [item])

  useEffect(() => {
    if (item && open) {
      loadFiles()
    }
  }, [item, open, loadFiles])

  const handleFileUploaded = (newFile: ItemFile) => {
    setFiles(prev => [newFile, ...prev])
  }

  const handleFileDeleted = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId))
  }

  const handleDelete = async () => {
    if (onDelete && item && showDeleteConfirm) {
      await onDelete(item.id)
      onClose()
      setShowDeleteConfirm(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'erhalten':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in progress':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'klären':
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case 'fehlt':
        return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'bestellt':
        return <Clock className="h-4 w-4 text-blue-600" />
      case 'reparatur':
        return <AlertCircle className="h-4 w-4 text-purple-600" />
      case 'anpassung':
        return <AlertCircle className="h-4 w-4 text-indigo-600" />
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
      case 'fehlt':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'reparatur':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'anpassung':
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
              <SheetDescription className="text-left">
                {item.type === 'prop' ? 'Requisite' : 'Kostüm'} •
                {item.category?.name && ` ${item.category.name}`}
              </SheetDescription>
            </div>
            <div className="flex gap-2 mr-4">
              {onEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(item)}
                  className="gap-2"
                >
                  <Edit className="h-4 w-4" />
                  <span className="hidden sm:inline">Bearbeiten</span>
                </Button>
              )}

              {/* Admin delete button */}
              {isAdmin && onDelete && (
                showDeleteConfirm ? (
                  <div className="flex gap-1">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                      className="gap-1 text-xs"
                    >
                      Bestätigen
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="gap-1 text-xs"
                    >
                      Abbrechen
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    title="Als Admin löschen"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Löschen</span>
                  </Button>
                )
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Status and Basic Info */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-3">
                <div>
                  <label className="text-sm font-medium text-foreground/70 dark:text-foreground/80">Status</label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                </div>

                {item.source && (
                  <div>
                    <label className="text-sm font-medium text-foreground/70 dark:text-foreground/80">Quelle</label>
                    <p className="text-sm mt-1">{item.source}</p>
                  </div>
                )}

                {item.scene && (
                  <div>
                    <label className="text-sm font-medium text-foreground/70 dark:text-foreground/80">Szene</label>
                    <p className="text-sm mt-1">{item.scene}</p>
                  </div>
                )}

                {/* Characters */}
                {item.characters && item.characters.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-foreground/70 dark:text-foreground/80">Charaktere</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {item.characters.map((character) => {
                        const badgeStyle = getBadgeStyle(character.color);
                        return (
                          <Badge
                            key={character.id}
                            variant="secondary"
                            style={badgeStyle}
                          >
                            {character.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Flags */}
                <div>
                  <label className="text-sm font-medium text-foreground/70 dark:text-foreground/80">Eigenschaften</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.is_consumable && (
                      <Badge variant="outline">Verbrauchsgegenstand</Badge>
                    )}
                    {item.is_used && (
                      <Badge variant="outline" className="text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600">
                        Benutzt
                      </Badge>
                    )}
                    {(item.source === 'Staatstheater' || item.source === 'Ausleihe') && (
                      <>
                        {item.is_changeable && (
                          <Badge variant="outline" className="text-green-600 dark:text-green-400 border-green-300 dark:border-green-600">
                            Änderbar
                          </Badge>
                        )}
                        {!item.is_changeable && (
                          <Badge variant="outline" className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-600">
                            Nicht änderbar
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {item.notes && (
                <div>
                  <label className="text-sm font-medium text-foreground/70 dark:text-foreground/80">Notizen</label>
                  <p className="text-sm mt-1 p-2.5 bg-muted/50 rounded-md">
                    {item.notes}
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-2 border-t">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-foreground/70 dark:text-foreground/80">Erstellt:</span>{' '}
                      {new Date(item.created_at).toLocaleDateString('de-DE')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <span className="text-foreground/70 dark:text-foreground/80">Geändert:</span>{' '}
                      {new Date(item.updated_at).toLocaleDateString('de-DE')}
                    </div>
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