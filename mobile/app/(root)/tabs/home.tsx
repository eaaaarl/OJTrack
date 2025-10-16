import { useAppSelector } from '@/libs/redux/hooks'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useState } from 'react'
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Home() {
  const currentUser = useAppSelector((state) => state.auth)
  const insets = useSafeAreaInsets()
  const [signedIn, setSignedIn] = useState(false)

  return (
    <ScrollView className="flex-1 bg-blue-50">
      <View className="bg-indigo-600 px-6 py-6">
        <Text className="text-3xl font-bold text-white" style={{ marginTop: insets.top }}>OJTrack</Text>
        <Text className="text-indigo-200 text-sm mt-1">Student Monitoring System</Text>
      </View>

      <View className="p-6 gap-6">
        <View className="bg-white rounded-lg p-6 shadow-md">
          <Text className="text-2xl font-semibold text-gray-800">Welcome Back</Text>
          <Text className="text-gray-600 mt-2">John Doe | ID: 2024-001</Text>
          <Text className="text-sm text-gray-500 mt-1">On-The-Job Training Program</Text>
        </View>

        <View className="gap-3">
          <Text className="text-lg font-semibold text-gray-800">Daily Check-In</Text>
          <TouchableOpacity
            onPress={() => setSignedIn(!signedIn)}
            className={`py-12 rounded-lg flex-row items-center justify-center gap-3 ${signedIn ? 'bg-green-500' : 'bg-indigo-600'
              } shadow-lg active:opacity-80`}
          >
            <MaterialCommunityIcons
              name={signedIn ? 'check-circle' : 'camera'}
              size={48}
              color="white"
            />
            <View>
              <Text className="text-xl font-semibold text-white">
                {signedIn ? 'Signed In Today' : 'Sign In with Camera'}
              </Text>
              <Text className="text-sm text-white opacity-90">
                {signedIn ? '✓ 09:30 AM' : 'Tap to capture'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View className="flex-row gap-4">
          <View className="flex-1 bg-white rounded-lg p-4 shadow-md">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialCommunityIcons name="clock-outline" size={24} color="#2563eb" />
              <Text className="text-sm text-gray-600">Hours Today</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-800">8.5h</Text>
          </View>

          <View className="flex-1 bg-white rounded-lg p-4 shadow-md">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialCommunityIcons name="check-circle" size={24} color="#16a34a" />
              <Text className="text-sm text-gray-600">Status</Text>
            </View>
            <Text className="text-xl font-bold text-green-600">On Duty</Text>
          </View>
        </View>

        <View className="bg-white rounded-lg p-6 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-4">This Week</Text>
          <View className="gap-3">
            <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
              <Text className="text-gray-700">Monday</Text>
              <Text className="text-gray-600 text-sm">8h 30m</Text>
            </View>
            <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
              <Text className="text-gray-700">Tuesday</Text>
              <Text className="text-gray-600 text-sm">9h 00m</Text>
            </View>
            <View className="flex-row justify-between items-center py-2 border-b border-gray-200">
              <Text className="text-gray-700">Wednesday</Text>
              <Text className="text-gray-600 text-sm">8h 45m</Text>
            </View>
            <View className="flex-row justify-between items-center py-2">
              <Text className="text-gray-700">Thursday</Text>
              <Text className="text-indigo-600 font-semibold">Today</Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-3">
          <TouchableOpacity className="flex-1 bg-white rounded-lg p-4 shadow-md items-center">
            <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#ea580c" />
            <Text className="text-xs text-gray-700 font-medium mt-2">Report Issue</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white rounded-lg p-4 shadow-md items-center">
            <MaterialCommunityIcons name="history" size={24} color="#2563eb" />
            <Text className="text-xs text-gray-700 font-medium mt-2">My Hours</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-white rounded-lg p-4 shadow-md items-center">
            <MaterialCommunityIcons name="calendar-check" size={24} color="#16a34a" />
            <Text className="text-xs text-gray-700 font-medium mt-2">History</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={true}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <View className="bg-white rounded-lg w-full p-6 gap-4 max-w-md">
            {/* Alert Header */}
            <View className="items-center gap-3">
              <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center">
                <MaterialCommunityIcons name="alert-circle" size={32} color="#ea580c" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 text-center">Complete Your Profile</Text>
              <Text className="text-sm text-gray-600 text-center">
                You need to fill in your OJT information to continue using OJTrack.
              </Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              onPress={() => {
                setShowProfileAlert(false)
                setScreen('complete-profile')
              }}
              className="bg-indigo-600 rounded-lg py-3"
            >
              <Text className="text-white font-bold text-center">Complete Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowProfileAlert(false)
              }}
              className="bg-gray-200 rounded-lg py-3"
            >
              <Text className="text-gray-800 font-semibold text-center">Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}