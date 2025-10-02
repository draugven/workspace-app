'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Save,
  Link as LinkIcon
} from 'lucide-react'

export interface TiptapEditorProps {
  content: string
  onChange: (content: string) => void
  onSave: () => void
  isLocked?: boolean
  lockedBy?: string
  placeholder?: string
}

export function TiptapEditor({
  content,
  onChange,
  onSave,
  isLocked,
  lockedBy,
  placeholder = "Schreibe deine Notizen hier..."
}: TiptapEditorProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-outside ml-4',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-outside ml-4',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'mb-1',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-border pl-4 italic',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-muted p-2 rounded font-mono text-sm',
          },
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/80 cursor-pointer',
        },
      }),
    ],
    content,
    editable: !isLocked,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 border border-border bg-background text-foreground rounded-md [&_h1]:!text-2xl [&_h1]:!font-bold [&_h2]:!text-xl [&_h2]:!font-bold [&_h3]:!text-lg [&_h3]:!font-bold [&_h1]:!mt-4 [&_h1]:!mb-2 [&_h2]:!mt-4 [&_h2]:!mb-2 [&_h3]:!mt-4 [&_h3]:!mb-2',
      },
      handleKeyDown: (view, event) => {
        // Handle Cmd+K (Mac) or Ctrl+K (Windows/Linux) for link dialog
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
          event.preventDefault()
          handleSetLink()
          return true
        }
        return false
      },
    },
  })

  // Update content when it changes externally (without breaking focus)
  useEffect(() => {
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content, false)
    }
  }, [editor, content])

  // Update editable state when lock status changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isLocked)
    }
  }, [editor, isLocked])

  // Helper functions for link management
  const handleSetLink = () => {
    if (!editor) return

    const previousUrl = editor.getAttributes('link').href || ''
    setLinkUrl(previousUrl)
    setIsLinkDialogOpen(true)
  }

  const handleConfirmLink = () => {
    if (!editor) return

    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run()
    }

    setIsLinkDialogOpen(false)
    setLinkUrl('')
  }

  const handleCancelLink = () => {
    setIsLinkDialogOpen(false)
    setLinkUrl('')
  }

  if (!editor) {
    return null
  }

  const toolbarButtons = [
    {
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive('bold'),
      icon: Bold,
      tooltip: 'Fett (Strg+B)'
    },
    {
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive('italic'),
      icon: Italic,
      tooltip: 'Kursiv (Strg+I)'
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: editor.isActive('heading', { level: 1 }),
      icon: Heading1,
      tooltip: 'Überschrift 1'
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: editor.isActive('heading', { level: 2 }),
      icon: Heading2,
      tooltip: 'Überschrift 2'
    },
    {
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: editor.isActive('heading', { level: 3 }),
      icon: Heading3,
      tooltip: 'Überschrift 3'
    },
    {
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive('bulletList'),
      icon: List,
      tooltip: 'Aufzählungsliste'
    },
    {
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive('orderedList'),
      icon: ListOrdered,
      tooltip: 'Nummerierte Liste'
    },
    {
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive('blockquote'),
      icon: Quote,
      tooltip: 'Zitat'
    },
    {
      action: () => editor.chain().focus().toggleCodeBlock().run(),
      isActive: editor.isActive('codeBlock'),
      icon: Code,
      tooltip: 'Codeblock'
    },
    {
      action: handleSetLink,
      isActive: editor.isActive('link'),
      icon: LinkIcon,
      tooltip: 'Link hinzufügen/bearbeiten (Strg+K)'
    }
  ]

  return (
    <div className="space-y-2">
      {/* Conflict Warning */}
      {isLocked && lockedBy && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200 text-sm">
            <span className="font-medium">⚠️ Konflikt-Warnung:</span>
            <span>Wird gerade von {lockedBy} bearbeitet</span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border border-border rounded-md bg-muted/30">
        {toolbarButtons.map((button, index) => {
          const Icon = button.icon
          return (
            <Button
              key={index}
              variant={button.isActive ? "default" : "ghost"}
              size="sm"
              onClick={button.action}
              disabled={isLocked}
              title={button.tooltip}
              className="h-8 w-8 p-0"
            >
              <Icon className="h-4 w-4" />
            </Button>
          )
        })}

        <div className="w-px h-6 bg-border mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo() || isLocked}
          title="Rückgängig (Strg+Z)"
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo() || isLocked}
          title="Wiederholen (Strg+Y)"
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>

        <div className="flex-1" />

        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={isLocked}
          className="gap-2 hidden sm:flex"
        >
          <Save className="h-4 w-4" />
          Speichern
        </Button>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent
          editor={editor}
          className={isLocked ? 'opacity-60' : ''}
        />
        {editor.isEmpty && (
          <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Status Bar */}
      {isLocked && (
        <div className="flex justify-end text-xs text-muted-foreground">
          <span className="text-yellow-600 dark:text-yellow-400">Schreibgeschützt</span>
        </div>
      )}

      {/* Link Dialog */}
      {isLinkDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 w-96 max-w-[90vw] shadow-lg">
            <h3 className="text-lg font-medium mb-4 text-foreground">Link bearbeiten</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="link-url" className="block text-sm font-medium text-foreground mb-1">
                  URL
                </label>
                <input
                  id="link-url"
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-border bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelLink}
                >
                  Abbrechen
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleConfirmLink}
                >
                  {linkUrl ? 'Link setzen' : 'Link entfernen'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}