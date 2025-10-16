import { useCreateStudentProfileMutation } from '@/features/auth/api/authApi'
import { useAppSelector } from '@/libs/redux/hooks'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, Alert, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function FillUpForm() {
  const currentUser = useAppSelector((state) => state.auth)
  const insets = useSafeAreaInsets()
  const [profile, setProfile] = useState({
    studentId: '',
    company: '',
    supervisor: '',
    location: '',
    duration: ''
  })

  const [errors, setErrors] = useState({
    studentId: '',
    company: '',
    supervisor: '',
    location: '',
    duration: ''
  })

  const validateForm = useCallback(() => {
    let newErrors = {
      studentId: '',
      company: '',
      supervisor: '',
      location: '',
      duration: ''
    }

    if (!profile.studentId.trim()) {
      newErrors.studentId = 'Student ID is required'
    } else if (profile.studentId.trim().length < 3) {
      newErrors.studentId = 'Student ID must be at least 3 characters'
    }

    if (!profile.company.trim()) {
      newErrors.company = 'Company name is required'
    } else if (profile.company.trim().length < 2) {
      newErrors.company = 'Company name must be at least 2 characters'
    }

    if (!profile.supervisor.trim()) {
      newErrors.supervisor = 'Supervisor name is required'
    } else if (profile.supervisor.trim().length < 2) {
      newErrors.supervisor = 'Supervisor name must be at least 2 characters'
    }

    if (!profile.location.trim()) {
      newErrors.location = 'Address is required'
    } else if (profile.location.trim().length < 2) {
      newErrors.location = 'Address must be at least 2 characters'
    }

    if (!profile.duration.trim()) {
      newErrors.duration = 'OJT duration is required'
    } else if (isNaN(Number(profile.duration)) || parseInt(profile.duration) <= 0) {
      newErrors.duration = 'Duration must be a valid number greater than 0'
    } else if (parseInt(profile.duration) > 24) {
      newErrors.duration = 'Duration cannot exceed 24 months'
    }

    setErrors(newErrors)

    return Object.values(newErrors).every(error => error === '')
  }, [profile])

  const [createStudentProfile, { isLoading: createStudentProfileLoading }] = useCreateStudentProfileMutation()

  const handleCompleteProfile = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check all fields and try again')
      return
    }


    try {
      const res = await createStudentProfile({
        user_id: currentUser.id,
        address: profile.location,
        company: profile.company,
        duration: profile.duration,
        student_id: profile.studentId,
        supervisor: profile.supervisor
      })

      console.log('create student profile response', res)

      if (res.error) {
        Alert.alert(
          'create student profile failed',
          (res.error as { message: string }).message || 'An error occured during sign up',
          [{ text: 'Ok' }]
        )
        return;
      }

      setProfile({
        studentId: '',
        company: '',
        supervisor: '',
        location: '',
        duration: ''
      })

      router.replace('/(root)/tabs/home')
    } catch (error) {
      Alert.alert('Error', (error as { message: string }).message || 'Failed to save profile. Please try again.')
    }
  }

  return (
    <ScrollView className="flex-1 bg-blue-50">
      <View className="bg-indigo-600 px-6 py-6">
        <Text className="text-3xl font-bold text-white" style={{ marginTop: insets.top }}>Complete Your Profile</Text>
        <Text className="text-indigo-200 text-sm mt-1">Fill in your OJT information</Text>
      </View>

      <View className="p-6 gap-4">
        {/* Student ID */}
        <View>
          <Text className="text-gray-700 font-semibold mb-2">Student ID</Text>
          <View className={`bg-white rounded-lg overflow-hidden border ${errors.studentId ? 'border-red-500' : 'border-gray-200'}`}>
            <View className="flex-row items-center px-4 py-3 gap-2">
              <MaterialCommunityIcons name="card-account-details" size={20} color="#4f46e5" />
              <TextInput
                placeholder="Enter student id"
                value={profile.studentId}
                onChangeText={(text) => {
                  setProfile({ ...profile, studentId: text })
                  if (errors.studentId) setErrors({ ...errors, studentId: '' })
                }}
                className="flex-1 text-gray-800"
              />
            </View>
          </View>
          {errors.studentId && <Text className="text-red-500 text-sm mt-1">{errors.studentId}</Text>}
        </View>

        {/* Company */}
        <View>
          <Text className="text-gray-700 font-semibold mb-2">Company Name</Text>
          <View className={`bg-white rounded-lg overflow-hidden border ${errors.company ? 'border-red-500' : 'border-gray-200'}`}>
            <View className="flex-row items-center px-4 py-3 gap-2">
              <MaterialCommunityIcons name="briefcase" size={20} color="#4f46e5" />
              <TextInput
                placeholder="Enter company name"
                value={profile.company}
                onChangeText={(text) => {
                  setProfile({ ...profile, company: text })
                  if (errors.company) setErrors({ ...errors, company: '' })
                }}
                className="flex-1 text-gray-800"
              />
            </View>
          </View>
          {errors.company && <Text className="text-red-500 text-sm mt-1">{errors.company}</Text>}
        </View>

        <View>
          <Text className="text-gray-700 font-semibold mb-2">Supervisor Name</Text>
          <View className={`bg-white rounded-lg overflow-hidden border ${errors.supervisor ? 'border-red-500' : 'border-gray-200'}`}>
            <View className="flex-row items-center px-4 py-3 gap-2">
              <MaterialCommunityIcons name="account-supervisor" size={20} color="#4f46e5" />
              <TextInput
                placeholder="Enter supervisor"
                value={profile.supervisor}
                onChangeText={(text) => {
                  setProfile({ ...profile, supervisor: text })
                  if (errors.supervisor) setErrors({ ...errors, supervisor: '' })
                }}
                className="flex-1 text-gray-800"
              />
            </View>
          </View>
          {errors.supervisor && <Text className="text-red-500 text-sm mt-1">{errors.supervisor}</Text>}
        </View>

        <View>
          <Text className="text-gray-700 font-semibold mb-2">Address</Text>
          <View className={`bg-white rounded-lg overflow-hidden border ${errors.location ? 'border-red-500' : 'border-gray-200'}`}>
            <View className="flex-row items-center px-4 py-3 gap-2">
              <MaterialCommunityIcons name="map-marker" size={20} color="#4f46e5" />
              <TextInput
                placeholder="Enter address"
                value={profile.location}
                onChangeText={(text) => {
                  setProfile({ ...profile, location: text })
                  if (errors.location) setErrors({ ...errors, location: '' })
                }}
                className="flex-1 text-gray-800"
              />
            </View>
          </View>
          {errors.location && <Text className="text-red-500 text-sm mt-1">{errors.location}</Text>}
        </View>

        {/* OJT Duration */}
        <View>
          <Text className="text-gray-700 font-semibold mb-2">OJT Duration (Months)</Text>
          <View className={`bg-white rounded-lg overflow-hidden border ${errors.duration ? 'border-red-500' : 'border-gray-200'}`}>
            <View className="flex-row items-center px-4 py-3 gap-2">
              <MaterialCommunityIcons name="calendar-range" size={20} color="#4f46e5" />
              <TextInput
                placeholder="Enter ojt duration"
                keyboardType="number-pad"
                value={profile.duration}
                onChangeText={(text) => {
                  setProfile({ ...profile, duration: text })
                  if (errors.duration) setErrors({ ...errors, duration: '' })
                }}
                className="flex-1 text-gray-800"
              />
            </View>
          </View>
          {errors.duration && <Text className="text-red-500 text-sm mt-1">{errors.duration}</Text>}
        </View>

        <TouchableOpacity
          onPress={handleCompleteProfile}
          disabled={createStudentProfileLoading}
          className={`rounded-lg py-4 mt-4 flex-row items-center justify-center gap-2 ${createStudentProfileLoading ? 'bg-indigo-400' : 'bg-indigo-600'}`}
        >
          <Text className="text-white font-bold text-center text-lg">{createStudentProfileLoading ? 'Saving...' : 'Complete Profile'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-lg py-3 border border-gray-300"
          onPress={() => {
            router.replace('/(root)/tabs/home')
          }}
          disabled={createStudentProfileLoading}
        >
          <Text className="text-gray-800 font-semibold text-center">Cancel</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={createStudentProfileLoading}
        animationType="fade"
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <View className="bg-white p-6 rounded-2xl items-center">
            <ActivityIndicator size="large" color="#0286FF" />
          </View>
        </View>
      </Modal>
    </ScrollView>
  )
}