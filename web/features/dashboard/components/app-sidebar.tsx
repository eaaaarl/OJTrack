"use client"

import * as React from "react"
import {
  FrameIcon,
  GalleryVerticalEnd,
  LayoutDashboard,
  Map,
  User,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { TeamSwitcher } from "./team-switcher"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { useGetUserQuery } from "@/features/auth/api/authApi"
import { useAppSelector } from "@/lib/redux/hooks"

const data = {
  teams: [
    {
      name: "OJTrack",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
  ],
  projects: [
    {
      name: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Students",
      url: "/student",
      icon: User,
    },
    {
      name: "Location",
      url: "/location",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
