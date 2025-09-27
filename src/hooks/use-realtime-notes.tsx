'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Note } from '@/types'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeNotesProps {
  initialNotes?: Note[]
  onNoteUpdated?: (note: Note) => void
  onNoteLocked?: (noteId: string, userId: string) => void
  onNoteUnlocked?: (noteId: string) => void
}

interface ActiveEditor {
  noteId: string
  userId: string
  userEmail: string
  timestamp: number
}

export function useRealtimeNotes({
  initialNotes = [],
  onNoteUpdated,
  onNoteLocked,
  onNoteUnlocked
}: UseRealtimeNotesProps = {}) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [activeEditors, setActiveEditors] = useState<ActiveEditor[]>([])
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentUserEditingNotes, setCurrentUserEditingNotes] = useState<Set<string>>(new Set())

  // Cleanup orphaned locks for current user
  const cleanupOrphanedLocks = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Auto-unlock notes that have been locked by current user for more than 10 minutes
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
      } else {
        console.log('Cleaned up orphaned locks for current user')
      }
    } catch (error) {
      console.warn('Error during lock cleanup:', error)
    }
  }, [])

  // Load notes from database
  const loadNotes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Clean up orphaned locks first
      await cleanupOrphanedLocks()

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('notes')
        .select(`
          *,
          department:departments(*)
        `)
        .or(`is_private.eq.false,and(is_private.eq.true,created_by.eq.${user.id})`)
        .order('updated_at', { ascending: false })

      if (error) throw error
      setNotes(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load notes')
    } finally {
      setLoading(false)
    }
  }, [cleanupOrphanedLocks])

  // Subscribe to real-time changes
  useEffect(() => {
    loadNotes()

    const notesChannel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notes'
        },
        async (payload) => {
          console.log('Real-time note change:', payload)

          switch (payload.eventType) {
            case 'INSERT':
              // Only add if not already in the list (avoid duplicates from local createNote)
              setNotes(prev => {
                if (prev.some(note => note.id === payload.new.id)) {
                  return prev
                }
                return [payload.new as Note, ...prev]
              })
              break

            case 'UPDATE':
              // Fetch complete note data with department relationship
              try {
                const { data: updatedNote } = await supabase
                  .from('notes')
                  .select(`
                    *,
                    department:departments(*)
                  `)
                  .eq('id', payload.new.id)
                  .single()

                if (updatedNote) {
                  setNotes(prev =>
                    prev.map(note =>
                      note.id === payload.new.id ? updatedNote : note
                    )
                  )
                  if (onNoteUpdated) {
                    onNoteUpdated(updatedNote as Note)
                  }
                } else {
                  // Fallback to payload data if fetch fails
                  setNotes(prev =>
                    prev.map(note =>
                      note.id === payload.new.id ? { ...note, ...payload.new } : note
                    )
                  )
                }
              } catch (error) {
                console.error('Failed to fetch updated note with department:', error)
                // Fallback to payload data
                setNotes(prev =>
                  prev.map(note =>
                    note.id === payload.new.id ? { ...note, ...payload.new } : note
                  )
                )
              }
              break

            case 'DELETE':
              setNotes(prev => prev.filter(note => note.id !== payload.old.id))
              break
          }
        }
      )
      .subscribe()

    setChannel(notesChannel)

    return () => {
      if (notesChannel) {
        supabase.removeChannel(notesChannel)
      }
    }
  }, [loadNotes, onNoteUpdated])

  // Broadcast editing presence
  const startEditing = useCallback(async (noteId: string) => {
    if (!channel) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Lock the note in the database
    const { error } = await (supabase as any)
      .from('notes')
      .update({
        is_locked: true,
        locked_by: user.id,
        locked_at: new Date().toISOString()
      })
      .eq('id', noteId)

    if (error) {
      console.error('Failed to lock note:', error)
      return
    }

    // Track which notes current user is editing
    setCurrentUserEditingNotes(prev => new Set(Array.from(prev).concat(noteId)))

    // Broadcast presence
    await channel.send({
      type: 'broadcast',
      event: 'start-editing',
      payload: {
        noteId,
        userId: user.id,
        userEmail: user.email,
        timestamp: Date.now()
      }
    })

    if (onNoteLocked) {
      onNoteLocked(noteId, user.id)
    }
  }, [channel, onNoteLocked])

  // Stop editing and unlock
  const stopEditing = useCallback(async (noteId: string) => {
    if (!channel) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Unlock the note in the database
    const { error } = await (supabase as any)
      .from('notes')
      .update({
        is_locked: false,
        locked_by: null,
        locked_at: null
      })
      .eq('id', noteId)

    if (error) {
      console.error('Failed to unlock note:', error)
      return
    }

    // Remove from tracking
    setCurrentUserEditingNotes(prev => {
      const updated = new Set(prev)
      updated.delete(noteId)
      return updated
    })

    // Broadcast presence
    await channel.send({
      type: 'broadcast',
      event: 'stop-editing',
      payload: {
        noteId,
        userId: user.id,
        timestamp: Date.now()
      }
    })

    if (onNoteUnlocked) {
      onNoteUnlocked(noteId)
    }
  }, [channel, onNoteUnlocked])

  // Save note with real-time update
  const saveNote = useCallback(async (noteId: string, content: string, title?: string, departmentId?: string | null, isPrivate?: boolean) => {
    try {
      const updateData: any = {
        content,
        title: title,
        updated_at: new Date().toISOString(),
        // Convert content to HTML (in a real app you'd use a markdown parser)
        content_html: content.replace(/\n/g, '<br>')
      }

      // Only add department_id if it's provided
      if (departmentId !== undefined) {
        updateData.department_id = departmentId
      }

      // Only add is_private if it's provided
      if (isPrivate !== undefined) {
        updateData.is_private = isPrivate
      }

      const { data, error } = await (supabase as any)
        .from('notes')
        .update(updateData)
        .eq('id', noteId)
        .select(`
          *,
          department:departments(*)
        `)
        .single()

      if (error) throw error

      // Update local state immediately to provide instant feedback
      setNotes(prev =>
        prev.map(note =>
          note.id === noteId ? data : note
        )
      )

      // The real-time subscription will handle updating the local state for other users
      return data
    } catch (error) {
      console.error('Failed to save note:', error)
      throw error
    }
  }, [])

  // Create new note
  const createNote = useCallback(async (noteData: Partial<Note>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await (supabase as any)
        .from('notes')
        .insert({
          title: noteData.title || 'Neue Notiz',
          content: noteData.content || '',
          content_html: (noteData.content || '').replace(/\n/g, '<br>'),
          department_id: noteData.department_id,
          created_by: user.id,
          is_locked: false,
          is_private: noteData.is_private || false
        })
        .select(`
          *,
          department:departments(*)
        `)
        .single()

      if (error) throw error

      // Immediately add to local state to ensure UI updates instantly
      setNotes(prev => [data, ...prev])

      return data
    } catch (error) {
      console.error('Failed to create note:', error)
      throw error
    }
  }, [])

  // Listen for editing presence broadcasts
  useEffect(() => {
    if (!channel) return

    const handlePresence = (payload: any) => {
      const { noteId, userId, userEmail, timestamp } = payload.payload

      setActiveEditors(prev => {
        switch (payload.event) {
          case 'start-editing':
            return [
              ...prev.filter(editor => !(editor.noteId === noteId && editor.userId === userId)),
              { noteId, userId, userEmail, timestamp }
            ]

          case 'stop-editing':
            return prev.filter(editor => !(editor.noteId === noteId && editor.userId === userId))

          default:
            return prev
        }
      })
    }

    const startEditingSubscription = channel.on('broadcast', { event: 'start-editing' }, handlePresence)
    const stopEditingSubscription = channel.on('broadcast', { event: 'stop-editing' }, handlePresence)

    return () => {
      // Supabase channels don't have an off method - unsubscribe is handled when the channel is removed
    }
  }, [channel])

  // Cleanup active editors older than 30 seconds
  useEffect(() => {
    const cleanup = setInterval(() => {
      setActiveEditors(prev =>
        prev.filter(editor => Date.now() - editor.timestamp < 30000)
      )
    }, 10000)

    return () => clearInterval(cleanup)
  }, [])

  // Cleanup locks on page unload (browser close, refresh, navigate away)
  useEffect(() => {
    const cleanupOnUnload = async () => {
      if (currentUserEditingNotes.size === 0) return

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Unlock all notes that current user was editing
        await (supabase as any)
          .from('notes')
          .update({
            is_locked: false,
            locked_by: null,
            locked_at: null
          })
          .eq('locked_by', user.id)
          .in('id', Array.from(currentUserEditingNotes))

        console.log('Cleaned up locks on page unload')
      } catch (error) {
        console.warn('Failed to cleanup locks on unload:', error)
      }
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      cleanupOnUnload()
    }

    const handlePageHide = () => {
      cleanupOnUnload()
    }

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('pagehide', handlePageHide)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('pagehide', handlePageHide)
      cleanupOnUnload()
    }
  }, [currentUserEditingNotes])

  // Get active editors for a specific note
  const getActiveEditors = useCallback((noteId: string) => {
    return activeEditors.filter(editor => editor.noteId === noteId)
  }, [activeEditors])

  // Check if note is being edited by another user
  const isNoteBeingEdited = useCallback(async (noteId: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const editors = getActiveEditors(noteId)
    return editors.some(editor => editor.userId !== user.id)
  }, [getActiveEditors])

  return {
    notes,
    loading,
    error,
    activeEditors,
    loadNotes,
    saveNote,
    createNote,
    startEditing,
    stopEditing,
    getActiveEditors,
    isNoteBeingEdited
  }
}