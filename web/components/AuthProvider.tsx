
import { useAppDispatch } from '@/lib/redux/hooks'
import { setUser } from '@/lib/redux/state/authSlice'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import React, { ReactNode, useEffect } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()

  useEffect(() => {
    const initialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession()
        if (data.session?.user && data.session?.user.email && data.session?.user.id) {
          dispatch(setUser({ email: data.session?.user.email, id: data.session.user.id }))
          router.replace('/dashboard')
        } else {
          router.replace('/')
        }
      } catch (error) {
        console.error('user session error', error)
      }
    }
    initialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user && session.user.email && session.user.id) {
          dispatch(setUser({ email: session?.user.email, id: session.user.id }))
          router.replace('/dashboard')
        } else {
          router.replace('/')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [dispatch, router])

  return (
    <>{children}</>
  )
}
