/*
  # Add application documents tracking

  1. New Tables
    - `application_documents`
      - `id` (uuid, primary key)
      - `application_id` (uuid, references applications)
      - `document_type` (text)
      - `file_path` (text)
      - `uploaded_at` (timestamptz)
      - `status` (text)

  2. Security
    - Enable RLS on `application_documents` table
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS application_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id uuid REFERENCES applications(id) NOT NULL,
    document_type text NOT NULL,
    file_path text NOT NULL,
    uploaded_at timestamptz DEFAULT now(),
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    has_english_test boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own application documents"
    ON application_documents FOR SELECT
    TO authenticated
    USING (
        application_id IN (
            SELECT id FROM applications WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert own application documents"
    ON application_documents FOR INSERT
    TO authenticated
    WITH CHECK (
        application_id IN (
            SELECT id FROM applications WHERE user_id = auth.uid()
        )
    );

-- Add trigger for uploaded_at
CREATE TRIGGER update_application_documents_uploaded_at
    BEFORE UPDATE ON application_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();