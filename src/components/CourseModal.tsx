import React from 'react';
import { X, Clock, Calendar, GraduationCap, Award, Plane } from 'lucide-react';
import type { Course } from '../types';

interface CourseModalProps {
  course: Course;
  onClose: () => void;
}

export default function CourseModal({ course, onClose }: CourseModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{course.name}</h2>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {course.level}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-lg font-semibold mb-3">Course Overview</h3>
            <p className="text-gray-600">{course.overview}</p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <Clock className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h4 className="font-medium">Duration</h4>
                <p className="text-gray-600">{course.duration}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Calendar className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h4 className="font-medium">Start Dates & Deadlines</h4>
                <div className="space-y-2">
                  <div className="text-gray-600">
                    <p>Intake: {course.start_addmission}</p>
                    <p>Deadline: {course.application_deadline}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">Program Structure</h3>
            <p className="text-gray-600 whitespace-pre-line">
              {course.program_structure}
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-3">
              Academic Requirements
            </h3>
            <p className="text-gray-600 whitespace-pre-line">
              {course.academic_requirements}
            </p>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <GraduationCap className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h4 className="font-medium">Tuition Fee</h4>
                <p className="text-gray-600">
                  ${course.tuition_fee.toLocaleString()} total
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Award className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <h4 className="font-medium">Scholarships</h4>
                <p className="text-gray-600">{course.scholarship_info}</p>
              </div>
            </div>
          </section>

          <section className="flex items-start space-x-3">
            <Plane className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <h4 className="font-medium">Visa Information</h4>
              <p className="text-gray-600">{course.visa_info}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
