export interface Database {
  public: {
    Tables: {
      universities: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          tuition_fee: number;
          acceptance_rate: number;
          scholarship_available?: boolean;
          minimum_gpa: number;
          education_gap: number;
          description: string;
          image_url: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          tuition_fee?: number;
          acceptance_rate?: number;
          scholarship_available?: boolean;
          minimum_gpa?: number;
          education_gap?: number;
          description?: string;
          image_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          education_level: string;
          current_gpa: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          education_level: string;
          current_gpa: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          education_level?: string;
          current_gpa?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      applications: {
        Row: {
          id: string;
          user_id: string;
          university_id: string;
          course_id: string;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          university_id: string;
          course_id: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          university_id?: string;
          course_id?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
        };
      };
      application_documents: {
        Row: {
          id: string;
          application_id: string;
          document_type: string;
          file_path: string;
          uploaded_at: string;
          status: 'pending' | 'approved' | 'rejected';
          has_english_test: boolean;
        };
        Insert: {
          id?: string;
          application_id: string;
          document_type: string;
          file_path: string;
          uploaded_at?: string;
          status?: 'pending' | 'approved' | 'rejected';
          has_english_test?: boolean;
        };
        Update: {
          id?: string;
          application_id?: string;
          document_type?: string;
          file_path?: string;
          uploaded_at?: string;
          status?: 'pending' | 'approved' | 'rejected';
          has_english_test?: boolean;
        };
      };
    };
  };
}