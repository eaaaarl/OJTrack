import { useSignOutMutation } from '@/features/auth/api/authApi'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Profile() {
  const insets = useSafeAreaInsets()

  const [signOut] = useSignOutMutation()

  const onPressSignOut = async () => {
    await signOut()
  }

  return (
    <ScrollView className="flex-1 bg-blue-50">
      <View className="bg-indigo-600 px-6 py-6">
        <Text className="text-3xl font-bold text-white" style={{ marginTop: insets.top }}>Profile</Text>
        <Text className="text-indigo-200 text-sm mt-1">Student Information</Text>
      </View>
      <View className="p-6 gap-6">
        <View className="bg-white rounded-lg p-6 shadow-md items-center">
          <View className="w-24 h-24 bg-indigo-600 rounded-full items-center justify-center mb-4">
            <MaterialCommunityIcons name="account" size={64} color="white" />
          </View>
          <Text className="text-2xl font-bold text-gray-800">John Doe</Text>
          <Text className="text-indigo-600 font-semibold mt-1">Student ID: 2024-001</Text>
          <Text className="text-gray-600 text-sm mt-1">OJT Program - Batch 2024</Text>
        </View>

        <View className="bg-white rounded-lg p-6 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Personal Information</Text>

          <View className="gap-4">
            <View className="flex-row items-center gap-3 py-2 border-b border-gray-200">
              <MaterialCommunityIcons name="email" size={20} color="#2563eb" />
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Email</Text>
                <Text className="text-gray-800 font-medium">john.doe@school.edu</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3 py-2 border-b border-gray-200">
              <MaterialCommunityIcons name="phone" size={20} color="#2563eb" />
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Phone</Text>
                <Text className="text-gray-800 font-medium">+63 912 345 6789</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3 py-2 border-b border-gray-200">
              <MaterialCommunityIcons name="map-marker" size={20} color="#2563eb" />
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Location</Text>
                <Text className="text-gray-800 font-medium">Davao City</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3 py-2">
              <MaterialCommunityIcons name="calendar" size={20} color="#2563eb" />
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Date of Birth</Text>
                <Text className="text-gray-800 font-medium">January 15, 2003</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-lg p-6 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-4">OJT Information</Text>

          <View className="gap-4">
            <View className="flex-row items-center gap-3 py-2 border-b border-gray-200">
              <MaterialCommunityIcons name="briefcase" size={20} color="#16a34a" />
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Company</Text>
                <Text className="text-gray-800 font-medium">Tech Solutions Inc.</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3 py-2 border-b border-gray-200">
              <MaterialCommunityIcons name="account-supervisor" size={20} color="#16a34a" />
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Supervisor</Text>
                <Text className="text-gray-800 font-medium">Jane Smith</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3 py-2 border-b border-gray-200">
              <MaterialCommunityIcons name="calendar-range" size={20} color="#16a34a" />
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Duration</Text>
                <Text className="text-gray-800 font-medium">6 Months</Text>
              </View>
            </View>

            <View className="flex-row items-center gap-3 py-2">
              <MaterialCommunityIcons name="progress-clock" size={20} color="#16a34a" />
              <View className="flex-1">
                <Text className="text-xs text-gray-500">Progress</Text>
                <Text className="text-gray-800 font-medium">3 Months (50%)</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="gap-3">
          <TouchableOpacity className="bg-indigo-600 rounded-lg py-3 flex-row items-center justify-center gap-2">
            <MaterialCommunityIcons name="pencil" size={20} color="white" />
            <Text className="text-white font-semibold">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onPressSignOut} className="bg-white rounded-lg py-3 flex-row items-center justify-center gap-2 border border-red-500">
            <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
            <Text className="text-red-500 font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}