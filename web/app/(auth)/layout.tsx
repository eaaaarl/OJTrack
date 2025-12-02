'use client'

import { useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { id } = useAppSelector((state) => state.auth)
  const router = useRouter()

  console.log('id', id)

  useEffect(() => {
    if (id) {
      router.replace('/dashboard')
    }
  }, [id, router])

  if (!id) {
    return <>{children}</>
  }

  return null
}
