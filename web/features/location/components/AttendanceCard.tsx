'use client'

import { Clock, Building2, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { format, isToday } from 'date-fns'
import { Attendance } from '../api/locationApi'
import { GEOAPIFY } from '@/constant/geoapify'

interface AttendanceCardProps {
  checkIn: Attendance
  onViewDetails: (checkIn: Attendance) => void
}

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    checked_in: 'bg-blue-100 text-blue-700',
    checked_out: 'bg-green-100 text-green-700',
    Valid: 'bg-green-100 text-green-700',
    Late: 'bg-yellow-100 text-yellow-700',
    'Outside Range': 'bg-red-100 text-red-700'
  }
  return styles[status] || styles.Valid
}

function getStaticMapUrl(lat: number, lon: number) {
  return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=400&height=300&center=lonlat:${lon},${lat}&zoom=15&marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&apiKey=${GEOAPIFY.KEY}`
}

export function AttendanceCard({ checkIn, onViewDetails }: AttendanceCardProps) {
  const photoUrl = checkIn?.check_in_photo_url

  return (
    <div className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-linear-to-br from-blue-500 to-purple-600">
        {photoUrl && (
          <Image
            src={photoUrl}
            alt={checkIn.profiles.name ?? ''}
            className="w-full h-full object-cover"
            width={500}
            height={500}
          />
        )}
        <div className="absolute top-3 right-3">
          <Badge className={getStatusBadge(checkIn.status)}>
            {checkIn.status.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{checkIn.profiles.name}</h3>
          <p className="text-sm text-muted-foreground">{checkIn.profiles.student_profiles[0].student_id}</p>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span className="text-muted-foreground">{checkIn.profiles.student_profiles[0].company}</span>
        </div>

        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <span className="text-muted-foreground">{checkIn.profiles.student_profiles[0].address}</span>
        </div>

        <div className="flex items-center justify-between text-sm pt-2 border-t">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-green-600" />
              <span className="font-medium text-xs">
                {format(new Date(checkIn.check_in_time as string), "hh:mm a")}
              </span>
            </div>

            {checkIn.check_out_time && (
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-medium text-xs">
                  {format(new Date(checkIn.check_out_time as string), "hh:mm a")}
                </span>
              </div>
            )}
          </div>

          <div className="text-right text-xs font-semibold text-gray-600">
            <div>
              {isToday(new Date(checkIn.check_in_time as string))
                ? "Today"
                : format(new Date(checkIn.check_in_time as string), "EEEE")}
            </div>
            <div className="text-[10px] text-gray-500">
              {format(new Date(checkIn.check_in_time as string), "MMM dd, yyyy")}
            </div>
          </div>
        </div>

        <div className="relative h-32 bg-muted rounded-lg overflow-hidden">
          <Image
            src={getStaticMapUrl(checkIn.check_in_latitude!, checkIn.check_in_longitude!)}
            alt="Location map"
            className="w-full h-full object-cover"
            width={300}
            height={300}
          />
        </div>

        <Button onClick={() => onViewDetails(checkIn)} className="w-full">
          View Details
        </Button>
      </div>
    </div>
  )
}

