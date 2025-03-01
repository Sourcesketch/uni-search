/*
  # Initial Schema Setup

  1. Tables
    - universities: Stores university information
    - courses: Stores course information for each university
    - profiles: Stores user profile information
    - applications: Stores student applications
    - application_documents: Stores documents for applications

  2. Security
    - Enable RLS on all tables
    - Create policies for public and authenticated access
    - Set up triggers for updated_at timestamps
*/

-- Create universities table
CREATE TABLE IF NOT EXISTS universities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    location text NOT NULL,
    country text NOT NULL,
    tuition_fee integer NOT NULL,
    acceptance_rate integer NOT NULL,
    scholarship_available boolean NOT NULL DEFAULT false,
    minimum_gpa numeric(3,2) NOT NULL,
    education_gap integer NOT NULL,
    description text NOT NULL,
    image_url text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id uuid REFERENCES universities(id) NOT NULL,
    name text NOT NULL,
    level text NOT NULL CHECK (level IN ('Bachelor''s', 'Master''s')),
    overview text NOT NULL,
    duration text NOT NULL,
    start_addmission text NOT NULL,
    application_deadline text NOT NULL,
    program_structure text NOT NULL,
    academic_requirements text NOT NULL,
    tuition_fee integer NOT NULL,
    scholarship_info text NOT NULL,
    visa_info text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    full_name text NOT NULL,
    education_level text NOT NULL,
    current_gpa numeric(3,2) NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) NOT NULL,
    university_id uuid REFERENCES universities(id) NOT NULL,
    course_id uuid REFERENCES courses(id) NOT NULL,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create application_documents table
CREATE TABLE IF NOT EXISTS application_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id uuid REFERENCES applications(id) NOT NULL,
    document_type text NOT NULL,
    file_path text NOT NULL,
    uploaded_at timestamptz DEFAULT now(),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    has_english_test boolean DEFAULT false
);

-- Enable Row Level Security
DO $$ 
BEGIN
  ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
  ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
  ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
END $$;

-- Create policies for universities
CREATE POLICY "Universities are viewable by everyone" 
    ON universities FOR SELECT 
    TO PUBLIC
    USING (true);

CREATE POLICY "Universities are insertable by authenticated users" 
    ON universities FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

-- Create policies for courses
CREATE POLICY "Courses are viewable by everyone" 
    ON courses FOR SELECT 
    TO PUBLIC
    USING (true);

-- Create policies for profiles
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

-- Create policies for applications
CREATE POLICY "Users can view own applications"
    ON applications FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create applications"
    ON applications FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Create policies for application documents
CREATE POLICY "Users can view own application documents"
    ON application_documents FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = application_documents.application_id 
            AND applications.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own application documents"
    ON application_documents FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM applications 
            WHERE applications.id = application_id 
            AND applications.user_id = auth.uid()
        )
    );

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
DO $$ 
BEGIN
    CREATE TRIGGER update_universities_updated_at
        BEFORE UPDATE ON universities
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_courses_updated_at
        BEFORE UPDATE ON courses
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_profiles_updated_at
        BEFORE UPDATE ON profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_applications_updated_at
        BEFORE UPDATE ON applications
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();

    CREATE TRIGGER update_application_documents_updated_at
        BEFORE UPDATE ON application_documents
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
END $$;