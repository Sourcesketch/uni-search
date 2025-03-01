/*
  # Add courses and programs

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `university_id` (uuid, foreign key to universities)
      - `name` (text)
      - `level` (text) - Bachelor's or Master's
      - `overview` (text)
      - `duration` (text)
      - `start_dates` (text[])
      - `application_deadline` (text[])
      - `program_structure` (text)
      - `academic_requirements` (text)
      - `tuition_fee` (integer)
      - `scholarship_info` (text)
      - `visa_info` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `courses` table
    - Add policies for viewing courses
*/

CREATE TABLE IF NOT EXISTS courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id uuid REFERENCES universities(id) NOT NULL,
    name text NOT NULL,
    level text NOT NULL CHECK (level IN ('Bachelor''s', 'Master''s')),
    overview text NOT NULL,
    duration text NOT NULL,
    start_dates text[] NOT NULL,
    application_deadline text[] NOT NULL,
    program_structure text NOT NULL,
    academic_requirements text NOT NULL,
    tuition_fee integer NOT NULL,
    scholarship_info text NOT NULL,
    visa_info text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Courses are viewable by everyone" 
    ON courses FOR SELECT 
    USING (true);

-- Create updated_at trigger
CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();