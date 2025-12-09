'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/features/dashboard/components/app-sidebar"
import { Users, Clock } from 'lucide-react'
import { useGetStudentsQuery } from '@/features/dashboard/api/dashboardApi'
import { useAppSelector } from '@/lib/redux/hooks'

export default function DashboardPage() {
  const user = useAppSelector((state) => state.auth)

  const { data: students } = useGetStudentsQuery({ currentUserId: user.id })

  const totalStudents = students?.students.length
  const activeStudents = students?.students.filter((ss) => ss.status === 'active').length
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
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h1 className="text-3xl font-bold">OJT Tracking Dashboard</h1>
            <p className="text-muted-foreground mt-1">Monitor and manage all OJT students</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-3xl font-bold">{totalStudents}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Students</p>
                  <p className="text-3xl font-bold">{activeStudents}</p>
                </div>
              </div>
            </div>

            {/* <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full">
                  <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Partner Companies</p>
                  <p className="text-3xl font-bold">{stats.companies}</p>
                </div>
              </div>
            </div> */}
          </div>

          {/*  <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Student Progress Overview</h2>
              <div className="space-y-4">
                {recentStudents.map((student) => (
                  <div key={student.id} className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.company}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${student.status === 'Active'
                        ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                        {student.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">{student.hours}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Alerts & Notifications</h2>
              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                    <AlertTriangle className={`h-5 w-5 mt-0.5 ${alert.type === 'warning' ? 'text-yellow-600' :
                      alert.type === 'alert' ? 'text-red-600' :
                        'text-blue-600'
                      }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.student}</p>
                      <p className="text-sm text-muted-foreground">{alert.issue}</p>
                    </div>
                  </div>
                ))} 
              </div>
            </div>
          </div> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}