export interface AttendanceResponse {
  attendance: Attendance[];
  meta: {
    success: boolean;
    message: string;
  };
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
  check_in_longitude: number | null;
  check_out_latitude: number | null;
  check_out_longitude: number | null;
  hours_logged: number | null;
  status: 'checked_in' | 'checked_out' | 'absent';
  created_at: string;
  updated_at: string;
  profiles: AttendanceProfile;
}

export interface AttendanceProfile {
  id: string;
  name: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  mobileNo: string;
  user_type: 'student' | 'admin' | 'supervisor';
  created_at: string;
  student_profiles: StudentProfile[]; // Keep as array for now
}

export interface StudentProfile {
  id: string;
  address: string;
  company: string;
  user_id: string;
  duration: string;
  created_at: string;
  student_id: string;
  supervisor: string;
  updated_at: string | null;
}