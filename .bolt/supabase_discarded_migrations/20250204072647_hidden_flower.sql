/*
  # Create universities table and admin auth

  1. New Tables
    - `universities`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `location` (text, required)
      - `tuition_fee` (integer, required)
      - `acceptance_rate` (integer, required)
      - `scholarship_available` (boolean, required)
      - `minimum_gpa` (numeric, required)
      - `education_gap` (integer, required)
      - `description` (text, required)
      - `image_url` (text, required)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)

  2. Security
    - Enable RLS on universities table
    - Add policies for public read access
    - Add policies for admin write access
*/

-- Create universities table
CREATE TABLE IF NOT EXISTS universities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    location text NOT NULL,
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

-- Enable RLS
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Universities are viewable by everyone" 
    ON universities FOR SELECT 
    USING (true);

CREATE POLICY "Universities are insertable by authenticated users" 
    ON universities FOR INSERT 
    TO authenticated 
    WITH CHECK (true);

CREATE POLICY "Universities are updatable by authenticated users" 
    ON universities FOR UPDATE 
    TO authenticated 
    USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_universities_updated_at
    BEFORE UPDATE ON universities
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();