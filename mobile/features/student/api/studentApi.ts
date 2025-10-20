import { supabase } from "@/libs/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import * as FileSystem from "expo-file-system/legacy";
import { createAttendancePayload } from "./interface";

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
    createAttendance: builder.mutation<any, createAttendancePayload>({
      queryFn: async ({
        photo_url,
        user_id,
        latitude,
        location,
        longitude,
      }) => {
        try {
          const fileExtension = "jpg";
          const fileName = `${user_id}-${Date.now()}.${fileExtension}`;
          const filePath = `checkins/${fileName}`;

          const base64 = await FileSystem.readAsStringAsync(photo_url, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const binaryData = base64ToArrayBuffer(base64);

          const { error: uploadError } = await supabase.storage
            .from("ojtrack-checkins")
            .upload(filePath, binaryData, {
              contentType: "image/jpeg",
              upsert: false,
            });

          if (uploadError) {
            return {
              error: {
                message: uploadError.message,
              },
            };
          }

          const { data: publicData } = supabase.storage
            .from("ojtrack-checkins")
            .getPublicUrl(filePath);

          const { data: attenData, error: dbError } = await supabase
            .from("attendance")
            .insert([
              {
                user_id,
                photo_url: publicData.publicUrl,
                check_in_time: new Date().toISOString(),
                date: new Date().toISOString().split("T")[0],
                status: "present",
                location,
                latitude,
                longitude,
              },
            ])
            .select()
            .single();

          return {
            data: {
              success: true,
              url: publicData.publicUrl,
              attendance: attenData,
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
