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

// Student

export interface createStudentProfilePayload {
  user_id: string;
  student_id: string;
  company: string;
  supervisor: string;
  address: string;
  duration: string;
}
