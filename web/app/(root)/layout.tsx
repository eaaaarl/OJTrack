'use client'

import { useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { id } = useAppSelector((state) => state.auth)
  const router = useRouter()

  console.log('id', id)

  useEffect(() => {
    if (!id) {
      router.replace('/')
    }
  }, [id, router])

  if (id) {
    return <>{children}</>
  }

  return null
}
