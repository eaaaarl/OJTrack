'use client'

import { useState } from 'react'
import { Search, CheckCircle, XCircle, Clock, User2 } from 'lucide-react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/features/dashboard/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'
import { useGetStudentsQuery, useUpdateStudentMutation } from '@/features/student/api/studentApi'
import { useAppSelector, useAppDispatch } from '@/lib/redux/hooks'
import { skipToken } from '@reduxjs/toolkit/query'
import { studentColumn } from '@/features/student/utils/studentDataTable'
import { flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Profile } from '@/features/student/api/interface'
import StudentViewDialog from '@/features/student/components/StudentViewDialog'
import StudentEditDialog, { StudentEditFormData } from '@/features/student/components/StudentEditDialog'
import { locationApi } from '@/features/location/api/locationApi'

export default function StudentPage() {
  const dispatch = useAppDispatch()
  const currentUserId = useAppSelector((state) => state.auth.id)
  const [searchQuery, setSearchQuery] = useState('')

  const { data: studentsData } = useGetStudentsQuery(
    currentUserId ? { currentUserId } : skipToken
  );

  const [viewDialogState, setViewDialogState] = useState(false)
  const [profileToView, setProfileToView] = useState<Profile | null>(null)

  const [editDialogState, setEditDialogState] = useState(false)
  const [profileToEdit, setProfileToEdit] = useState<Profile | null>(null)

  // Handler for Dialog
  const ViewDialog = (data: Profile) => {
    setProfileToView(data)
    setViewDialogState(true)
  }
  const EditDialog = (data: Profile) => {
    setEditDialogState(true)
    setProfileToEdit(data)
  }

  // RTK QUERY MUTATION
  const [updateStudent, { isLoading }] = useUpdateStudentMutation()
  // Handler For Mutation EDIT
  const handleSubmitUpdateStudent = async (formData: StudentEditFormData, profileId: string, studentProfileId: string) => {
    try {
      await updateStudent({
        profileId,
        studentProfileId,
        profileData: {
          email: formData.email,
          mobileNo: formData.mobileNo,
          name: formData.name,
          status: formData.status
        },
        studentData: {
          address: formData.address,
          company: formData.company,
          duration: formData.duration,
          student_id: formData.student_id,
          supervisor: formData.supervisor
        }
      }).unwrap()

      setEditDialogState(false);

      // Invalidate location API cache to refresh student data
      dispatch(locationApi.util.invalidateTags(['studentAttendance']))

    } catch (error) {
      console.error('Failed to update student:', error);
    }
  }

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: studentsData?.profiles || [],
    columns: studentColumn({
      onView: ViewDialog,
      onEdit: EditDialog
    }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: searchQuery
    },
    onGlobalFilterChange: setSearchQuery,
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5
      }
    }
  });


  const studentsActive = studentsData?.profiles.filter((p) => p.status === 'active').length
  const studentInactive = studentsData?.profiles.filter((p) => p.status === 'inactive').length
  const studentSuspended = studentsData?.profiles.filter((p) => p.status === 'suspended').length

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
                  <BreadcrumbLink href="/student">Student</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-6 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Student Monitoring</h1>
            <p className="text-muted-foreground mt-1">View and manage all OJT students</p>
          </div>

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
              <Select
                value={(table.getColumn("status")?.getFilterValue() as string) ?? "all"}
                onValueChange={(value) => {
                  table.getColumn("status")?.setFilterValue(value === "all" ? "" : value);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{studentsActive}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold">{studentInactive}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Suspended</p>
                  <p className="text-2xl font-bold">{studentSuspended}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <User2 className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{studentsData?.profiles.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((hg) => (
                    <TableRow key={hg.id}>
                      {hg.headers.map((hd) => {
                        return (
                          <TableHead key={hd.id}>
                            {hd.isPlaceholder ? null : flexRender(hd.column.columnDef.header, hd.getContext())}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell className='p-6' key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={table.getAllColumns().length} className="h-24 text-center">
                        {(searchQuery) ? "No users found matching your search." : "No users found."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{' '}
                of {table.getFilteredRowModel().rows.length} users
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        <StudentViewDialog
          open={viewDialogState}
          onOpenChange={setViewDialogState}
          profile={profileToView}
        />

        <StudentEditDialog
          open={editDialogState}
          onOpenChange={setEditDialogState}
          profile={profileToEdit}
          isLoading={isLoading}
          onSubmit={handleSubmitUpdateStudent}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}