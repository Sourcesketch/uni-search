import React from 'react';
import { FilterOptions } from '../types';

interface FiltersProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
}

export default function Filters({ filters, setFilters }: FiltersProps) {
  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-4">Filters</h3>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Minimum GPA
          <input
            type="number"
            min="0"
            max="4"
            step="0.1"
            value={filters.minGPA}
            onChange={(e) => setFilters({ ...filters, minGPA: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Maximum Tuition (USD)
          <input
            type="number"
            min="0"
            step="1000"
            value={filters.maxTuition}
            onChange={(e) => setFilters({ ...filters, maxTuition: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Maximum Education Gap (years)
          <input
            type="number"
            min="0"
            max="10"
            value={filters.maxEducationGap}
            onChange={(e) => setFilters({ ...filters, maxEducationGap: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </label>
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filters.scholarshipRequired}
            onChange={(e) => setFilters({ ...filters, scholarshipRequired: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">Scholarship Required</span>
        </label>
      </div>
    </div>
  );
}