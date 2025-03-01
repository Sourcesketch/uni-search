import React, { useState, useEffect } from 'react';
import { GraduationCap, LogIn, UserCircle } from 'lucide-react';
import SearchBar from './components/SearchBar';
import Filters from './components/Filters';
import UniversityCard from './components/UniversityCard';
import UniversityModal from './components/UniversityModal';
import AuthModal from './components/AuthModal';
import { supabase } from './lib/supabaseClient';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import type { University, FilterOptions } from './types';

function NavbarActions() {
  const { user, signOut, profile } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  if (user && profile) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <UserCircle className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">{profile.full_name}</span>
        </div>
        <button
          onClick={() => signOut()}
          className="text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Sign Out
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowAuthModal(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
      >
        <LogIn className="h-5 w-5" />
        <span>Sign In</span>
      </button>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}

function AppContent() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    minGPA: 0,
    maxTuition: 50000,
    maxEducationGap: 5,
    scholarshipRequired: false,
  });

  useEffect(() => {
    fetchUniversities();
  }, []);

  const fetchUniversities = async () => {
    try {
      console.log('Fetching universities...');
      const { data: universitiesData, error: universitiesError } = await supabase
        .from('universities')
        .select(`
          *,
          courses (
            id,
            name,
            level,
            overview,
            duration,
            start_addmission,
            application_deadline,
            program_structure,
            academic_requirements,
            tuition_fee,
            scholarship_info,
            visa_info
          )
        `);

      if (universitiesError) {
        console.error('Error fetching universities:', universitiesError);
        setError(universitiesError.message);
        throw universitiesError;
      }

      console.log('Universities data:', universitiesData);

      if (!universitiesData || universitiesData.length === 0) {
        console.log('No universities found');
        setUniversities([]);
        setError('No universities found. Please add some universities to the database.');
        setLoading(false);
        return;
      }

      // Process universities to add course counts
      const processedUniversities = universitiesData.map(university => ({
        ...university,
        bachelors_count: university.courses?.filter(course => course.level === 'Bachelor\'s').length || 0,
        masters_count: university.courses?.filter(course => course.level === 'Master\'s').length || 0,
      }));

      console.log('Processed universities:', processedUniversities);
      setUniversities(processedUniversities);
    } catch (error) {
      console.error('Error in fetchUniversities:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch universities');
    } finally {
      setLoading(false);
    }
  };

  const filteredUniversities = universities.filter(university => {
    const matchesSearch = university.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        university.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        university.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = 
      university.minimum_gpa >= filters.minGPA &&
      university.tuition_fee <= filters.maxTuition &&
      university.education_gap <= filters.maxEducationGap &&
      (!filters.scholarshipRequired || university.scholarship_available);

    return matchesSearch && matchesFilters;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">UniSearch</h1>
            </div>
            <NavbarActions />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-8">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Filters filters={filters} setFilters={setFilters} />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-600">Loading universities...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <GraduationCap className="mx-auto h-12 w-12 text-red-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
                <p className="mt-1 text-sm text-gray-500">{error}</p>
              </div>
            ) : filteredUniversities.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No universities found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredUniversities.map(university => (
                  <UniversityCard
                    key={university.id}
                    university={university}
                    onClick={() => setSelectedUniversity(university)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedUniversity && (
        <UniversityModal
          university={selectedUniversity}
          onClose={() => setSelectedUniversity(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;