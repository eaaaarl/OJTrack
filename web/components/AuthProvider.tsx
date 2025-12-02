'use client'
import { useAppDispatch } from '@/lib/redux/hooks'
import { setUser, clearUser } from '@/lib/redux/state/authSlice'
import { supabase } from '@/lib/supabase'
import React, { ReactNode, useEffect, useState } from 'react'
import SplashScreen from './SplashScreen'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user && data.session?.user.email && data.session?.user.id) {
          dispatch(setUser({
            email: data.session.user.email,
            id: data.session.user.id
          }))
        } else {
          dispatch(clearUser())
        }
      } catch (error) {
        console.error('user session error', error)
        dispatch(clearUser())
      } finally {
        setLoading(false)
      }
    }

    initialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user && session.user.email && session.user.id) {
          dispatch(setUser({
            email: session.user.email,
            id: session.user.id
          }))
        } else {
          dispatch(clearUser())
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch])

  if (loading) {
    return <SplashScreen />
  }

  return <>{children}</>
}