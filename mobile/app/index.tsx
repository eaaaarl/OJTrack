import { images } from '@/constant/image'
import { useRouter } from 'expo-router'
import React, { useEffect } from 'react'
import { Image, View } from 'react-native'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/(auth)/sign-in')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <View className='flex-1 justify-center items-center bg-white'>
      <Image source={images.logo} resizeMode='contain' className='w-full h-full' />
    </View>
  )
}