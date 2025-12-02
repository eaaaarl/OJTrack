import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { FormSchema } from "../components/login-form";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    signIn: builder.mutation<
      { meta: { success: boolean; message: string } },
      FormSchema
    >({
      queryFn: async ({ email, password }) => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
        return {
          data: {
            meta: {
              success: true,
              message: "sign in successfully",
            },
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
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
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
          .eq("id", userId);

        if (error) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
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
