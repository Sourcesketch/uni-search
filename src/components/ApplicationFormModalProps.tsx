import React, { useState, ChangeEvent, FormEvent } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // Assumes your AuthContext provides user info

interface ApplicationFormModalProps {
  onClose: () => void;
  // Optionally, you can add props like universityId or others if needed
}

interface ApplicationFormData {
  academics: File | null;
  passport: File | null;
  cv: File | null;
  recommendationLetter1: File | null;
  recommendationLetter2: File | null;
  experienceLetter: File | null;
  englishTest: string; // "yes" or "no"
}

export default function ApplicationFormModal({ onClose }: ApplicationFormModalProps) {
  // Get user information from AuthContext
  const { user } = useAuth();
  // Assume "user" contains properties like email and full_name
  // You can adjust these fields based on your actual user object

  const [formData, setFormData] = useState<ApplicationFormData>({
    academics: null,
    passport: null,
    cv: null,
    recommendationLetter1: null,
    recommendationLetter2: null,
    experienceLetter: null,
    englishTest: 'no', // default value
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle file input changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    }
  };

  // Handle text or radio changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit handler – adjust this to match your API/database saving logic
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare the data for upload. For file uploads, often you'll use a FormData object.
      const submissionData = new FormData();

      // Append the automatically filled user info (if you want to send these along)
      if (user?.email) submissionData.append('email', user.email);
      if (user?.full_name) submissionData.append('full_name', user.full_name);

      // Append file fields if they exist
      if (formData.academics) submissionData.append('academics', formData.academics);
      if (formData.passport) submissionData.append('passport', formData.passport);
      if (formData.cv) submissionData.append('cv', formData.cv);
      if (formData.recommendationLetter1) submissionData.append('recommendationLetter1', formData.recommendationLetter1);
      if (formData.recommendationLetter2) submissionData.append('recommendationLetter2', formData.recommendationLetter2);
      if (formData.experienceLetter) submissionData.append('experienceLetter', formData.experienceLetter);

      // Append the English test result
      submissionData.append('englishTest', formData.englishTest);

      // TODO: Replace the URL below with your API endpoint and use your preferred method to upload the form data.
      const response = await fetch('/api/submitApplication', {
        method: 'POST',
        body: submissionData,
      });

      if (!response.ok) {
        throw new Error('Failed to submit application.');
      }

      // If successful, close the modal
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 overflow-y-auto max-h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Submit Your Application</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display user information automatically */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-gray-900">{user?.email || 'Not available'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <p className="mt-1 text-gray-900">{user?.full_name || 'Not available'}</p>
          </div>

          {/* Additional Document Uploads */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Academics (Degree/Transcript)</label>
            <input
              type="file"
              name="academics"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Passport</label>
            <input
              type="file"
              name="passport"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CV</label>
            <input
              type="file"
              name="cv"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Recommendation Letter 1</label>
            <input
              type="file"
              name="recommendationLetter1"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Recommendation Letter 2</label>
            <input
              type="file"
              name="recommendationLetter2"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Experience Letter (if gap)</label>
            <input
              type="file"
              name="experienceLetter"
              onChange={handleFileChange}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">English Test (yes/no)</label>
            <div className="mt-1">
              <label className="inline-flex items-center mr-4">
                <input
                  type="radio"
                  name="englishTest"
                  value="yes"
                  checked={formData.englishTest === 'yes'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="englishTest"
                  value="no"
                  checked={formData.englishTest === 'no'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}
