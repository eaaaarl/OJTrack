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
          const today = new Date().toISOString().split("T")[0];
          const currentHour = new Date().getHours();

          // Upload photo first
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

          const currentTime = new Date().toISOString();

          // MORNING SHIFT (8am - 12pm)
          if (currentHour >= 8 && currentHour < 12) {
            // Check if morning check-in exists
            if (!existingRecord || !existingRecord.check_in_time) {
              // NEW CHECK-IN (morning)
              const { data: newRecord, error: insertError } = await supabase
                .from("attendance")
                .insert([
                  {
                    user_id,
                    photo_url: publicData.publicUrl,
                    check_in_time: currentTime,
                    date: today,
                    status: "present",
                    location,
                    latitude,
                    longitude,
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
                  type: "morning_check_in",
                  message: "Morning check-in recorded",
                  time: currentTime,
                  attendance: newRecord,
                },
              };
            } else if (
              existingRecord.check_in_time &&
              !existingRecord.check_out_time
            ) {
              // MORNING CHECK-OUT (before lunch)
              const checkInTime = new Date(existingRecord.check_in_time);
              const checkOutTime = new Date(currentTime);
              const hoursLogged =
                (checkOutTime.getTime() - checkInTime.getTime()) /
                (1000 * 60 * 60);

              const { data: updatedRecord, error: updateError } = await supabase
                .from("attendance")
                .update({
                  check_out_time: currentTime,
                  morning_hours: parseFloat(hoursLogged.toFixed(2)),
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
                  type: "morning_check_out",
                  message: "Morning check-out recorded",
                  hoursLogged: updatedRecord.morning_hours,
                  attendance: updatedRecord,
                },
              };
            }
          }

          // AFTERNOON SHIFT (1pm - 5pm)
          if (currentHour >= 13 && currentHour < 17) {
            // Check if afternoon check-in exists
            if (
              existingRecord &&
              existingRecord.check_out_time &&
              !existingRecord.afternoon_check_in
            ) {
              // AFTERNOON CHECK-IN
              const { data: updatedRecord, error: updateError } = await supabase
                .from("attendance")
                .update({
                  afternoon_check_in: currentTime,
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
                  type: "afternoon_check_in",
                  message: "Afternoon check-in recorded",
                  time: currentTime,
                  attendance: updatedRecord,
                },
              };
            } else if (
              existingRecord &&
              existingRecord.afternoon_check_in &&
              !existingRecord.afternoon_check_out
            ) {
              // AFTERNOON CHECK-OUT
              const afternoonCheckInTime = new Date(
                existingRecord.afternoon_check_in
              );
              const checkOutTime = new Date(currentTime);
              const hoursLogged =
                (checkOutTime.getTime() - afternoonCheckInTime.getTime()) /
                (1000 * 60 * 60);

              const { data: updatedRecord, error: updateError } = await supabase
                .from("attendance")
                .update({
                  afternoon_check_out: currentTime,
                  afternoon_hours: parseFloat(hoursLogged.toFixed(2)),
                  hours_logged:
                    (existingRecord.morning_hours || 0) +
                    parseFloat(hoursLogged.toFixed(2)),
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
                  type: "afternoon_check_out",
                  message: "Afternoon check-out recorded",
                  hoursLogged: updatedRecord.hours_logged,
                  attendance: updatedRecord,
                },
              };
            }
          }

          return {
            error: { message: "Check-in/check-out outside working hours" },
          };
        } catch (err: any) {
          console.error("Attendance error:", err);
          return { error: { message: err.message } };
        }
      },
    }),
  }),
});

export const { useCreateAttendanceMutation } = studentApi;
