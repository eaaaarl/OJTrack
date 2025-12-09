import { createColumnHelper } from "@tanstack/react-table";
import { Profile } from "../api/interface";
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash2, Building2, User } from "lucide-react";

const columnHelper = createColumnHelper<Profile>();

export const studentColumn = () => {
  return [
    // Student Info (Name + ID + Contact)
    columnHelper.accessor("name", {
      header: () => <span className="font-semibold">Student</span>,
      cell: (info) => {
        const profile = info.row.original;
        const fullName = info.getValue() || "Unknown Student";
        const studentId = profile.students[0]?.student_id || "N/A";
        return (
          <div className="space-y-1">
            <div className="font-medium text-gray-900">{fullName}</div>
            <div className="text-sm text-gray-500">ID: {studentId}</div>
            <div className="text-sm text-gray-500">{profile.email}</div>
          </div>
        );
      },
    }),

    // Company + Supervisor
    columnHelper.accessor((row) => row.students[0]?.company, {
      id: "company",
      header: () => <span className="font-semibold">Placement</span>,
      cell: (info) => {
        const profile = info.row.original;
        const company = info.getValue() || "Not assigned";
        const supervisor = profile.students[0]?.supervisor || "No supervisor";
        return (
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-900">{company}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">{supervisor}</span>
            </div>
          </div>
        );
      },
    }),

    // Duration + Status
    columnHelper.accessor((row) => row.students[0]?.duration, {
      id: "duration",
      header: () => <span className="font-semibold">Status</span>,
      cell: (info) => {
        const profile = info.row.original;
        const duration = info.getValue();
        const status = profile.status;
        return (
          <div className="space-y-2">
            <div className="text-sm text-gray-700">
              {duration ? (
                <span className="font-medium">{duration} months</span>
              ) : (
                <span className="text-gray-400">Not set</span>
              )}
            </div>
            <Badge
              variant={status === "active" ? "default" : "secondary"}
              className={
                status === "active"
                  ? "bg-green-100 text-green-700 hover:bg-green-100"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-100"
              }
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
          </div>
        );
      },
    }),

    // Actions
    columnHelper.display({
      id: "actions",
      header: () => "",
      cell: (info) => {
        const profile = info.row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-xs text-gray-500 font-normal">
                Actions
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => console.log("View", profile.id)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => console.log("Edit", profile.id)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Student
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 cursor-pointer"
                onClick={() => console.log("Delete", profile.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Student
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    }),
  ];
};