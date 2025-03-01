import React, { useState, ChangeEvent, FormEvent } from 'react';
import { X, Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { Course } from '../types';

interface ApplicationFormModalProps {
  course: Course;
  onClose: () => void;
}

interface FormData {
  academics: File | null;
  passport: File | null;
  cv: File | null;
  recommendationLetter1: File | null;
  recommendationLetter2: File | null;
  experienceLetter: File | null;
  hasEnglishTest: boolean;
}

export default function ApplicationFormModal({ course, onClose }: ApplicationFormModalProps) {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    academics: null,
    passport: null,
    cv: null,
    recommendationLetter1: null,
    recommendationLetter2: null,
    experienceLetter: null,
    hasEnglishTest: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('applications')
      .upload(path, file);

    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setLoading(true);
    setError(null);

    try {
      // Create application record
      const { data: application, error: applicationError } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          university_id: course.university_id,
          course_id: course.id,
          status: 'pending'
        })
        .select()
        .single();

      if (applicationError) throw applicationError;

      // Upload documents and create records
      const documents = [];
      const timestamp = Date.now();

      for (const [key, file] of Object.entries(formData)) {
        if (file instanceof File) {
          const path = `${user.id}/${application.id}/${timestamp}_${key}`;
          const filePath = await uploadFile(file, path);
          
          documents.push({
            application_id: application.id,
            document_type: key,
            file_path: filePath,
            status: 'pending'
          });
        }
      }

      // Add English test status
      documents.push({
        application_id: application.id,
        document_type: 'english_test',
        file_path: 'none',
        has_english_test: formData.hasEnglishTest,
        status: 'pending'
      });

      // Insert document records
      const { error: documentsError } = await supabase
        .from('application_documents')
        .insert(documents);

      if (documentsError) throw documentsError;

      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  if (!user || !profile) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Application Form</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <p>Application submitted successfully!</p>
          </div>
        )}

        <div className="mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-700">Applicant</h3>
              <p className="text-gray-600">{profile.full_name}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Course</h3>
              <p className="text-gray-600">{course.name}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Current GPA</h3>
              <p className="text-gray-600">{profile.current_gpa}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-700">Education Level</h3>
              <p className="text-gray-600">{profile.education_level}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Academics (Degree/Transcript) *
              </label>
              <input
                type="file"
                name="academics"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Passport *
              </label>
              <input
                type="file"
                name="passport"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                CV *
              </label>
              <input
                type="file"
                name="cv"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recommendation Letter 1 *
              </label>
              <input
                type="file"
                name="recommendationLetter1"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recommendation Letter 2 *
              </label>
              <input
                type="file"
                name="recommendationLetter2"
                onChange={handleFileChange}
                required
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Experience Letter (if gap)
              </label>
              <input
                type="file"
                name="experienceLetter"
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.hasEnglishTest}
                  onChange={(e) => setFormData(prev => ({ ...prev, hasEnglishTest: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="text-sm font-medium text-gray-700">
                  I have taken an English proficiency test
                </span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : success ? 'Submitted!' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}