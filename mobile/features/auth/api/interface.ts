export interface signUpPayload {
  name: string;
  mobileNo: string;
  email: string;
  password: string;
}

export interface signInPayload {
  email: string;
  password: string;
}

// Profiles

export interface Profile {
  id: string;
  name: string;
  email: string;
  mobileNo: string;
  created_at: string;
}

// Student
export interface StudentProfile {
  id: string;
  user_id: string;
  student_id: string;
  company: string;
  supervisor: string;
  address: string;
  duration: string;
  profile: Profile;
}

export interface createStudentProfilePayload {
  user_id: string;
  student_id: string;
  company: string;
  supervisor: string;
  address: string;
  duration: string;
}
