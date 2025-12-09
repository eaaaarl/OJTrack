'use client'

import { useState } from 'react'
import { MapPin, Clock, Search, Building2, CheckCircle, User, Calendar, Navigation } from 'lucide-react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/features/dashboard/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { FilterStatus, useGetStudentAttendanceQuery } from '@/features/location/api/locationApi'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { GEOAPIFY } from '@/constant/geoapify'
import { format, isToday } from "date-fns"
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Attendance } from '@/features/location/api/interface'
import { useAppSelector } from '@/lib/redux/hooks'

export default function LocationPage() {
  const currentUserId = useAppSelector((state) => state.auth.id)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSearchQuery, setActiveSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
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

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getStaticMapUrl = (lat: number, lon: number) => {
    return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=400&height=300&center=lonlat:${lon},${lat}&zoom=15&marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&apiKey=${GEOAPIFY.KEY}`
  }

  const getLargeStaticMapUrl = (lat: number, lon: number) => {
    return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=800&height=400&center=lonlat:${lon},${lat}&zoom=16&marker=lonlat:${lon},${lat};color:%23ff0000;size:large&apiKey=${GEOAPIFY.KEY}`
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      checked_in: 'bg-blue-100 text-blue-700',
      checked_out: 'bg-green-100 text-green-700',
      Valid: 'bg-green-100 text-green-700',
      Late: 'bg-yellow-100 text-yellow-700',
      'Outside Range': 'bg-red-100 text-red-700'
    }
    return styles[status] || styles.Valid
  }

  const handleViewDetails = (checkIn: Attendance) => {
    setSelectedCheckIn(checkIn)
    setIsDialogOpen(true)
  }

  const totalCheckIn = studentAttendanceData?.attendance.filter((c) => c.check_in_time).length
  const totalCheckout = studentAttendanceData?.attendance.filter((co) => co.check_out_time).length

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/location">Location</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Location Monitoring</h1>
            <p className="text-muted-foreground mt-1">Track student check-ins and locations</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by name, student ID, or company..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyUp={handleKeyPress}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="px-6"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
            <div className="flex gap-2">
              <select
                className="px-4 py-2 border rounded-lg bg-background"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
              >
                <option value="ALL">All Statuses</option>
                <option value="checked_in">Checked In</option>
                <option value="checked_out">Checked Out</option>
              </select>
            </div>
          </div>

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

          {studentAttendanceData?.attendance.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No attendance records found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {studentAttendanceData?.attendance.map((checkIn) => {
                const photoUrl = checkIn?.check_in_photo_url
                return (
                  <div key={checkIn.id} className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="relative h-48 bg-linear-to-br from-blue-500 to-purple-600">
                      {photoUrl ? (
                        <Image
                          src={photoUrl}
                          alt={checkIn.profiles.name ?? ''}
                          className="w-full h-full object-cover"
                          width={500}
                          height={500}
                        />
                      ) : null}
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
                        {/* LEFT SIDE — Times */}
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

                      <Button
                        onClick={() => handleViewDetails(checkIn)}
                        className="w-full"
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </SidebarInset>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Attendance Details</DialogTitle>
            <DialogDescription>
              Complete check-in and check-out information
            </DialogDescription>
          </DialogHeader>

          {selectedCheckIn && (
            <div className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-linear-to-br from-blue-500 to-purple-600">

                    <div className="w-full h-full flex items-center justify-center">
                      <span className='text-4xl text-white'>{selectedCheckIn.profiles.name.charAt(0) ?? (<User className="h-10 w-10 text-white" />)}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{selectedCheckIn.profiles.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedCheckIn.profiles.student_profiles[0].student_id}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getStatusBadge(selectedCheckIn.status)}>
                        {selectedCheckIn.status.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {selectedCheckIn.profiles.email}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">Company</span>
                  </div>
                  <p className="text-base font-medium">{selectedCheckIn.profiles.student_profiles[0].company}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Supervisor</span>
                  </div>
                  <p className="text-base font-medium">{selectedCheckIn.profiles.student_profiles[0].supervisor}</p>
                </div>
              </div>

              {/* Time Info */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4 bg-green-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-900">Check In</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="text-lg font-bold text-green-900">
                      {format(new Date(selectedCheckIn.check_in_time as string), "MMM dd, yyyy • hh:mm a")}
                    </p>
                  </div>
                </div>

                {selectedCheckIn.check_out_time ? (
                  <div className="border rounded-lg p-4 bg-blue-50">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-900">Check Out</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Date & Time</p>
                      <p className="text-lg font-bold text-blue-900">
                        {format(new Date(selectedCheckIn.check_out_time as string), "MMM dd, yyyy • hh:mm a")}
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
                      <p className="text-sm text-muted-foreground">{selectedCheckIn.check_in_location || 'Location not available'}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Navigation className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="font-medium">Coordinates</p>
                      <p className="text-sm text-muted-foreground font-mono">
                        {selectedCheckIn.check_in_latitude?.toFixed(6)}, {selectedCheckIn.check_in_longitude?.toFixed(6)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative h-64 bg-muted rounded-lg overflow-hidden border">
                  <Image
                    src={getLargeStaticMapUrl(selectedCheckIn.check_in_latitude!, selectedCheckIn.check_in_longitude!)}
                    alt="Check-in location map"
                    className="w-full h-full object-cover"
                    width={800}
                    height={400}
                  />
                </div>
              </div>

              {selectedCheckIn.check_in_photo_url && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Photo Evidence</h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Check-in Photo</p>
                      <div className="relative h-64 bg-muted rounded-lg overflow-hidden border">
                        <Image
                          src={selectedCheckIn.check_in_photo_url}
                          alt="Check-in photo"
                          className="w-full h-full object-cover"
                          width={400}
                          height={400}
                        />
                      </div>
                    </div>
                    {selectedCheckIn.check_out_photo_url && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Check-out Photo</p>
                        <div className="relative h-64 bg-muted rounded-lg overflow-hidden border">
                          <Image
                            src={selectedCheckIn.check_out_photo_url}
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

              {selectedCheckIn.hours_logged && (
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Hours Logged</p>
                      <p className="text-2xl font-bold">{selectedCheckIn.hours_logged} hours</p>
                    </div>
                    <Calendar className="h-8 w-8 text-muted-foreground" />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}