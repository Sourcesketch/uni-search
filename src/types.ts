export interface University {
  id: string;
  name: string;
  location: string;
  tuition_fee: number;
  acceptance_rate: number;
  scholarship_available: boolean;
  minimum_gpa: number;
  education_gap: number;
  description: string;
  image_url: string;
  created_at?: string;
  updated_at?: string;
  courses?: Course[];
  bachelors_count?: number;
  masters_count?: number;
  country: string;
}

export interface Course {
  id: string;
  university_id: string;
  name: string;
  level: 'Bachelor\'s' | 'Master\'s';
  overview: string;
  duration: string;
  application_deadline: string;
  program_structure: string;
  academic_requirements: string;
  tuition_fee: number;
  scholarship_info: string;
  visa_info: string;
  created_at?: string;
  updated_at?: string;
  start_addmission: string;
}

export interface Profile {
  id: string;
  full_name: string;
  education_level: string;
  current_gpa: number;
  created_at?: string;
  updated_at?: string;
}

export interface Application {
  id: string;
  user_id: string;
  university_id: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
  updated_at?: string;
  university?: University;
  course_id?: string;
  course?: Course;
}

export interface ApplicationDocument {
  id: string;
  application_id: string;
  document_type: string;
  file_path: string;
  uploaded_at?: string;
  status: 'pending' | 'approved' | 'rejected';
  has_english_test: boolean;
}

export interface FilterOptions {
  minGPA: number;
  maxTuition: number;
  maxEducationGap: number;
  scholarshipRequired: boolean;
}

export interface AuthFormData {
  email: string;
  password: string;
  full_name: string;
  education_level: string;
  current_gpa: string;
}