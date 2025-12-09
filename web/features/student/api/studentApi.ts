import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { StudentApiResponse } from "./interface";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getStudents: builder.query<StudentApiResponse, { currentUserId: string }>({
      queryFn: async ({ currentUserId }) => {
        const { data, error } = await supabase
          .from("profiles")
          .select(`*,students:student_profiles(*)`)
          .neq("id", currentUserId);

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data: {
            profiles: data,
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

export const { useGetStudentsQuery } = studentApi;
