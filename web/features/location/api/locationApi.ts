import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export type FilterStatus = "ALL" | "checked_in" | "checked_out";

export interface AttendanceResponse {
  attendance: Attendance[];
  meta: {
    success: boolean;
    message: string;
  };
}

export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  check_in_photo_url: string | null;
  check_out_photo_url: string | null;
  check_in_location: string | null;
  check_out_location: string | null;
  check_in_latitude: number | null;
  check_in_longitude: number | null;
  check_out_latitude: number | null;
  check_out_longitude: number | null;
  hours_logged: number | null;
  status: "checked_in" | "checked_out" | "absent";
  created_at: string;
  updated_at: string;
  profiles: AttendanceProfile;
}

export interface AttendanceProfile {
  id: string;
  name: string;
  email: string;
  status: "active" | "inactive" | "suspended";
  mobileNo: string;
  user_type: "student" | "admin" | "supervisor";
  created_at: string;
  student_profiles: StudentProfile[];
}

export interface StudentProfile {
  id: string;
  address: string;
  company: string;
  user_id: string;
  duration: string;
  created_at: string;
  student_id: string;
  supervisor: string;
  updated_at: string | null;
}

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["studentAttendance"],
  endpoints: (builder) => ({
    getStudentAttendance: builder.query<
      AttendanceResponse,
      {
        currentUserId?: string;
        searchQuery?: string;
        statusFilter?: FilterStatus;
      }
    >({
      queryFn: async ({ searchQuery, currentUserId, statusFilter = "ALL" }) => {
        const { data: idData, error: idError } = await supabase.rpc(
          "search_attendance_ids",
          {
            p_search_query: searchQuery || "",
            p_current_user_id: currentUserId,
            p_status_filter: statusFilter,
          }
        );

        if (idError) return { error: { message: idError.message } };

        const attendanceIds = idData
          ? idData.map(
              (item: { attendance_id: string | number }) => item.attendance_id
            )
          : [];

        if (attendanceIds.length === 0) {
          return {
            data: {
              attendance: [],
              meta: { success: true, message: "NO DATA FOUND" },
            },
          };
        }

        const { data: attendance, error } = await supabase
          .from("attendance")
          .select(
            `
          *, 
          profiles:attendance_user_id_fkey1!inner(*, 
            student_profiles:student_profiles_user_id_fkey!inner(*)
          )
        `
          )
          .in("id", attendanceIds);

        if (error) return { error: { message: error.message } };

        return {
          data: {
            attendance: attendance || [],
            meta: { success: true, message: "FETCH ATTENDANCE" },
          },
        };
      },
      providesTags: ["studentAttendance"],
    }),
  }),
});

export const { useGetStudentAttendanceQuery } = locationApi;
