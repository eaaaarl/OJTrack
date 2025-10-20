import { supabase } from "@/libs/supabase";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import * as FileSystem from "expo-file-system/legacy";
import { getWeekDates } from "../utils/getWeeksDate";
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
          const today = new Date().toISOString().split("T")[0];
          const currentTime = new Date().toISOString();

          // Get today's attendance record FIRST to determine if check-in or check-out
          const { data: existingRecordTodayAttendance } = await supabase
            .from("attendance")
            .select("*")
            .eq("user_id", user_id)
            .eq("date", today)
            .maybeSingle();

          // Determine if this is check-in or check-out
          const isCheckIn =
            !existingRecordTodayAttendance ||
            !existingRecordTodayAttendance.check_in_time;
          const folderType = isCheckIn ? "checkins" : "checkouts";

          // Upload photo to appropriate folder
          const fileExtension = "jpg";
          const fileName = `${user_id}-${Date.now()}.${fileExtension}`;
          const filePath = `${folderType}/${fileName}`;

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
            return { error: { message: uploadError.message } };
          }

          const { data: publicData } = supabase.storage
            .from("ojtrack-checkins")
            .getPublicUrl(filePath);

          // Get today's attendance record
          const { data: existingRecord } = await supabase
            .from("attendance")
            .select("*")
            .eq("user_id", user_id)
            .eq("date", today)
            .maybeSingle();

          // NO EXISTING RECORD - CREATE NEW CHECK-IN
          if (!existingRecord) {
            const { data: newRecord, error: insertError } = await supabase
              .from("attendance")
              .insert([
                {
                  user_id,
                  check_in_photo_url: publicData.publicUrl,
                  check_in_time: currentTime,
                  check_in_location: location,
                  check_in_latitude: latitude,
                  check_in_longitude: longitude,
                  date: today,
                  status: "checked_in",
                },
              ])
              .select()
              .single();

            if (insertError) {
              return { error: { message: insertError.message } };
            }

            return {
              data: {
                success: true,
                type: "check_in",
                message: "Check-in recorded",
                time: currentTime,
                location: location,
                attendance: newRecord,
              },
            };
          }

          // EXISTING RECORD WITH CHECK-IN BUT NO CHECK-OUT - CREATE CHECK-OUT
          if (existingRecord.check_in_time && !existingRecord.check_out_time) {
            const checkInTime = new Date(existingRecord.check_in_time);
            const checkOutTime = new Date(currentTime);
            const hoursLogged =
              (checkOutTime.getTime() - checkInTime.getTime()) /
              (1000 * 60 * 60);

            const { data: updatedRecord, error: updateError } = await supabase
              .from("attendance")
              .update({
                check_out_time: currentTime,
                check_out_photo_url: publicData.publicUrl,
                check_out_location: location,
                check_out_latitude: latitude,
                check_out_longitude: longitude,
                hours_logged: parseFloat(hoursLogged.toFixed(2)),
                status: "completed",
              })
              .eq("id", existingRecord.id)
              .select()
              .single();

            if (updateError) {
              return { error: { message: updateError.message } };
            }

            return {
              data: {
                success: true,
                type: "check_out",
                message: "Check-out recorded",
                hoursLogged: updatedRecord.hours_logged,
                location: location,
                attendance: updatedRecord,
              },
            };
          }

          // RECORD ALREADY HAS CHECK-IN AND CHECK-OUT
          return {
            error: {
              message: "Attendance already completed for today",
            },
          };
        } catch (err: any) {
          console.error("Attendance error:", err);
          return { error: { message: err.message } };
        }
      },
    }),

    getTodayAttendance: builder.query<any, { userId: string }>({
      queryFn: async ({ userId }) => {
        const today = new Date().toISOString().split("T")[0];
        const { data, error } = await supabase
          .from("attendance")
          .select("*")
          .eq("user_id", userId)
          .eq("date", today)
          .maybeSingle();

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data,
        };
      },
    }),

    getWeekAttendance: builder.query<any, { userId: string }>({
      queryFn: async ({ userId }) => {
        const weekDates = getWeekDates();
        const startDate = weekDates[0].date;
        const endDate = weekDates[6].date;

        const { data, error } = await supabase
          .from("attendance")
          .select("*")
          .eq("user_id", userId)
          .gte("date", startDate)
          .lte("date", endDate)
          .order("date", { ascending: true });

        if (error) {
          return {
            error: {
              message: error.message,
            },
          };
        }

        return {
          data,
        };
      },
    }),
  }),
});

export const {
  useCreateAttendanceMutation,
  useGetTodayAttendanceQuery,
  useGetWeekAttendanceQuery,
} = studentApi;
