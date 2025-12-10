import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getStudents: builder.query<
      {
        meta: {
          success: boolean;
          message: string;
        };
        students: {
          id: string;
          name: string;
          mobileNo: string;
          created_at: string;
          userType: "admin" | "student";
          status: "active" | "inactive" | "suspended" | "deleted";
        }[];
      },
      { currentUserId: string }
    >({
      queryFn: async ({ currentUserId }) => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .neq("id", currentUserId)
          .is("deleted_at", null);

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data: {
            students: data,
            meta: {
              success: true,
              message: "FETCH STUDENTS",
            },
          },
        };
      },
    }),
  }),
});

export const { useGetStudentsQuery } = dashboardApi;
