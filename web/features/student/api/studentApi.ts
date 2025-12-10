import { supabase } from "@/lib/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { StudentApiResponse } from "./interface";

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Students"],
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
      providesTags: ["Students"],
    }),

    updateStudent: builder.mutation<
      { success: boolean },
      {
        profileId: string;
        studentProfileId: string;
        profileData: {
          name: string;
          email: string;
          mobileNo: string;
          status: string;
        };
        studentData: {
          student_id: string;
          address: string;
          company: string;
          supervisor: string;
          duration: string;
        };
      }
    >({
      queryFn: async ({
        profileId,
        studentProfileId,
        profileData,
        studentData,
      }) => {
        try {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              name: profileData.name,
              email: profileData.email,
              mobileNo: profileData.mobileNo,
              status: profileData.status,
            })
            .eq("id", profileId);

          if (profileError) {
            return { error: profileError };
          }

          const { error: studentError } = await supabase
            .from("student_profiles")
            .update({
              student_id: studentData.student_id,
              address: studentData.address,
              company: studentData.company,
              supervisor: studentData.supervisor,
              duration: studentData.duration,
            })
            .eq("id", studentProfileId);

          if (studentError) {
            return { error: studentError };
          }

          return { data: { success: true } };
        } catch (err) {
          return {
            error: {
              message:
                err instanceof Error ? err.message : "Failed to update student",
            },
          };
        }
      },
      invalidatesTags: ["Students"],
    }),
  }),
});

export const { useGetStudentsQuery, useUpdateStudentMutation } = studentApi;
