'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Upload, X, FileImage, File, AlertCircle } from 'lucide-react'
import type { ItemFile } from '@/types'

interface FileUploadProps {
  itemId: string
  existingFiles?: ItemFile[]
  onFileUploaded?: (file: ItemFile) => void
  onFileDeleted?: (fileId: string) => void
  maxFiles?: number
  maxSizeMB?: number
  acceptedTypes?: string[]
}

export function FileUpload({
  itemId,
  existingFiles = [],
  onFileUploaded,
  onFileDeleted,
  maxFiles = 10,
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const uploadFile = useCallback(async (file: File): Promise<ItemFile | null> => {
    try {
      // Check file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        throw new Error(`Datei ist zu groß. Maximum: ${maxSizeMB}MB`)
      }

      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        throw new Error('Dateityp wird nicht unterstützt')
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `items/${itemId}/${fileName}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('attachments')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()

      // Save file record to database
      const { data: fileRecord, error: dbError } = await supabase
        .from('item_files')
        .insert({
          item_id: itemId,
          file_name: file.name,
          file_path: filePath,
          file_type: file.type,
          file_size: file.size,
          uploaded_by: user?.id
        })
        .select()
        .single()

      if (dbError) {
        // Clean up uploaded file if database insert fails
        await supabase.storage.from('attachments').remove([filePath])
        throw dbError
      }

      return fileRecord
    } catch (error) {
      console.error('File upload error:', error)
      throw error
    }
  }, [itemId, maxSizeMB, acceptedTypes])

  const deleteFile = async (fileId: string, filePath: string) => {
    try {
      // Delete from database
      const { error: dbError } = await supabase
        .from('item_files')
        .delete()
        .eq('id', fileId)

      if (dbError) throw dbError

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('attachments')
        .remove([filePath])

      if (storageError) {
        console.warn('Failed to delete file from storage:', storageError)
      }

      if (onFileDeleted) {
        onFileDeleted(fileId)
      }
    } catch (error) {
      console.error('File deletion error:', error)
      setError('Fehler beim Löschen der Datei')
    }
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (existingFiles.length + acceptedFiles.length > maxFiles) {
      setError(`Maximum ${maxFiles} Dateien erlaubt`)
      return
    }

    setUploading(true)
    setError(null)

    try {
      for (const file of acceptedFiles) {
        const uploadedFile = await uploadFile(file)
        if (uploadedFile && onFileUploaded) {
          onFileUploaded(uploadedFile)
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload fehlgeschlagen')
    } finally {
      setUploading(false)
    }
  }, [existingFiles.length, maxFiles, onFileUploaded, uploadFile])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      acc[type] = []
      return acc
    }, {} as Record<string, string[]>),
    maxFiles: maxFiles - existingFiles.length,
    disabled: uploading || existingFiles.length >= maxFiles
  })

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) {
      return <FileImage className="h-4 w-4" />
    }
    return <File className="h-4 w-4" />
  }

  const getFileUrl = (filePath: string) => {
    const { data } = supabase.storage
      .from('attachments')
      .getPublicUrl(filePath)
    return data.publicUrl
  }

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {existingFiles.length < maxFiles && (
        <Card>
          <CardContent className="p-4">
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                ${isDragActive
                  ? 'border-blue-400 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
                }
                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <input {...getInputProps()} />
              <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              {uploading ? (
                <p className="text-sm text-gray-600">Wird hochgeladen...</p>
              ) : isDragActive ? (
                <p className="text-sm text-blue-600">Dateien hier ablegen...</p>
              ) : (
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Dateien hierhin ziehen oder klicken zum Auswählen
                  </p>
                  <p className="text-xs text-gray-500">
                    Max. {maxSizeMB}MB pro Datei, {maxFiles - existingFiles.length} Dateien verbleibend
                  </p>
                  <div className="flex flex-wrap gap-1 justify-center">
                    <Badge variant="outline" className="text-xs">JPG</Badge>
                    <Badge variant="outline" className="text-xs">PNG</Badge>
                    <Badge variant="outline" className="text-xs">WebP</Badge>
                    <Badge variant="outline" className="text-xs">PDF</Badge>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Angehängte Dateien ({existingFiles.length})</h4>
          <div className="grid grid-cols-1 gap-2">
            {existingFiles.map((file) => (
              <Card key={file.id} className="p-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {getFileIcon(file.file_type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {file.file_name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatFileSize(file.file_size || 0)}</span>
                        <span>•</span>
                        <span>{new Date(file.created_at).toLocaleDateString('de-DE')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {file.file_type.startsWith('image/') && (
                      <a
                        href={getFileUrl(file.file_path)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Anzeigen
                      </a>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteFile(file.id, file.file_path)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-800"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}