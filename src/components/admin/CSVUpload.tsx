import React, { useState } from 'react';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import Papa from 'papaparse';

interface CSVRow {
  name: string;
  location: string;
  tuition_fee: string;
  acceptance_rate: string;
  scholarship_available: string;
  minimum_gpa: string;
  education_gap: string;
  description: string;
  image_url: string;
}

export default function CSVUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const processCSV = async (file: File) => {
    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await file.text();
      
      Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const data = results.data as CSVRow[];
            
            // Transform data to match database schema
            const universities = data.map(row => ({
              name: row.name,
              location: row.location,
              tuition_fee: parseInt(row.tuition_fee),
              acceptance_rate: parseInt(row.acceptance_rate),
              scholarship_available: row.scholarship_available.toLowerCase() === 'true',
              minimum_gpa: parseFloat(row.minimum_gpa),
              education_gap: parseInt(row.education_gap),
              description: row.description,
              image_url: row.image_url,
            }));

            // Insert data into Supabase
            const { error } = await supabase
              .from('universities')
              .insert(universities);

            if (error) throw error;

            setSuccess(`Successfully uploaded ${universities.length} universities`);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to process CSV');
          }
        },
        error: (error) => {
          setError(`Failed to parse CSV: ${error.message}`);
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to read file');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      setError('Please upload a CSV file');
      return;
    }

    processCSV(file);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Upload Universities Data</h2>
      
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV files only</p>
            </div>
            <input
              type="file"
              className="hidden"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={uploading}
            />
          </label>
        </div>

        {uploading && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-600">Uploading data...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <p className="text-sm">{success}</p>
          </div>
        )}
      </div>

      <div className="mt-8">
        <h3 className="font-semibold mb-2">CSV Format Requirements:</h3>
        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
          <li>File must be in CSV format</li>
          <li>Required columns: name, location, tuition_fee, acceptance_rate, scholarship_available, minimum_gpa, education_gap, description, image_url</li>
          <li>tuition_fee should be a whole number</li>
          <li>acceptance_rate should be a whole number between 0 and 100</li>
          <li>scholarship_available should be 'true' or 'false'</li>
          <li>minimum_gpa should be a decimal number (e.g., 3.5)</li>
          <li>education_gap should be a whole number</li>
        </ul>
      </div>
    </div>
  );
}