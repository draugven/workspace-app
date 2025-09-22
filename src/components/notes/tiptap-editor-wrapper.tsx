'use client'

import dynamic from 'next/dynamic'
import type { TiptapEditorProps } from './tiptap-editor'

const TiptapEditor = dynamic(() => import('./tiptap-editor').then(mod => ({ default: mod.TiptapEditor })), {
  ssr: false,
  loading: () => (
    <div className="space-y-2">
      <div className="flex items-center gap-1 p-2 border rounded-md bg-gray-50">
        <div className="text-sm text-gray-500">Editor wird geladen...</div>
      </div>
      <div className="min-h-[200px] p-4 border rounded-md bg-gray-50 animate-pulse"></div>
    </div>
  ),
})

export function TiptapEditorWrapper(props: TiptapEditorProps) {
  return <TiptapEditor {...props} />
}