import React, { useState } from 'react';
import { Clock, Calendar, GraduationCap, Send } from 'lucide-react';
import type { Course } from '../types';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import ApplicationFormModal from './ApplicationFormModal';

interface CourseCardProps {
  course: Course;
  onClick: () => void;
}

export default function CourseCard({ course, onClick }: CourseCardProps) {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    if (!user) {
      setShowAuthModal(true);
    } else {
      setShowApplicationModal(true);
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-300"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">{course.name}</h3>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {course.level}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm">{course.duration}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="text-sm">
              Next intake: {course.start_addmission}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <GraduationCap className="h-4 w-4 mr-2" />
            <span className="text-sm">
              ${course.tuition_fee.toLocaleString()} total
            </span>
          </div>
        </div>

        <p className="mt-4 text-gray-600 text-sm line-clamp-2">
          {course.overview}
        </p>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleApply}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Send className="h-4 w-4" />
            Apply Now
          </button>
        </div>
      </div>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

      {showApplicationModal && (
        <ApplicationFormModal
          course={course}
          onClose={() => setShowApplicationModal(false)}
        />
      )}
    </>
  );
}