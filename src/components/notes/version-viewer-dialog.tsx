'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, RotateCcw, FileText } from 'lucide-react'
import type { NoteVersion } from '@/types'

interface VersionViewerDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  version: NoteVersion | null
  onBack: () => void
  onRestore: (versionId: string) => void
  isCurrentVersion?: boolean
}

export function VersionViewerDialog({
  open,
  onOpenChange,
  version,
  onBack,
  onRestore,
  isCurrentVersion = false
}: VersionViewerDialogProps) {
  const [restoring, setRestoring] = useState(false)

  if (!version) return null

  const handleRestore = async () => {
    setRestoring(true)
    try {
      await onRestore(version.id)
      onOpenChange(false)
    } finally {
      setRestoring(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:w-full max-w-3xl max-h-[80vh] sm:max-h-[80vh] h-[90vh] sm:h-auto flex flex-col p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
            Version {version.version_number}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 flex-wrap text-sm">
            <span>{formatDate(version.created_at)}</span>
            {isCurrentVersion && (
              <Badge variant="secondary" className="text-xs">Aktuelle Version</Badge>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto -mx-4 sm:mx-0">
          {version.content_html ? (
            <div
              className="prose prose-sm max-w-none p-4 sm:border sm:rounded-md sm:bg-muted/20"
              dangerouslySetInnerHTML={{ __html: version.content_html }}
            />
          ) : (
            <div className="p-4 sm:border sm:rounded-md sm:bg-muted/20 whitespace-pre-wrap text-sm">
              {version.content}
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="gap-2 w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Zurück zur Historie</span>
            <span className="sm:hidden">Zurück</span>
          </Button>

          {!isCurrentVersion && (
            <Button
              onClick={handleRestore}
              disabled={restoring}
              className="gap-2 w-full sm:w-auto"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">{restoring ? 'Wird wiederhergestellt...' : 'Diese Version wiederherstellen'}</span>
              <span className="sm:hidden">{restoring ? 'Lädt...' : 'Wiederherstellen'}</span>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
