'use client'

import { useState } from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { Navigation } from '@/components/layout/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { todoImporter } from '@/lib/import-todos'
import { Upload, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface ImportResult {
  success: number
  failed: number
  errors: string[]
}

export default function ImportPage() {
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [progress, setProgress] = useState(0)

  const importDraculaTodos = async () => {
    setImporting(true)
    setResult(null)
    setProgress(0)

    try {
      // Read the markdown file
      const response = await fetch('/api/import/dracula-todos')
      if (!response.ok) {
        throw new Error('Failed to load todos file')
      }

      const markdownContent = await response.text()

      setProgress(20)

      // Import todos
      const importResult = await todoImporter.importTodos(markdownContent)

      setProgress(100)
      setResult(importResult)

    } catch (error) {
      console.error('Import failed:', error)
      setResult({
        success: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setImporting(false)
    }
  }

  const importFromTextarea = async (content: string) => {
    if (!content.trim()) {
      return
    }

    setImporting(true)
    setResult(null)
    setProgress(0)

    try {
      setProgress(20)
      const importResult = await todoImporter.importTodos(content)
      setProgress(100)
      setResult(importResult)
    } catch (error) {
      console.error('Import failed:', error)
      setResult({
        success: 0,
        failed: 1,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      })
    } finally {
      setImporting(false)
    }
  }

  return (
    <ProtectedRoute>
      <Navigation />
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daten Import</h1>
            <p className="text-muted-foreground">
              Import von Todo-Listen und Daten aus CSV und Markdown Dateien
            </p>
          </div>
        </div>

        {/* Import Dracula Todos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Dracula Todos importieren
            </CardTitle>
            <CardDescription>
              Importiert die Todo-Liste aus dracula_todos_with_tags.md mit Tags und Zuweisungen
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-4">
              <Button
                onClick={importDraculaTodos}
                disabled={importing}
                className="gap-2 w-fit"
              >
                <Upload className="h-4 w-4" />
                {importing ? 'Importiere...' : 'Dracula Todos importieren'}
              </Button>

              {importing && (
                <div className="space-y-2">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">Import läuft...</p>
                </div>
              )}

              {result && (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="gap-1 bg-green-50 text-green-700">
                      <CheckCircle className="h-3 w-3" />
                      {result.success} erfolgreich
                    </Badge>
                    {result.failed > 0 && (
                      <Badge variant="outline" className="gap-1 bg-red-50 text-red-700">
                        <XCircle className="h-3 w-3" />
                        {result.failed} fehlgeschlagen
                      </Badge>
                    )}
                  </div>

                  {result.errors.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium flex items-center gap-2 text-red-700">
                        <AlertCircle className="h-4 w-4" />
                        Fehler beim Import
                      </h4>
                      <div className="bg-red-50 border border-red-200 rounded p-3 max-h-48 overflow-y-auto">
                        {result.errors.map((error, index) => (
                          <div key={index} className="text-sm text-red-800 mb-1">
                            {error}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Manual Import from Text */}
        <Card>
          <CardHeader>
            <CardTitle>Manueller Text Import</CardTitle>
            <CardDescription>
              Füge Markdown-formatierte Todos hier ein zum direkten Import
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ImportTextarea onImport={importFromTextarea} importing={importing} />
          </CardContent>
        </Card>

        {/* Import Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Import Format</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Unterstützte Markdown-Syntax:</h4>
              <div className="bg-gray-50 p-4 rounded-md font-mono text-sm space-y-1">
                <div>## Sektion</div>
                <div>### Untersektion</div>
                <div>- [ ] Todo Item `#tag1 #tag2 #person`</div>
                <div>- [x] Erledigtes Todo `#tag1 #tag2`</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Tag-Kategorien:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <strong>Personen:</strong>
                  <div className="text-muted-foreground">#liza, #tanja, #werner-d, #werner-k, #elisa</div>
                </div>
                <div>
                  <strong>Abteilungen:</strong>
                  <div className="text-muted-foreground">#kostüme, #props, #technik, #administrative</div>
                </div>
                <div>
                  <strong>Priorität:</strong>
                  <div className="text-muted-foreground">#dringend, #wichtig</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}

interface ImportTextareaProps {
  onImport: (content: string) => void
  importing: boolean
}

function ImportTextarea({ onImport, importing }: ImportTextareaProps) {
  const [content, setContent] = useState('')

  const handleImport = () => {
    onImport(content)
    setContent('')
  }

  return (
    <div className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Füge hier deine Markdown-formatierte Todo-Liste ein..."
        className="w-full h-40 p-3 border rounded-md font-mono text-sm resize-none"
        disabled={importing}
      />
      <Button
        onClick={handleImport}
        disabled={importing || !content.trim()}
        className="gap-2"
      >
        <Upload className="h-4 w-4" />
        Text importieren
      </Button>
    </div>
  )
}