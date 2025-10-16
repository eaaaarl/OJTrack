import { supabase } from "@/libs/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { signUpPayload } from "./interface";

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
  }),
});

export const { useSignUpMutation } = authApi;
