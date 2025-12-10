'use client'

import { MapPin, CheckCircle } from 'lucide-react'
import { Attendance } from '../api/locationApi'

interface StatsCardsProps {
  attendance: Attendance[]
}

export function StatsCards({ attendance }: StatsCardsProps) {
  const totalCheckIn = attendance.filter((c) => c.check_in_time).length
  const totalCheckout = attendance.filter((co) => co.check_out_time).length

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <div>
            <p className="text-sm text-muted-foreground">Total Check-ins</p>
            <p className="text-2xl font-bold">{totalCheckIn}</p>
          </div>
        </div>
      </div>
      <div className="bg-card border rounded-lg p-4">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm text-muted-foreground">Total Check-outs</p>
            <p className="text-2xl font-bold">{totalCheckout}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

