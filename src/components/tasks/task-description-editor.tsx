'use client'

import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { Button } from '@/components/ui/button'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Link as LinkIcon,
  Undo,
  Redo
} from 'lucide-react'

export interface TaskDescriptionEditorProps {
  content: string
  onChange: (content: string) => void
  placeholder?: string
  className?: string
}

export function TaskDescriptionEditor({
  content,
  onChange,
  placeholder = "Beschreibung der Aufgabe...",
  className = ""
}: TaskDescriptionEditorProps) {
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
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800 cursor-pointer',
        },
      }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none focus:outline-none min-h-[60px] p-3 border rounded-md ${className}`,
      },
      handleKeyDown: (view, event) => {
        // Handle Cmd+K (Mac) or Ctrl+K (Windows/Linux) for link dialog
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
          event.preventDefault()
          const url = window.prompt('Link-URL eingeben:', '')
          if (url !== null) {
            if (url === '') {
              view.state.tr.doc && editor?.chain().focus().extendMarkRange('link').unsetLink().run()
            } else {
              view.state.tr.doc && editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }
          }
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

  if (!editor) {
    return (
      <div className={`min-h-[60px] p-3 border rounded-md bg-gray-50 animate-pulse ${className}`}>
        <div className="text-sm text-gray-500">Editor wird geladen...</div>
      </div>
    )
  }

  const handleSetLink = () => {
    const url = window.prompt('Link-URL eingeben:', editor.getAttributes('link').href || '')
    if (url !== null) {
      if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
      }
    }
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
      action: handleSetLink,
      isActive: editor.isActive('link'),
      icon: LinkIcon,
      tooltip: 'Link hinzufügen/bearbeiten (Strg+K)'
    }
  ]

  return (
    <div className="space-y-2">
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
              title={button.tooltip}
              className="h-7 w-7 p-0"
            >
              <Icon className="h-3.5 w-3.5" />
            </Button>
          )
        })}

        <div className="w-px h-5 bg-gray-300 mx-2" />

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Rückgängig (Strg+Z)"
          className="h-7 w-7 p-0"
        >
          <Undo className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Wiederholen (Strg+Y)"
          className="h-7 w-7 p-0"
        >
          <Redo className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Editor */}
      <div className="relative">
        <EditorContent editor={editor} />
        {editor.isEmpty && (
          <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  )
}