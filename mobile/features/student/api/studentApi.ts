import { supabase } from "@/libs/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import * as FileSystem from "expo-file-system/legacy";

function base64ToArrayBuffer(base64: string) {
  const binaryString = global.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const studentApi = createApi({
  reducerPath: "studentApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    createAttendance: builder.mutation<
      any,
      { photo_url: string; user_id: string }
    >({
      queryFn: async ({ photo_url, user_id }) => {
        try {
          console.log("Photo URI:", photo_url);

          const fileExtension = "jpg";
          const fileName = `${user_id}-${Date.now()}.${fileExtension}`;
          const filePath = `checkins/${fileName}`;

          // ✅ Read file as base64
          const base64 = await FileSystem.readAsStringAsync(photo_url, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // ✅ Convert to binary
          const binaryData = base64ToArrayBuffer(base64);

          // ✅ Upload binary to Supabase
          const { data, error } = await supabase.storage
            .from("ojtrack-checkins")
            .upload(filePath, binaryData, {
              contentType: "image/jpeg",
              upsert: false,
            });

          if (error) throw error;

          const { data: publicData } = supabase.storage
            .from("ojtrack-checkins")
            .getPublicUrl(filePath);

          return {
            data: {
              success: true,
              url: publicData.publicUrl,
            },
          };
        } catch (err: any) {
          console.error("Upload error:", err);
          return { error: { message: err.message } };
        }
      },
    }),
  }),
});

export const { useCreateAttendanceMutation } = studentApi;
