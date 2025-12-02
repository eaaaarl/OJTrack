import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { FormSchema } from "../components/login-form";
import { supabase } from "@/lib/supabase";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    signIn: builder.mutation<
      {
        meta: { success: boolean; message: string };
        userType: "admin" | "student" | "";
        id: string;
        email: string;
      },
      FormSchema
    >({
      queryFn: async ({ email, password }) => {
        const { data: authData, error: authError } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });
        if (authError) {
          return {
            error: { status: "CUSTOM_ERROR", error: authError.message },
          };
        }

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("user_type")
          .eq("id", authData.user.id)
          .single();

        if (profileError) {
          await supabase.auth.signOut();
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Unable to verify user profile",
            },
          };
        }

        if (profile.user_type !== "admin") {
          await supabase.auth.signOut();
          return {
            error: {
              status: "CUSTOM_ERROR",
              error: "Access denied. Admin privileges required.",
            },
          };
        }

        return {
          data: {
            meta: {
              success: true,
              message: "sign in successfully",
            },
            userType: profile.user_type!,
            id: authData.user.id!,
            email: authData.user.email!,
          },
        };
      },
    }),

    signOut: builder.mutation<
      { meta: { success: boolean; message: string } },
      void
    >({
      queryFn: async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
          return { error: { status: "CUSTOM_ERROR", message: error.message } };
        }

        return {
          data: {
            meta: {
              success: true,
              message: "sign out successfully",
            },
          },
        };
      },
    }),

    getUser: builder.query<
      { meta: { success: boolean; message: string }; profile: any },
      { userId: string }
    >({
      queryFn: async ({ userId }) => {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) {
          return { error: { status: "CUSTOM_ERROR", message: error.message } };
        }

        return {
          data: {
            meta: {
              message: "USER GET",
              success: true,
            },
            profile: data,
          },
        };
      },
    }),
  }),
});
export const {
  useSignInMutation,
  useSignOutMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
} = authApi;
