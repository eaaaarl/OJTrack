export interface createAttendancePayload {
  user_id: string;
  photo_url: string;
  location: string;
  latitude: number;
  longitude: number;
}

export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  check_in_time: string | null;
  check_out_time: string | null;
  check_in_photo_url: string | null;
  check_out_photo_url: string | null;
  check_in_location: string | null;
  check_out_location: string | null;
  check_in_latitude: number | null;
  check_out_latitude: number | null;
  check_in_longitude: number | null;
  check_out_longitude: number | null;
  hours_logged: number | null;
  status: 'checked_in' | 'completed' | 'not_checked_in';
  created_at: string;
  updated_at: string;
}

export interface AttendanceResponse {
  success: boolean;
  type: 'check_in' | 'check_out';
  message: string;
  time?: string;
  hoursLogged?: number;
  location: string;
  attendance: Attendance;
}