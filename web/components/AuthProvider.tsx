'use client'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { clearUser } from '@/lib/redux/state/authSlice'
import { supabase } from '@/lib/supabase'
import React, { ReactNode, useEffect, useState } from 'react'
import SplashScreen from './SplashScreen'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)
  const { id, userType } = useAppSelector((state) => state.auth)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()

        // If no session but Redux has user, clear Redux
        if (!data.session && id) {
          dispatch(clearUser())
        }

        // If session exists but no Redux state, user refreshed - sign them out
        // They need to login again to set Redux state properly
        if (data.session && !id) {
          await supabase.auth.signOut()
        }
      } catch (error) {
        console.error('session check error', error)
        dispatch(clearUser())
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          dispatch(clearUser())
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch, id])

  if (loading) {
    return <SplashScreen />
  }

  return <>{children}</>
}