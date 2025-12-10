'use client'

import { Clock, Building2, MapPin, Navigation, User, Calendar } from 'lucide-react'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Attendance } from '../api/locationApi'
import { GEOAPIFY } from '@/constant/geoapify'

interface AttendanceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  checkIn: Attendance | null
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

function getLargeStaticMapUrl(lat: number, lon: number) {
  return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=800&height=400&center=lonlat:${lon},${lat}&zoom=16&marker=lonlat:${lon},${lat};color:%23ff0000;size:large&apiKey=${GEOAPIFY.KEY}`
}

export function AttendanceDialog({ open, onOpenChange, checkIn }: AttendanceDialogProps) {
  if (!checkIn) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Attendance Details</DialogTitle>
          <DialogDescription>
            Complete check-in and check-out information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start gap-4">
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-purple-600">
                <div className="w-full h-full flex items-center justify-center">
                  <span className='text-4xl text-white'>
                    {checkIn.profiles.name.charAt(0) ?? (<User className="h-10 w-10 text-white" />)}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{checkIn.profiles.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {checkIn.profiles.student_profiles[0].student_id}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={getStatusBadge(checkIn.status)}>
                    {checkIn.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {checkIn.profiles.email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span className="font-medium">Company</span>
              </div>
              <p className="text-base font-medium">{checkIn.profiles.student_profiles[0].company}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="font-medium">Supervisor</span>
              </div>
              <p className="text-base font-medium">{checkIn.profiles.student_profiles[0].supervisor}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border rounded-lg p-4 bg-green-50">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-900">Check In</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="text-lg font-bold text-green-900">
                  {format(new Date(checkIn.check_in_time as string), "MMM dd, yyyy • hh:mm a")}
                </p>
              </div>
            </div>

            {checkIn.check_out_time ? (
              <div className="border rounded-lg p-4 bg-blue-50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Check Out</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="text-lg font-bold text-blue-900">
                    {format(new Date(checkIn.check_out_time as string), "MMM dd, yyyy • hh:mm a")}
                  </p>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-gray-600" />
                  <span className="font-semibold text-gray-900">Check Out</span>
                </div>
                <p className="text-sm text-muted-foreground">Not checked out yet</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Check-in Location</h4>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    {checkIn.check_in_location || 'Location not available'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Navigation className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Coordinates</p>
                  <p className="text-sm text-muted-foreground font-mono">
                    {checkIn.check_in_latitude?.toFixed(6)}, {checkIn.check_in_longitude?.toFixed(6)}
                  </p>
                </div>
              </div>
            </div>

            <div className="relative h-64 bg-muted rounded-lg overflow-hidden border">
              <Image
                src={getLargeStaticMapUrl(checkIn.check_in_latitude!, checkIn.check_in_longitude!)}
                alt="Check-in location map"
                className="w-full h-full object-cover"
                width={800}
                height={400}
              />
            </div>
          </div>

          {checkIn.check_in_photo_url && (
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Photo Evidence</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Check-in Photo</p>
                  <div className="relative h-64 bg-muted rounded-lg overflow-hidden border">
                    <Image
                      src={checkIn.check_in_photo_url}
                      alt="Check-in photo"
                      className="w-full h-full object-cover"
                      width={400}
                      height={400}
                    />
                  </div>
                </div>
                {checkIn.check_out_photo_url && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Check-out Photo</p>
                    <div className="relative h-64 bg-muted rounded-lg overflow-hidden border">
                      <Image
                        src={checkIn.check_out_photo_url}
                        alt="Check-out photo"
                        className="w-full h-full object-cover"
                        width={400}
                        height={400}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {checkIn.hours_logged && (
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours Logged</p>
                  <p className="text-2xl font-bold">{checkIn.hours_logged} hours</p>
                </div>
                <Calendar className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

