import React from 'react';
import { University } from '../types';
import { MapPin, DollarSign, Award, GraduationCap, BookOpen } from 'lucide-react';

interface UniversityCardProps {
  university: University;
  onClick: () => void;
}

export default function UniversityCard({ university, onClick }: UniversityCardProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={onClick}
    >
      <img 
        src={university.image_url} 
        alt={university.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{university.name}</h3>
        
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-sm">{university.location},{university.country}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="text-sm">${university.tuition_fee.toLocaleString()} / year</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <GraduationCap className="h-4 w-4 mr-2" />
            <span className="text-sm">Min GPA: {university.minimum_gpa}</span>
          </div>
          
          <div className="flex items-center text-gray-600">
            <BookOpen className="h-4 w-4 mr-2" />
            <span className="text-sm">
              {university.bachelors_count || 0} Bachelor's, {university.masters_count || 0} Master's Programs
            </span>
          </div>
          
          {university.scholarship_available && (
            <div className="flex items-center text-green-600">
              <Award className="h-4 w-4 mr-2" />
              <span className="text-sm">Scholarship Available</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}