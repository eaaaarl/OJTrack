'use client'

import { useState } from 'react'
import { Search, Filter, MoreVertical, Eye, Edit, CheckCircle, XCircle, Clock } from 'lucide-react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AppSidebar } from '@/features/dashboard/components/app-sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList } from '@/components/ui/breadcrumb'

export default function StudentPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [students] = useState([
    {
      id: 1,
      name: "Juan Dela Cruz",
      email: "juan.delacruz@email.com",
      studentId: "2021-00123",
      company: "Tech Solutions Inc.",
      department: "Software Development",
      supervisor: "Mr. Robert Chen",
      hoursCompleted: 320,
      hoursRequired: 500,
      attendance: 95,
      status: "Active",
      startDate: "Sep 1, 2024",
      endDate: "Dec 15, 2024"
    },
    {
      id: 2,
      name: "Maria Santos",
      email: "maria.santos@email.com",
      studentId: "2021-00145",
      company: "Digital Corp",
      department: "Web Development",
      supervisor: "Ms. Sarah Johnson",
      hoursCompleted: 450,
      hoursRequired: 500,
      attendance: 98,
      status: "Active",
      startDate: "Aug 15, 2024",
      endDate: "Dec 1, 2024"
    },
    {
      id: 3,
      name: "Pedro Reyes",
      email: "pedro.reyes@email.com",
      studentId: "2021-00167",
      company: "Web Innovations",
      department: "UI/UX Design",
      supervisor: "Ms. Lisa Wong",
      hoursCompleted: 180,
      hoursRequired: 500,
      attendance: 88,
      status: "Active",
      startDate: "Sep 10, 2024",
      endDate: "Dec 20, 2024"
    },
    {
      id: 4,
      name: "Ana Garcia",
      email: "ana.garcia@email.com",
      studentId: "2021-00189",
      company: "Tech Solutions Inc.",
      department: "Data Analytics",
      supervisor: "Mr. James Lee",
      hoursCompleted: 95,
      hoursRequired: 500,
      attendance: 92,
      status: "Active",
      startDate: "Oct 1, 2024",
      endDate: "Jan 15, 2025"
    },
    {
      id: 5,
      name: "Carlos Lopez",
      email: "carlos.lopez@email.com",
      studentId: "2021-00201",
      company: "Cloud Systems",
      department: "IT Support",
      supervisor: "Mr. Michael Brown",
      hoursCompleted: 0,
      hoursRequired: 500,
      attendance: 0,
      status: "Pending",
      startDate: "Nov 20, 2024",
      endDate: "Feb 28, 2025"
    },
    {
      id: 6,
      name: "Sofia Ramos",
      email: "sofia.ramos@email.com",
      studentId: "2021-00234",
      company: "Mobile Tech Inc.",
      department: "Mobile Development",
      supervisor: "Ms. Emily Davis",
      hoursCompleted: 500,
      hoursRequired: 500,
      attendance: 100,
      status: "Completed",
      startDate: "Jul 1, 2024",
      endDate: "Nov 15, 2024"
    },
  ])

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.company.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || student.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (status) => {
    const styles = {
      Active: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
      Pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
      Completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
      Inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
    }
    return styles[status] || styles.Active
  }

  const getProgressColor = (progress) => {
    if (progress >= 90) return 'bg-green-600'
    if (progress >= 60) return 'bg-blue-600'
    if (progress >= 30) return 'bg-yellow-600'
    return 'bg-red-600'
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
                  <BreadcrumbLink href="/student">Student</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="p-6 space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Student Monitoring</h1>
            <p className="text-muted-foreground mt-1">View and manage all OJT students</p>
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
              <select
                className="px-4 py-2 border rounded-lg bg-background"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <button className="px-4 py-2 border rounded-lg bg-background hover:bg-muted flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">More Filters</span>
              </button>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold">{students.filter(s => s.status === 'Active').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{students.filter(s => s.status === 'Pending').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{students.filter(s => s.status === 'Completed').length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-gray-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold">{students.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-card border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left p-4 font-semibold">Student</th>
                    <th className="text-left p-4 font-semibold">Company</th>
                    <th className="text-left p-4 font-semibold">Hours Progress</th>
                    <th className="text-left p-4 font-semibold">Attendance</th>
                    <th className="text-left p-4 font-semibold">Status</th>
                    <th className="text-left p-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => {
                    const progress = (student.hoursCompleted / student.hoursRequired * 100)
                    return (
                      <tr key={student.id} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.studentId}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium text-sm">{student.company}</p>
                            <p className="text-xs text-muted-foreground">{student.department}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{student.hoursCompleted}/{student.hoursRequired} hrs</span>
                              <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div
                                className={`${getProgressColor(progress)} h-2 rounded-full transition-all`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{student.attendance}%</span>
                            {student.attendance >= 95 ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : student.attendance >= 85 ? (
                              <Clock className="h-4 w-4 text-yellow-600" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getStatusBadge(student.status)}`}>
                            {student.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View Details">
                              <Eye className="h-4 w-4" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit">
                              <Edit className="h-4 w-4" />
                            </button>
                            <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="More">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* No Results */}
          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No students found matching your criteria</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}