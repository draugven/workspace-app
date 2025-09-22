'use client'

import { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
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
  Save
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
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: 'list-disc list-inside',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'list-decimal list-inside',
          },
        },
        blockquote: {
          HTMLAttributes: {
            class: 'border-l-4 border-gray-300 pl-4 italic',
          },
        },
        codeBlock: {
          HTMLAttributes: {
            class: 'bg-gray-100 p-2 rounded font-mono text-sm',
          },
        },
      }),
    ],
    content,
    editable: !isLocked,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 border rounded-md',
      },
    },
  }, [content, onChange, isLocked])

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
    }
  ]

  return (
    <div className="space-y-2">
      {/* Conflict Warning */}
      {isLocked && lockedBy && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
          <div className="flex items-center gap-2 text-yellow-800 text-sm">
            <span className="font-medium">⚠️ Konflikt-Warnung:</span>
            <span>Wird gerade von {lockedBy} bearbeitet</span>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border rounded-md bg-gray-50">
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

        <div className="w-px h-6 bg-gray-300 mx-2" />

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
          className="gap-2"
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
          <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {editor.storage.characterCount?.characters() || 0} Zeichen, {' '}
          {editor.storage.characterCount?.words() || 0} Wörter
        </span>
        {isLocked ? (
          <span className="text-yellow-600">Schreibgeschützt</span>
        ) : (
          <span className="text-green-600">Bearbeitbar</span>
        )}
      </div>
    </div>
  )
}