'use client'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
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
  const userType = useAppSelector((state) => state.auth.userType)

  useEffect(() => {
    const initialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()

        if (data.session?.user && data.session?.user.email && data.session?.user.id) {
          if (!userType) {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('user_type')
              .eq('id', data.session.user.id)
              .single()

            if (!profileError && profile?.user_type === 'admin') {
              dispatch(setUser({
                email: data.session.user.email,
                id: data.session.user.id,
                userType: profile.user_type
              }))
            } else {
              await supabase.auth.signOut()
              dispatch(clearUser())
            }
          } else {
            dispatch(setUser({
              email: data.session.user.email,
              id: data.session.user.id,
              userType: userType
            }))
          }
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
      async (event, session) => {
        if (event === 'SIGNED_OUT') {
          dispatch(clearUser())
        } else if (session?.user && session.user.email && session.user.id) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('user_type')
            .eq('id', session.user.id)
            .single()

          if (!profileError && profile?.user_type === 'admin') {
            dispatch(setUser({
              email: session.user.email,
              id: session.user.id,
              userType: profile.user_type
            }))
          } else {
            await supabase.auth.signOut()
            dispatch(clearUser())
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch, userType])

  if (loading) {
    return <SplashScreen />
  }

  return <>{children}</>
}