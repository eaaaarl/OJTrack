import { useCreateAttendanceMutation } from '@/features/student/api/studentApi'
import { useAppSelector } from '@/libs/redux/hooks'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { CameraCapturedPicture, CameraView, useCameraPermissions } from 'expo-camera'
import * as Location from 'expo-location'
import { router } from 'expo-router'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ActivityIndicator, Alert, Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Camera() {
  const currentUser = useAppSelector((state) => state.auth)
  const insets = useSafeAreaInsets()
  const [permission, requestPermission] = useCameraPermissions()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [capturedPhoto, setCapturedPhoto] = useState<CameraCapturedPicture | null>(null)
  const [showLoadingModal, setShowLoadingModal] = useState(false)
  const cameraRef = useRef<CameraView>(null)

  const [locationData, setLocationData] = useState({
    address: '',
    latitude: 0,
    longitude: 0
  })
  const [createAttendance] = useCreateAttendanceMutation()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Location Permission
  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      return status === 'granted'
    } catch (error) {
      console.log('Permission location error:', error)
      return false
    }
  }

  const getCurrentLocation = useCallback(async () => {
    if (!currentUser) return
    try {
      const hasPermission = await requestLocationPermission()
      if (!hasPermission) {
        Alert.alert(
          'Location Permission Required',
          'Please enable location permissions to see your current location and find nearby rides.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Location.requestForegroundPermissionsAsync() }
          ]
        )
        return
      }
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      })
      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      })

      console.log('Location data:', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address[0].formattedAddress || ''
      })

      setLocationData({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: address[0].formattedAddress || ''
      })

    } catch (error) {
      console.log('Location error:', error)
      Alert.alert(
        'Location Error',
        'Unable to get your current location. Please try again or check your location settings.'
      )
    }
  }, [currentUser])

  useEffect(() => {
    if (currentUser) {
      getCurrentLocation()
    }
  }, [currentUser, getCurrentLocation])

  // Camera Permission
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
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
          skipProcessing: false,
        })
        setCapturedPhoto(photo)
      } catch (error) {
        Alert.alert('Error', 'Failed to take picture')
        console.log('Camera error:', error)
      }
    }
  }

  const handleConfirm = async () => {
    if (!capturedPhoto?.uri) {
      Alert.alert('Error', 'No photo to upload')
      return
    }

    // Show loading modal immediately
    setShowLoadingModal(true)

    try {
      const res = await createAttendance({
        photo_url: capturedPhoto.uri,
        user_id: currentUser.id,
        latitude: locationData.latitude,
        location: locationData.address,
        longitude: locationData.longitude
      }).unwrap()

      console.log('Upload success:', res)

      // Hide loading modal before showing alert
      setShowLoadingModal(false)

      Alert.alert('Success', res?.message, [
        {
          text: 'OK',
          onPress: () => {
            setCapturedPhoto(null)
            router.replace('/(root)/tabs/home')
          }
        }
      ])
    } catch (error: any) {
      console.log('Upload error:', error)

      // Hide loading modal before showing alert
      setShowLoadingModal(false)

      Alert.alert('Error', error?.message || 'Failed to upload photo', [
        {
          text: 'Retry',
          onPress: () => {
            // Don't close the photo preview, allow retry
          }
        },
        {
          text: 'Retake',
          onPress: () => {
            setCapturedPhoto(null)
          }
        }
      ])
    }
  }

  const handleRetake = () => {
    setCapturedPhoto(null)
  }

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

  // Photo preview
  if (capturedPhoto) {
    return (
      <View className="flex-1 bg-black">
        <Image
          source={{ uri: capturedPhoto.uri }}
          style={{ flex: 1 }}
        />
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
              disabled={showLoadingModal}
              className={`rounded-full p-4 flex-row items-center gap-2 ${showLoadingModal ? 'bg-gray-500' : 'bg-red-500'}`}
            >
              <MaterialCommunityIcons name="reload" size={24} color="white" />
              <Text className="text-white font-bold">Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleConfirm}
              disabled={showLoadingModal}
              className={`rounded-full p-4 flex-row items-center gap-2 ${showLoadingModal ? 'bg-green-400' : 'bg-green-500'}`}
            >
              <Text className="text-white font-bold">
                {showLoadingModal ? 'Uploading...' : 'Confirm'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading Modal */}
        <Modal
          transparent
          visible={showLoadingModal}
          animationType="fade"
        >
          <View
            className="flex-1 justify-center items-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
          >
            <View className="bg-white p-8 rounded-2xl items-center gap-4">
              <ActivityIndicator size="large" color="#4f46e5" />
              <Text className="text-gray-800 font-semibold text-center">
                Uploading your attendance...
              </Text>
            </View>
          </View>
        </Modal>
      </View>
    )
  }

  return (
    <View className="flex-1">
      <CameraView
        ref={cameraRef}
        style={{ flex: 1 }}
        facing="front"
      />
      <View className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/50 to-transparent p-4" style={{ paddingTop: insets.top + 8 }}>
        <Text className="text-white text-xl font-bold">Face Recognition Check-In</Text>
        <Text className="text-indigo-200 text-sm">Position your face in the center</Text>
      </View>

      <View className="absolute top-24 right-4 bg-black/70 rounded-lg p-3 items-center">
        <Text className="text-white text-2xl font-bold font-mono">{timeDisplay.time}</Text>
        <Text className="text-indigo-300 text-sm mt-1">{timeDisplay.date}</Text>
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
    </View>
  )
}