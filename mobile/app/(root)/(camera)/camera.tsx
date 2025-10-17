import { MaterialCommunityIcons } from '@expo/vector-icons'
import { CameraView, useCameraPermissions } from 'expo-camera'
import { router } from 'expo-router'
import React, { useEffect, useRef, useState } from 'react'
import { Alert, Image, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Camera() {
  const insets = useSafeAreaInsets()
  const [permission, requestPermission] = useCameraPermissions()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [capturedPhoto, setCapturedPhoto] = useState(null)
  const cameraRef = useRef(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission()
    }
  }, [permission, requestPermission])

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Requesting camera permission...</Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-black p-6">
        <MaterialCommunityIcons name="camera-off" size={64} color="white" />
        <Text className="text-white text-lg font-bold mt-4 text-center">Camera Permission Denied</Text>
        <Text className="text-gray-300 text-sm mt-2 text-center">
          Please allow camera access to use the check-in feature
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-indigo-600 rounded-lg py-3 px-6 mt-6"
        >
          <Text className="text-white font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    )
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current?.takePictureAsync({
          quality: 0.8,
          skipProcessing: false
        })
        setCapturedPhoto(photo)
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture')
      }
    }
  }

  const handleConfirm = () => {
    Alert.alert('Success', 'Check-in recorded successfully!', [
      {
        text: 'OK',
        onPress: () => setCapturedPhoto(null)
      }
    ])
  }

  const handleRetake = () => {
    setCapturedPhoto(null)
  }

  // Format time as HH:MM:SS with date
  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return {
      time: `${hours}:${minutes}:${seconds}`,
      date: `${month}/${day}/${year}`
    }
  }

  const timeDisplay = formatTime(currentTime)

  // Photo preview screen
  if (capturedPhoto) {
    return (
      <View className="flex-1 bg-black">
        <Image
          source={{ uri: (capturedPhoto as { uri: string }).uri }}
          style={{ flex: 1 }}
        />

        {/* Overlay with timestamp */}
        <View className="absolute top-0 left-0 right-0 bottom-0 flex-col justify-between p-4">
          <View style={{ marginTop: insets.top }}>
            <View className="bg-black/70 rounded-lg p-4 items-center">
              <Text className="text-white text-3xl font-bold">{timeDisplay.time}</Text>
              <Text className="text-white text-lg mt-2">{timeDisplay.date}</Text>
            </View>
          </View>

          <View className="flex-row gap-4 justify-center mb-6">
            <TouchableOpacity
              onPress={handleRetake}
              className="bg-red-500 rounded-full p-4 flex-row items-center gap-2"
            >
              <MaterialCommunityIcons name="reload" size={24} color="white" />
              <Text className="text-white font-bold">Retake</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleConfirm}
              className="bg-green-500 rounded-full p-4 flex-row items-center gap-2"
            >
              <MaterialCommunityIcons name="check" size={24} color="white" />
              <Text className="text-white font-bold">Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="flex-1">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="front"
      >
        <View className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4" style={{ paddingTop: insets.top + 8 }}>
          <Text className="text-white text-xl font-bold">Face Recognition Check-In</Text>
          <Text className="text-indigo-200 text-sm">Position your face in the center</Text>
        </View>

        <View className="absolute top-24 right-4 bg-black/70 rounded-lg p-3 items-center">
          <Text className="text-white text-2xl font-bold font-mono">{timeDisplay.time}</Text>
          <Text className="text-indigo-300 text-sm mt-1">{timeDisplay.date}</Text>
        </View>

        <View className="absolute inset-0 flex-col items-center justify-center">
          <View
            className="border-4 border-indigo-500 rounded-full"
            style={{
              width: 240,
              height: 240,
              opacity: 0.6
            }}
          />
          <Text className="text-white text-sm mt-4 bg-black/50 px-4 py-2 rounded-lg">
            Look at the camera
          </Text>
        </View>

        <View style={{ marginBottom: insets.bottom }} className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent flex-row items-center justify-between p-6">
          <TouchableOpacity className="p-3" onPress={() => router.replace('/(root)/tabs/home')}>
            <MaterialCommunityIcons name="close" size={28} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePicture}
            className="bg-indigo-600 rounded-full p-5"
          >
            <MaterialCommunityIcons name="camera" size={32} color="white" />
          </TouchableOpacity>

          <TouchableOpacity className="p-3">
            <MaterialCommunityIcons name="flash-off" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  )
}