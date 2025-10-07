'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { isUserAdmin } from '@/lib/auth-utils'
import { getSafeRedirectPath } from '@/lib/navigation-utils'

interface AuthContextType {
  user: User | null
  loading: boolean
  isAdmin: boolean
  adminLoading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAdmin: false,
  adminLoading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminLoading, setAdminLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession()
      .then(async ({ data: { session } }) => {
        setUser(session?.user ?? null)

        // Check admin status once on initial load
        if (session?.user) {
          setAdminLoading(true)
          try {
            const adminStatus = await isUserAdmin(session.user.id)
            setIsAdmin(adminStatus)
          } catch (error) {
            console.error('Failed to check admin status:', error)
            setIsAdmin(false)
          } finally {
            setAdminLoading(false)
          }
        } else {
          setAdminLoading(false)
        }
      })
      .catch((error) => {
        console.error('Failed to get session:', error)
        setUser(null)
        setIsAdmin(false)
        setAdminLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === 'SIGNED_IN') {
        // Check admin status when user signs in
        if (session?.user) {
          setAdminLoading(true)
          try {
            const adminStatus = await isUserAdmin(session.user.id)
            setIsAdmin(adminStatus)
          } catch (error) {
            console.error('Failed to check admin status:', error)
            setIsAdmin(false)
          } finally {
            setAdminLoading(false)
          }
        }

        // Redirect to saved URL or dashboard (with validation)
        const params = new URLSearchParams(window.location.search)
        const redirect = getSafeRedirectPath(params.get('redirect'))
        router.push(redirect)
      } else if (event === 'SIGNED_OUT') {
        setIsAdmin(false)
        setAdminLoading(false)
        router.push('/login')
      } else if (event === 'USER_UPDATED') {
        // Re-check admin status when user metadata/roles are updated
        if (session?.user) {
          setAdminLoading(true)
          try {
            const adminStatus = await isUserAdmin(session.user.id)
            setIsAdmin(adminStatus)
          } catch (error) {
            console.error('Failed to check admin status on user update:', error)
            setIsAdmin(false)
          } finally {
            setAdminLoading(false)
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, adminLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}