'use client'
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const handleAuthChange = useCallback(async (event, session) => {
    const currentUser = session?.user
    setUser(currentUser ?? null)
    
    if (event === 'SIGNED_IN') {
      toast.success('Logged in successfully!')
      router.push('/dashboard')
    }
    if (event === 'SIGNED_OUT') {
      toast.success('Logged out successfully!')
      router.push('/')
    }
  }, [router])

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)

      const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange)
      
      return () => {
        subscription?.unsubscribe()
      }
    }

    initializeAuth()
  }, [handleAuthChange])

  const value = {
    user,
    loading,
    signInWithMagicLink: async (email) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success('Magic link sent to your email!')
      }
    },
    signOut: async () => {
      await supabase.auth.signOut()
    },
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}