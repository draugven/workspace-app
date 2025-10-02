'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseRealtimeDataProps<T> {
  tableName: string
  initialData?: T[]
  selectQuery?: string
  orderBy?: { column: string; ascending?: boolean }
  filter?: (user: any) => string // For privacy filtering
  onInsert?: (item: T) => void
  onUpdate?: (item: T) => void
  onDelete?: (id: string) => void
  enableLogs?: boolean
}

export function useRealtimeData<T extends { id: string }>({
  tableName,
  initialData = [],
  selectQuery = '*',
  orderBy = { column: 'updated_at', ascending: false },
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enableLogs = false
}: UseRealtimeDataProps<T>) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const connectionAttempts = useRef(0)
  const maxRetries = 3

  // Use refs to avoid re-creating subscription on dependency changes
  const configRef = useRef({ tableName, selectQuery, orderBy, filter })
  configRef.current = { tableName, selectQuery, orderBy, filter }

  // Stable logging function
  const log = useCallback((message: string, ...args: any[]) => {
    if (enableLogs) {
      console.log(`[${tableName} realtime]`, message, ...args)
    }
  }, [tableName, enableLogs])

  // Load data from database
  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user && filter) {
        throw new Error('Authentication required for filtered queries')
      }

      let query = supabase
        .from(tableName)
        .select(selectQuery)

      // Apply privacy filter if provided
      if (filter && user) {
        const filterString = filter(user)
        query = query.or(filterString)
      }

      // Apply ordering
      query = query.order(orderBy.column, { ascending: orderBy.ascending })

      const { data: result, error: queryError } = await query

      if (queryError) throw queryError

      setData(result || [])
      log('Data loaded successfully', result?.length, 'items')
    } catch (err) {
      const message = err instanceof Error ? err.message : `Failed to load ${tableName} data`
      setError(message)
      log('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }, [tableName, selectQuery, orderBy, filter, log])

  // Initialize subscription with stable references
  useEffect(() => {
    let mounted = true

    const initializeData = async () => {
      if (!mounted) return

      const { tableName, selectQuery, orderBy, filter } = configRef.current

      setLoading(true)
      setError(null)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (filter && !user) {
          throw new Error('Authentication required for filtered queries')
        }

        let query = supabase
          .from(tableName)
          .select(selectQuery)

        // Apply privacy filter if provided
        if (filter && user) {
          const filterString = filter(user)
          query = query.or(filterString)
        }

        // Apply ordering
        query = query.order(orderBy.column, { ascending: orderBy.ascending })

        const { data: result, error: queryError } = await query

        if (queryError) throw queryError

        if (mounted) {
          setData(result || [])
          if (enableLogs) {
            console.log(`[${tableName} realtime] Data loaded successfully`, result?.length, 'items')
          }
        }
      } catch (err) {
        if (mounted) {
          const message = err instanceof Error ? err.message : `Failed to load ${tableName} data`
          setError(message)
          if (enableLogs) {
            console.log(`[${tableName} realtime] Error loading data:`, err)
          }
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initializeData()

    // Clean up existing subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    // Create new channel with unique name
    const { tableName: currentTableName } = configRef.current
    const channelName = `${currentTableName}-changes-${Date.now()}`
    if (enableLogs) {
      console.log(`[${currentTableName} realtime] Creating subscription:`, channelName)
    }

    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: currentTableName
        },
        async (payload) => {
          if (!mounted) return

          if (enableLogs) {
            console.log(`[${currentTableName} realtime] Received real-time event:`, payload.eventType, payload)
          }

          switch (payload.eventType) {
            case 'INSERT':
              const newItem = payload.new as T
              setData(prev => {
                // Avoid duplicates
                if (prev.some(item => item.id === newItem.id)) {
                  return prev
                }
                // Add to beginning for newest-first ordering
                return [newItem, ...prev]
              })
              onInsert?.(newItem)
              break

            case 'UPDATE':
              const updatedItem = payload.new as T
              setData(prev =>
                prev.map(item =>
                  item.id === updatedItem.id ? updatedItem : item
                )
              )
              onUpdate?.(updatedItem)
              break

            case 'DELETE':
              const deletedId = payload.old.id
              setData(prev => prev.filter(item => item.id !== deletedId))
              onDelete?.(deletedId)
              break
          }
        }
      )
      .subscribe((status, err) => {
        if (!mounted) return

        if (enableLogs) {
          console.log(`[${currentTableName} realtime] Subscription status:`, status, err)
        }

        if (status === 'SUBSCRIBED') {
          connectionAttempts.current = 0
          if (enableLogs) {
            console.log(`[${currentTableName} realtime] Successfully subscribed to real-time updates`)
          }
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          if (enableLogs) {
            console.log(`[${currentTableName} realtime] Subscription error, will retry...`, status, err)
          }
          if (mounted) {
            setError('Real-time connection failed. Manual refresh may be needed.')
          }
        }
      })

    channelRef.current = channel

    return () => {
      mounted = false
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, []) // Empty dependency - use refs for all config, only re-initialize on mount


  // Manual refresh function
  const refresh = useCallback(async () => {
    log('Manual refresh triggered')
    await loadData()
  }, [loadData, log])

  // Generic CRUD operations
  const insert = useCallback(async (item: Omit<T, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Authentication required')

      const insertData = {
        ...item,
        created_by: user.id,
        ...(item as any).created_by === undefined && { created_by: user.id }
      }

      const { data: result, error: insertError } = await (supabase as any)
        .from(tableName)
        .insert(insertData)
        .select(selectQuery)
        .single()

      if (insertError) throw insertError

      // Optimistically update local state
      setData(prev => [result, ...prev])
      log('Item inserted:', result)
      return result
    } catch (err) {
      log('Insert error:', err)
      throw err
    }
  }, [tableName, selectQuery, log])

  const update = useCallback(async (id: string, updates: Partial<T>) => {
    try {
      // Convert undefined values to null for proper Supabase handling
      const cleanUpdates = Object.fromEntries(
        Object.entries(updates).map(([key, value]) => [key, value === undefined ? null : value])
      )

      const updateData = {
        ...cleanUpdates,
        updated_at: new Date().toISOString()
      }

      const { data: result, error: updateError } = await (supabase as any)
        .from(tableName)
        .update(updateData)
        .eq('id', id)
        .select(selectQuery)
        .single()

      if (updateError) throw updateError

      // Optimistically update local state
      setData(prev =>
        prev.map(item =>
          item.id === id ? result : item
        )
      )
      log('Item updated:', result)
      return result
    } catch (err) {
      log('Update error:', err)
      throw err
    }
  }, [tableName, selectQuery, log])

  const remove = useCallback(async (id: string) => {
    try {
      // Use admin API for deletion to ensure proper permissions
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Authentication required')

      const response = await fetch(`/api/admin/${tableName}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Delete failed')
      }

      // Optimistically update local state
      setData(prev => prev.filter(item => item.id !== id))
      log('Item deleted:', id)
    } catch (err) {
      log('Delete error:', err)
      throw err
    }
  }, [tableName, log])

  return {
    data,
    loading,
    error,
    refresh,
    insert,
    update,
    remove,
    // For backward compatibility
    loadData: loadData
  }
}