'use client'

import { createContext, useState, useEffect, useContext } from 'react'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { isUserAdmin } from '@/lib/auth-utils'

type AuthContextType = {
  user: User | null
  loading: boolean
  isAdmin: boolean
  adminLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  adminLoading: false,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    console.log('[AuthProvider] Initializing auth')

    // FAST PATH: Auth initialization only, NO async operations
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        console.log('[AuthProvider] Session loaded:', !!session?.user)
        setUser(session?.user ?? null)
      })
      .catch((error) => {
        console.error('[AuthProvider] Error getting session:', error)
        setUser(null)
      })
      .finally(() => {
        console.log('[AuthProvider] Auth initialization complete')
        setLoading(false)  // Always runs - never blocked
      })

    // Auth state change listener - SYNCHRONOUS ONLY
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('[AuthProvider] Auth state change:', event)

        // ONLY synchronous state updates here
        setUser(session?.user ?? null)

        // Handle signout immediately
        if (event === 'SIGNED_OUT') {
          setIsAdmin(false)
          setAdminLoading(false)
          router.push('/login')
        }

        // USER_UPDATED fires when user metadata changes
        // This allows dynamic admin role updates without re-login
        // The separate useEffect watching user.id will automatically re-fetch
        if (event === 'USER_UPDATED') {
          console.log('[AuthProvider] User updated, will refresh admin status')
          // No need to do anything here - the useEffect below will handle it
        }

        // NO ASYNC OPERATIONS HERE - will cause deadlock
      }
    )

    return () => {
      console.log('[AuthProvider] Cleaning up auth subscription')
      subscription.unsubscribe()
    }
  }, [router])

  // SEPARATE EFFECT: Non-blocking admin status fetch
  useEffect(() => {
    if (!user) {
      setIsAdmin(false)
      setAdminLoading(false)
      return
    }

    console.log('[AuthProvider] Fetching admin status for user:', user.id)

    const fetchAdminStatus = async () => {
      setAdminLoading(true)
      try {
        const adminStatus = await isUserAdmin(user.id)
        console.log('[AuthProvider] Admin status:', adminStatus)
        setIsAdmin(adminStatus)
      } catch (error) {
        console.error('[AuthProvider] Failed to fetch admin status:', error)
        // Fail gracefully - assume not admin
        setIsAdmin(false)
      } finally {
        setAdminLoading(false)
      }
    }

    fetchAdminStatus()
  }, [user?.id])  // Only re-run when user ID changes

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, adminLoading }}>
      {children}
    </AuthContext.Provider>
  )
}
