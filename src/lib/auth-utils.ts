import { createClient } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { User } from '@supabase/supabase-js'

// Create a service role client for server-side operations (only when needed)
function getSupabaseAdmin() {
  // This should only be called server-side
  if (typeof window !== 'undefined') {
    throw new Error('getSupabaseAdmin can only be used server-side')
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}

export interface UserRole {
  id: string
  user_id: string
  role: 'admin' | 'user'
  created_at: string
}

/**
 * Check if a user has admin role
 * Use this for server-side admin checks
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  if (!userId) return false

  try {
    // Use regular supabase client if on client-side, admin client if server-side
    const client = typeof window !== 'undefined' ? supabase : getSupabaseAdmin()

    const { data, error } = await (client as any)
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .single()

    if (error) {
      // If no role exists, user is not admin
      return false
    }

    return data.role === 'admin'
  } catch (error) {
    console.error('Error checking admin status:', error)
    return false
  }
}

/**
 * Get user role information
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  if (!userId) return null

  try {
    // Use regular supabase client if on client-side, admin client if server-side
    const client = typeof window !== 'undefined' ? supabase : getSupabaseAdmin()

    const { data, error } = await (client as any)
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching user role:', error)
    return null
  }
}

/**
 * Require admin role - throws error if user is not admin
 * Use this in API routes or server actions that require admin
 */
export async function requireAdmin(user: User | null): Promise<void> {
  if (!user) {
    throw new Error('Authentication required')
  }

  const isAdmin = await isUserAdmin(user.id)
  if (!isAdmin) {
    throw new Error('Admin privileges required')
  }
}

/**
 * Ensure user has a role (create default "user" role if none exists)
 * This can be called on login to ensure every user has a role
 */
export async function ensureUserRole(userId: string): Promise<UserRole> {
  if (!userId) {
    throw new Error('User ID required')
  }

  // Check if user already has a role
  let userRole = await getUserRole(userId)

  if (!userRole) {
    // Create default "user" role
    const { data, error } = await (supabase as any)
      .from('user_roles')
      .insert({
        user_id: userId,
        role: 'user'
      })
      .select()
      .single()

    if (error || !data) {
      console.error('Error creating user role:', error)
      throw new Error('Failed to create user role')
    }

    userRole = data
  }

  if (!userRole) {
    throw new Error('Failed to ensure user role')
  }

  return userRole
}