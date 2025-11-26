'use client'

import { useState } from 'react'
import { MapPin, Clock, Calendar, Search, Filter, User, Building2, CheckCircle, AlertTriangle } from 'lucide-react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/features/dashboard/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'

export default function LocationPage() {
  const [selectedDate, setSelectedDate] = useState('2024-11-26')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const [checkIns] = useState([
    {
      id: 1,
      studentName: "Juan Dela Cruz",
      studentId: "2021-00123",
      company: "Tech Solutions Inc.",
      address: "Ayala Avenue, Makati City",
      latitude: 14.5547,
      longitude: 121.0244,
      checkInTime: "08:45 AM",
      checkOutTime: "05:30 PM",
      status: "Valid",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Juan",
      date: "2024-11-26"
    },
    {
      id: 2,
      studentName: "Maria Santos",
      studentId: "2021-00145",
      company: "Digital Corp",
      address: "BGC, Taguig City",
      latitude: 14.5514,
      longitude: 121.0471,
      checkInTime: "08:30 AM",
      checkOutTime: "05:45 PM",
      status: "Valid",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
      date: "2024-11-26"
    },
    {
      id: 3,
      studentName: "Pedro Reyes",
      studentId: "2021-00167",
      company: "Web Innovations",
      address: "Ortigas Center, Pasig City",
      latitude: 14.5832,
      longitude: 121.0610,
      checkInTime: "09:15 AM",
      checkOutTime: null,
      status: "Late",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro",
      date: "2024-11-26"
    },
    {
      id: 4,
      studentName: "Ana Garcia",
      studentId: "2021-00189",
      company: "Tech Solutions Inc.",
      address: "Makati Avenue, Makati City",
      latitude: 14.5648,
      longitude: 121.0245,
      checkInTime: "08:50 AM",
      checkOutTime: "05:15 PM",
      status: "Valid",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
      date: "2024-11-26"
    },
    {
      id: 5,
      studentName: "Carlos Lopez",
      studentId: "2021-00201",
      company: "Cloud Systems",
      address: "Mandaluyong City",
      latitude: 14.5794,
      longitude: 121.0359,
      checkInTime: "10:30 AM",
      checkOutTime: null,
      status: "Outside Range",
      imageUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
      date: "2024-11-26"
    },
  ])

  const getStaticMapUrl = (lat, lon) => {
    const apiKey = 'YOUR_GEOAPIFY_API_KEY'
    return `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=400&height=300&center=lonlat:${lon},${lat}&zoom=15&marker=lonlat:${lon},${lat};color:%23ff0000;size:medium&apiKey=${apiKey}`
  }

  const filteredCheckIns = checkIns.filter(checkIn => {
    const matchesSearch = checkIn.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      checkIn.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      checkIn.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || checkIn.status.toLowerCase().replace(' ', '') === filterType.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    const styles = {
      Valid: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      Late: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      'Outside Range': 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
    }
    return styles[status] || styles.Valid
  }

  const stats = {
    total: checkIns.length,
    valid: checkIns.filter(c => c.status === 'Valid').length,
    late: checkIns.filter(c => c.status === 'Late').length,
    issues: checkIns.filter(c => c.status === 'Outside Range').length
  }

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
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Location Monitoring</h1>
            <p className="text-muted-foreground mt-1">Track student check-ins and locations</p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by name, student ID, or company..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <input
                type="date"
                className="px-4 py-2 border rounded-lg bg-background"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <select
                className="px-4 py-2 border rounded-lg bg-background"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="valid">Valid</option>
                <option value="late">Late</option>
                <option value="outsiderange">Outside Range</option>
              </select>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Check-ins</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Valid</p>
                  <p className="text-2xl font-bold">{stats.valid}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Late</p>
                  <p className="text-2xl font-bold">{stats.late}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Issues</p>
                  <p className="text-2xl font-bold">{stats.issues}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Check-ins Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCheckIns.map((checkIn) => (
              <div key={checkIn.id} className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Student Image */}
                <div className="relative h-40 bg-gradient-to-br from-blue-500 to-purple-600">
                  <img
                    src={checkIn.imageUrl}
                    alt={checkIn.studentName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(checkIn.status)}`}>
                      {checkIn.status}
                    </span>
                  </div>
                </div>

                {/* Student Info */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg">{checkIn.studentName}</h3>
                    <p className="text-sm text-muted-foreground">{checkIn.studentId}</p>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">{checkIn.company}</span>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <span className="text-muted-foreground">{checkIn.address}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="font-medium">In: {checkIn.checkInTime}</span>
                    </div>
                    {checkIn.checkOutTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-red-600" />
                        <span className="font-medium">Out: {checkIn.checkOutTime}</span>
                      </div>
                    )}
                  </div>

                  {/* Map Preview - using placeholder since we need API key */}
                  <div className="relative h-32 bg-muted rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-950">
                      <div className="text-center">
                        <MapPin className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">
                          {checkIn.latitude.toFixed(4)}, {checkIn.longitude.toFixed(4)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Map preview (Add Geoapify API key)
                        </p>
                      </div>
                    </div>
                    {/* Uncomment when you add your Geoapify API key */}
                    {/* <img 
                  src={getStaticMapUrl(checkIn.latitude, checkIn.longitude)}
                  alt="Location map"
                  className="w-full h-full object-cover"
                /> */}
                  </div>

                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredCheckIns.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No check-ins found matching your criteria</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}