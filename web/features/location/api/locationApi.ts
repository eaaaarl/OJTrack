import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { AttendanceResponse } from "./interface";

export type FilterStatus = "ALL" | "checked_in" | "checked_out";

export const locationApi = createApi({
  reducerPath: "locationApi",
  baseQuery: fakeBaseQuery(),
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
    }),
  }),
});

export const { useGetStudentAttendanceQuery } = locationApi;
