export interface StudentApiResponse {
  profiles: Profile[];
  meta: Meta;
}

export interface Profile {
  id: string;
  name: string;
  mobileNo: string;
  email: string;
  created_at: string;
  user_type: string;
  status: string;
  students: StudentProfile[];
  attendances?: {
    id: string;
  }[];
  deleted_at: string;
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

export interface Meta {
  success: boolean;
  message: string;
}
