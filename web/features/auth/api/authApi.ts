import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { FormSchema } from "../components/login-form";
import { supabase } from "@/lib/supabase";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    signIn: builder.mutation<any, FormSchema>({
      queryFn: async ({ email, password }) => {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          return { error: { status: "CUSTOM_ERROR", error: error.message } };
        }
        return {
          data: {
            data: data,
            meta: {
              success: true,
              message: "sign in successfully",
            },
          },
        };
      },
    }),
  }),
});
export const { useSignInMutation } = authApi;
