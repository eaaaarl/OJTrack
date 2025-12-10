'use client'

import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/features/dashboard/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { SearchBar } from '@/features/location/components/SearchBar'
import { StatsCards } from '@/features/location/components/StatsCards'
import { AttendanceCard } from '@/features/location/components/AttendanceCard'
import { AttendanceDialog } from '@/features/location/components/AttendanceDialog'
import { useLocationPage } from '@/features/location/hooks/useLocationPage'

export default function LocationPage() {
  const {
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
  } = useLocationPage()

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

          <SearchBar
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            onSearch={handleSearch}
            filterStatus={filterStatus}
            onFilterStatusChange={setFilterStatus}
          />

          {studentAttendanceData?.attendance && (
            <StatsCards attendance={studentAttendanceData.attendance} />
          )}

          {studentAttendanceData?.attendance.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No attendance records found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {studentAttendanceData?.attendance.map((checkIn) => (
                <AttendanceCard
                  key={checkIn.id}
                  checkIn={checkIn}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}
        </div>
      </SidebarInset>

      <AttendanceDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        checkIn={selectedCheckIn}
      />
    </SidebarProvider>
  )
}