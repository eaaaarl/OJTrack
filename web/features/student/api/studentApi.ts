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
          .select(`*,students:student_profiles(*),attendances:attendance(id)`)
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

    deleteStudent: builder.mutation<
      { meta: { success: boolean; message: string } },
      {
        profileId: string;
        studentProfileId: string;
        studentAttendanceIds: string[];
      }
    >({
      queryFn: async ({
        profileId,
        studentAttendanceIds,
        studentProfileId,
      }) => {
        try {
          const now = new Date().toISOString();
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              status: "deleted",
              deleted_at: now,
            })
            .eq("id", profileId);

          if (profileError) {
            return {
              error: {
                message: `Failed to delete profile: ${profileError.message}`,
              },
            };
          }

          const { error: studentError } = await supabase
            .from("student_profiles")
            .update({
              status: "deleted",
              deleted_at: now,
            })
            .eq("id", studentProfileId);

          if (studentError) {
            return {
              error: {
                message: `Failed to delete student profile: ${studentError.message}`,
              },
            };
          }

          if (studentAttendanceIds.length > 0) {
            const { error: attendanceError } = await supabase
              .from("attendance")
              .update({
                status: "deleted",
                deleted_at: now,
              })
              .in("id", studentAttendanceIds)
              .is("deleted_at", null);
            if (attendanceError) {
              return {
                error: {
                  message: `Failed to delete attendance: ${attendanceError.message}`,
                },
              };
            }
          }

          return {
            data: {
              meta: {
                success: true,
                message: "Student deleted successfully",
              },
            },
          };
        } catch (err) {
          return {
            error: {
              message:
                err instanceof Error ? err.message : "Failed to delete student",
            },
          };
        }
      },
      invalidatesTags: ["Students"],
    }),

    restoreStudent: builder.mutation<
      { meta: { success: boolean; message: string } },
      { profileId: string; studentProfileId: string; attendanceIds: string[] }
    >({
      queryFn: async ({ attendanceIds, profileId, studentProfileId }) => {
        try {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({
              status: "active",
              deleted_at: null,
            })
            .eq("id", profileId);

          if (profileError) {
            return {
              error: {
                message: `Failed to restore profile: ${profileError.message}`,
              },
            };
          }

          const { error: studentError } = await supabase
            .from("student_profiles")
            .update({
              status: "active",
              deleted_at: null,
            })
            .eq("id", studentProfileId);

          if (studentError) {
            return {
              error: {
                message: `Failed to restore student profile: ${studentError.message}`,
              },
            };
          }

          /* if (attendanceIds.length > 0) {
            const { error: attendanceError } = await supabase
              .from("attendance")
              .update({
                status: "",
                deleted_at: null,
              })
              .in("id", attendanceIds);

            if (attendanceError) {
              return {
                error: {
                  message: `Failed to restore attendance records: ${attendanceError.message}`,
                },
              };
            }
          } */

          return {
            data: {
              meta: {
                success: true,
                message: `Student Restored.`,
              },
            },
          };
        } catch (err) {
          return {
            error: {
              message:
                err instanceof Error
                  ? err.message
                  : "Failed to restore student",
            },
          };
        }
      },
      invalidatesTags: ["Students"],
    }),
  }),
});

export const {
  useGetStudentsQuery,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useRestoreStudentMutation,
} = studentApi;
