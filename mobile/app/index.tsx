import { images } from '@/constant/image'
import React from 'react'
import { Image, View } from 'react-native'

export default function Index() {
  return (
    <View className='flex-1 justify-center items-center bg-white'>
      <Image source={images.logo} resizeMode='contain' className='w-full h-full' />
    </View>
  )
}