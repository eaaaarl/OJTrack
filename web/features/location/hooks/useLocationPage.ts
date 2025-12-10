'use client'

import { useState } from 'react'
import { useAppSelector } from '@/lib/redux/hooks'
import { useGetStudentAttendanceQuery, FilterStatus, Attendance } from '../api/locationApi'

export function useLocationPage() {
  const currentUserId = useAppSelector((state) => state.auth.id)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearchQuery, setActiveSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL')
  const [selectedCheckIn, setSelectedCheckIn] = useState<Attendance | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { data: studentAttendanceData } = useGetStudentAttendanceQuery({
    currentUserId: currentUserId,
    searchQuery: activeSearchQuery || undefined,
    statusFilter: filterStatus
  })

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery)
  }

  const handleViewDetails = (checkIn: Attendance) => {
    setSelectedCheckIn(checkIn)
    setIsDialogOpen(true)
  }

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    handleSearch,
    handleViewDetails,
    studentAttendanceData,
    selectedCheckIn,
    isDialogOpen,
    setIsDialogOpen,
  }
}

