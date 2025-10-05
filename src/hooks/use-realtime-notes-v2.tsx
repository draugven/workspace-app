'use client'

import { useCallback, useState } from 'react'
import { useRealtimeData } from './use-realtime-data'
import { supabase } from '@/lib/supabase'
import type { Note } from '@/types'

interface UseRealtimeNotesV2Props {
  enableLogs?: boolean
}

export function useRealtimeNotesV2({ enableLogs = false }: UseRealtimeNotesV2Props = {}) {
  const [lockingStates, setLockingStates] = useState<Record<string, boolean>>({})

  // Stable filter function to prevent infinite re-renders
  const notesFilter = useCallback((user: any) =>
    `is_private.eq.false,and(is_private.eq.true,created_by.eq.${user.id})`, [])

  // Stable callback functions to prevent infinite re-renders
  const onInsertCallback = useCallback((note: Note) => {
    if (enableLogs) {
      console.log('🆕 New note created:', note.title)
    }
  }, [enableLogs])

  const onUpdateCallback = useCallback((note: Note) => {
    if (enableLogs) {
      console.log('✏️ Note updated:', note.title, note.is_locked ? '🔒 Locked' : '🔓 Unlocked')
    }
  }, [enableLogs])

  const onDeleteCallback = useCallback((id: string) => {
    if (enableLogs) {
      console.log('🗑️ Note deleted:', id)
    }
  }, [enableLogs])

  const {
    data: notes,
    loading,
    error,
    refresh,
    insert,
    update,
    remove
  } = useRealtimeData<Note>({
    tableName: 'notes',
    selectQuery: `
      *,
      department:departments(*),
      versions:note_versions(*)
    `,
    orderBy: { column: 'updated_at', ascending: false },
    filter: notesFilter,
    enableLogs,
    onInsert: onInsertCallback,
    onUpdate: onUpdateCallback,
    onDelete: onDeleteCallback
  })

  // Enhanced note creation with better error handling
  const createNote = useCallback(async (noteData: Partial<Note>) => {
    try {
      return await insert({
        title: noteData.title || 'Neue Notiz',
        content: noteData.content || '',
        content_html: (noteData.content || '').replace(/\n/g, '<br>'),
        department_id: noteData.department_id,
        is_locked: false,
        is_private: noteData.is_private || false
      } as any)
    } catch (error) {
      console.error('Failed to create note:', error)
      throw error
    }
  }, [insert])

  // Enhanced note saving with lock management and version creation
  const saveNote = useCallback(async (
    noteId: string,
    content: string,
    title?: string,
    departmentId?: string | null,
    isPrivate?: boolean
  ) => {
    try {
      const updateData: any = {
        content,
        content_html: content.replace(/\n/g, '<br>'),
      }

      if (title !== undefined) updateData.title = title
      if (departmentId !== undefined) updateData.department_id = departmentId
      if (isPrivate !== undefined) updateData.is_private = isPrivate

      // Update the note
      const result = await update(noteId, updateData)

      // Create version snapshot (don't block on failure)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Get current version count
          const { data: existingVersions } = await supabase
            .from('note_versions')
            .select('version_number')
            .eq('note_id', noteId)
            .order('version_number', { ascending: false })
            .limit(1)

          const nextVersionNumber = (existingVersions && existingVersions.length > 0 && existingVersions[0] as any)
            ? (existingVersions[0] as any).version_number + 1
            : 1

          // Insert new version
          await (supabase as any)
            .from('note_versions')
            .insert({
              note_id: noteId,
              content,
              content_html: content.replace(/\n/g, '<br>'),
              version_number: nextVersionNumber,
              created_by: user.id
            })

          if (enableLogs) {
            console.log(`📝 Created version ${nextVersionNumber} for note ${noteId}`)
          }
        }
      } catch (versionError) {
        console.error('⚠️ Version history creation failed (note was saved):', versionError)
        // Note: A proper user notification would require a toast system
        // For now, we log the error clearly so it's visible in the console
      }

      return result
    } catch (error) {
      console.error('Failed to save note:', error)
      throw error
    }
  }, [update, enableLogs])

  // Lock/unlock note functionality
  const toggleNoteLock = useCallback(async (noteId: string, shouldLock: boolean) => {
    if (lockingStates[noteId]) return // Prevent concurrent lock operations

    setLockingStates(prev => ({ ...prev, [noteId]: true }))

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Authentication required')

      const lockData = shouldLock ? {
        is_locked: true,
        locked_by: user.id,
        locked_at: new Date().toISOString()
      } : {
        is_locked: false,
        locked_by: undefined,
        locked_at: undefined
      }

      await update(noteId, lockData)

      if (enableLogs) {
        console.log(`🔒 Note ${shouldLock ? 'locked' : 'unlocked'}:`, noteId)
      }
    } catch (error) {
      console.error(`Failed to ${shouldLock ? 'lock' : 'unlock'} note:`, error)
      throw error
    } finally {
      setLockingStates(prev => ({ ...prev, [noteId]: false }))
    }
  }, [update, lockingStates, enableLogs])

  // Cleanup orphaned locks
  const cleanupOrphanedLocks = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString()

      const { error } = await (supabase as any)
        .from('notes')
        .update({
          is_locked: false,
          locked_by: null,
          locked_at: null
        })
        .eq('locked_by', user.id)
        .lt('locked_at', tenMinutesAgo)

      if (error) {
        console.warn('Failed to cleanup orphaned locks:', error)
      } else if (enableLogs) {
        console.log('✨ Cleaned up orphaned locks')
      }
    } catch (error) {
      console.warn('Error during lock cleanup:', error)
    }
  }, [enableLogs])

  // Check if user can edit a note
  const canEdit = useCallback(async (note: Note) => {
    if (!note.is_locked) return true

    const { data: { user } } = await supabase.auth.getUser()
    return user && note.locked_by === user.id
  }, [])

  // Restore a previous version
  const restoreVersion = useCallback(async (noteId: string, versionId: string) => {
    try {
      // Fetch the version content
      const { data: versionData, error: fetchError } = await supabase
        .from('note_versions')
        .select('content, content_html')
        .eq('id', versionId)
        .single()

      if (fetchError || !versionData) {
        throw new Error('Version nicht gefunden')
      }

      // Update the note with the old content (this will create a new version automatically)
      await update(noteId, {
        content: (versionData as any).content,
        content_html: (versionData as any).content_html
      })

      if (enableLogs) {
        console.log(`♻️ Restored version for note ${noteId}`)
      }

      // Refresh to get updated versions
      await refresh()
    } catch (error) {
      console.error('Failed to restore version:', error)
      throw error
    }
  }, [update, refresh, enableLogs])

  return {
    notes,
    loading,
    error,
    refresh,
    createNote,
    saveNote,
    deleteNote: remove,
    toggleNoteLock,
    cleanupOrphanedLocks,
    canEdit,
    isLocking: (noteId: string) => lockingStates[noteId] || false,
    restoreVersion
  }
}