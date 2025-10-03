'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { History, Eye, RotateCcw, Clock } from 'lucide-react'
import type { Note, NoteVersion } from '@/types'

interface VersionHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  note: Note
  onViewVersion: (version: NoteVersion) => void
  onRestoreVersion: (versionId: string) => void
}

export function VersionHistoryDialog({
  open,
  onOpenChange,
  note,
  onViewVersion,
  onRestoreVersion
}: VersionHistoryDialogProps) {
  const versions = note.versions || []
  const [restoringId, setRestoringId] = useState<string | null>(null)

  const handleRestore = async (versionId: string) => {
    setRestoringId(versionId)
    try {
      await onRestoreVersion(versionId)
    } finally {
      setRestoringId(null)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Gerade eben'
    if (diffMins < 60) return `vor ${diffMins} Min`
    if (diffHours < 24) return `vor ${diffHours} Std`
    if (diffDays < 7) return `vor ${diffDays} Tagen`

    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getContentPreview = (content: string) => {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ')
    return plainText.length > 100 ? plainText.substring(0, 100) + '...' : plainText
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:w-full max-w-2xl max-h-[80vh] sm:max-h-[80vh] h-[90vh] sm:h-auto flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <History className="h-4 w-4 sm:h-5 sm:w-5" />
            Versionshistorie
          </DialogTitle>
          <DialogDescription className="text-sm">
            {note.title} · {versions.length} {versions.length === 1 ? 'Version' : 'Versionen'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 sm:pr-4 -mr-2 sm:-mr-4">
          {versions.length === 0 ? (
            <Card>
              <CardContent className="py-6 text-center text-muted-foreground">
                Keine Versionen vorhanden
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {versions
                .sort((a, b) => b.version_number - a.version_number)
                .map((version, index) => (
                  <Card key={version.id} className="hover:bg-accent/50 transition-colors">
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge variant={index === 0 ? "default" : "outline"} className="text-xs">
                              Version {version.version_number}
                            </Badge>
                            {index === 0 && (
                              <Badge variant="secondary" className="gap-1 text-xs">
                                <Clock className="h-3 w-3" />
                                <span className="hidden sm:inline">Aktuell</span>
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                            {formatDate(version.created_at)}
                          </p>
                          <p className="text-xs sm:text-sm line-clamp-2">
                            {getContentPreview(version.content)}
                          </p>
                        </div>

                        <div className="flex sm:flex-col gap-2 flex-row">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewVersion(version)}
                            className="gap-2 flex-1 sm:flex-none"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">Ansehen</span>
                          </Button>
                          {index !== 0 && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestore(version.id)}
                              disabled={restoringId === version.id}
                              className="gap-2 flex-1 sm:flex-none"
                            >
                              <RotateCcw className="h-4 w-4" />
                              <span className="hidden sm:inline">{restoringId === version.id ? 'Lädt...' : 'Wiederherstellen'}</span>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
