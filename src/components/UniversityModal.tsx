import React, { useState } from 'react';
import { University, Course } from '../types';
import {
  X,
  MapPin,
  DollarSign,
  Award,
  GraduationCap,
  Clock,
} from 'lucide-react';
import CourseCard from './CourseCard';
import CourseModal from './CourseModal';
import AuthModal from './AuthModal';
import { useAuth } from '../contexts/AuthContext';

interface UniversityModalProps {
  university: University;
  onClose: () => void;
}

export default function UniversityModal({
  university,
  onClose,
}: UniversityModalProps) {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"Bachelor's" | "Master's">(
    "Bachelor's"
  );

  // const filteredCourses =
  //   university.courses?.filter((course) => course.level === activeTab) || [];
  const filteredCourses = university.courses?.map((course) => ({
    ...course,
    university_id: university.id, // ✅ Ensure university_id is included
  })) || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={university.image_url}
            alt={university.name}
            className="w-full h-64 object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>

          {/* CTA Section */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white">
                {university.name}
              </h2>
              <button
                onClick={() =>
                  user ? setSelectedCourse(null) : setShowAuthModal(true)
                }
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <span>
                {university.location},{university.country}
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-2" />
              <span>${university.tuition_fee.toLocaleString()} / year</span>
            </div>

            <div className="flex items-center text-gray-600">
              <GraduationCap className="h-5 w-5 mr-2" />
              <span>Minimum GPA: {university.minimum_gpa}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>Max Education Gap: {university.education_gap} years</span>
            </div>
          </div>

          {university.scholarship_available && (
            <div className="mb-6 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center text-green-700">
                <Award className="h-5 w-5 mr-2" />
                <span className="font-medium">Scholarships Available</span>
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{university.description}</p>
          </div>

          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab("Bachelor's")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "Bachelor's"
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Bachelor's Programs ({university.bachelors_count || 0})
                </button>
                <button
                  onClick={() => setActiveTab("Master's")}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "Master's"
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Master's Programs ({university.masters_count || 0})
                </button>
              </nav>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onClick={() => setSelectedCourse(course)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          universityId={university.id}
        />
      )}
    </div>
  );
}
