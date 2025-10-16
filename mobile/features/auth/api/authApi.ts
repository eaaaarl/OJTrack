import { supabase } from "@/libs/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  createStudentProfilePayload,
  signInPayload,
  signUpPayload,
  StudentProfile,
} from "./interface";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    signUp: builder.mutation<any, signUpPayload>({
      queryFn: async ({ email, mobileNo, name, password }) => {
        try {
          const { data: authData, error: authError } =
            await supabase.auth.signUp({
              email,
              password,
            });

          if (authError) {
            return { error: { message: authError.message } };
          }

          if (authData.user) {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: authData.user.id,
                  name,
                  mobileNo: mobileNo,
                  email,
                },
              ])
              .select();

            if (profileError) {
              return { error: { message: profileError.message } };
            }

            return { data: { user: profileData } };
          }

          return { error: { message: "Sign up failed" } };
        } catch (err) {
          return {
            error: {
              message:
                err instanceof Error
                  ? err.message
                  : "An unexpected error occurred",
            },
          };
        }
      },
    }),

    signIn: builder.mutation<any, signInPayload>({
      queryFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data: {
            user: data,
          },
        };
      },
    }),

    signOut: builder.mutation<any, void>({
      queryFn: async () => {
        await supabase.auth.signOut();
        return {
          data: {
            status: true,
          },
        };
      },
    }),

    // Checking student profiles
    checkStudentProfiles: builder.query<StudentProfile, { userId: string }>({
      queryFn: async ({ userId }) => {
        const { data, error } = await supabase
          .from("student_profiles")
          .select("*, profile:student_profiles_user_id_fkey(*)")
          .eq("user_id", userId)
          .single();

        if (error) {
          return {
            error: {
              status: error.code,
              message: error.message,
            },
          };
        }

        return {
          data: data,
        };
      },
    }),

    // Creating student profiles
    createStudentProfile: builder.mutation<
      StudentProfile,
      createStudentProfilePayload
    >({
      queryFn: async (profileData) => {
        const { data, error } = await supabase
          .from("student_profiles")
          .insert([profileData])
          .select()
          .single();

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return { data };
      },
    }),
  }),
});

export const {
  useSignUpMutation,
  useSignOutMutation,
  useSignInMutation,
  useCheckStudentProfilesQuery,
  useCreateStudentProfileMutation,
} = authApi;
