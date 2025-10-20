import { useCheckStudentProfilesQuery } from '@/features/auth/api/authApi'
import { useGetTodayAttendanceQuery, useGetWeekAttendanceQuery } from '@/features/student/api/studentApi'
import { getWeekDates } from '@/features/student/utils/getWeeksDate'
import { useAppSelector } from '@/libs/redux/hooks'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Home() {
  const currentUser = useAppSelector((state) => state.auth)
  const insets = useSafeAreaInsets()
  const [showFillUpModal, setShowFillUpModal] = useState(false)

  const { data: studentProfile, isLoading } = useCheckStudentProfilesQuery({ userId: currentUser.id })
  const { data: todayAttendance, isLoading: todayAttendanceLoading } = useGetTodayAttendanceQuery({ userId: currentUser.id })
  const { data: weekAttendance, isLoading: weekAttendanceLoading } = useGetWeekAttendanceQuery({ userId: currentUser.id })

  const weekDates = getWeekDates()

  const weekData = weekDates.map(({ day, date }) => {
    const attendance = weekAttendance?.find(a => a.date === date);
    const hours = attendance?.hours_logged || 0;

    return {
      day,
      hours: hours > 0 ? `${hours}h ${Math.round((hours % 1) * 60)}m` : "No entry",
      isToday: date === new Date().toISOString().split("T")[0]
    };
  });

  const hoursToday = todayAttendance?.hours_logged || 0;
  const status = todayAttendance?.status || "not_checked_in";

  useEffect(() => {
    if (!studentProfile && !isLoading) {
      setShowFillUpModal(true)

      return;
    }

    setShowFillUpModal(false)
  }, [studentProfile, isLoading])

  return (
    <ScrollView className="flex-1 bg-blue-50">
      <View className="bg-indigo-600 px-6 py-6">
        <Text className="text-3xl font-bold text-white" style={{ marginTop: insets.top }}>OJTrack</Text>
        <Text className="text-indigo-200 text-sm mt-1">Student Monitoring System</Text>
      </View>

      <View className="p-6 gap-6">
        <View className="bg-white rounded-lg p-6 shadow-md">
          <Text className="text-2xl font-semibold text-gray-800">Welcome Back {studentProfile?.profile.name?.split(' ')[0]}</Text>
          <Text className="text-gray-600 mt-2">{studentProfile?.profile.name} | ID: {studentProfile?.student_id}</Text>
          <Text className="text-sm text-gray-500 mt-1">On-The-Job Training Program</Text>
        </View>

        <View className="gap-3">
          <Text className="text-lg font-semibold text-gray-800">Daily Check-In</Text>
          <TouchableOpacity
            onPress={() => { router.replace('/(root)/(camera)/camera') }}
            className={`py-12 rounded-lg flex-row items-center justify-center gap-3 bg-indigo-600
              shadow-lg active:opacity-80`}
          >
            <MaterialCommunityIcons
              name={'camera'}
              size={48}
              color="white"
            />
            <View>
              <Text className="text-xl font-semibold text-white">
                Sign In/Sign Out with Camera
              </Text>
              <Text className="text-sm text-white opacity-90">
                Tap to capture
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
            <Text className="text-2xl font-bold text-gray-800">{hoursToday}h</Text>
          </View>

          <View className="flex-1 bg-white rounded-lg p-4 shadow-md">
            <View className="flex-row items-center gap-2 mb-2">
              <MaterialCommunityIcons name="check-circle" size={24} color="#16a34a" />
              <Text className="text-sm text-gray-600">Status</Text>
            </View>
            <Text className="text-xl font-bold text-green-600">
              {status === "checked_in" ? "On Duty" : status === "completed" ? "Completed" : "Not Checked In"}
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-lg p-6 shadow-md">
          <Text className="text-lg font-semibold text-gray-800 mb-4">This Week</Text>
          {weekData.map((item, i) => (
            <View key={i} className="flex-row justify-between items-center py-2">
              <Text className="text-gray-700 font-semibold">{item.day}</Text>
              <Text className={`text-sm ${item.isToday ? 'text-indigo-600 font-semibold' : 'text-gray-600'}`}>
                {item.hours}
              </Text>
            </View>
          ))}
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
        transparent
        visible={isLoading || todayAttendanceLoading || weekAttendanceLoading}
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

      <Modal
        visible={showFillUpModal}
        transparent={true}
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-6">
          <View className="bg-white rounded-lg w-full p-6 gap-4 max-w-md">
            <View className="items-center gap-3">
              <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center">
                <MaterialCommunityIcons name="alert-circle" size={32} color="#ea580c" />
              </View>
              <Text className="text-2xl font-bold text-gray-800 text-center">Complete Your Profile</Text>
              <Text className="text-sm text-gray-600 text-center">
                You need to fill in your OJT information to continue using OJTrack.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                router.replace('/(root)/tabs/fill-up-form')
              }}
              className="bg-indigo-600 rounded-lg py-3"
            >
              <Text className="text-white font-bold text-center">Complete Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {

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