import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  SlidersHorizontal,
  Star,
  DollarSign,
  Briefcase,
  Calendar,
  X,
  RefreshCw,
  Sparkles,
  Stethoscope,
  ChevronDown,
} from 'lucide-react';
import { doctorApi } from '../services/api';
import { DoctorCard } from '../components/DoctorCard';

export const DoctorDiscovery = ({ onOpenAiTriage }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [specialty, setSpecialty] = useState(searchParams.get('specialty') || 'All');
  const [condition, setCondition] = useState(searchParams.get('condition') || '');
  const [minRating, setMinRating] = useState('');
  const [maxFee, setMaxFee] = useState('');
  const [availableToday, setAvailableToday] = useState(false);
  const [sortBy, setSortBy] = useState('rating_desc');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync URL query params
  useEffect(() => {
    const urlSpecialty = searchParams.get('specialty');
    const urlSearch = searchParams.get('search');
    const urlCondition = searchParams.get('condition');
    if (urlSpecialty) setSpecialty(urlSpecialty);
    if (urlSearch) setSearch(urlSearch);
    if (urlCondition) setCondition(urlCondition);
  }, [searchParams]);

  // Fetch Specialties list
  useEffect(() => {
    const fetchSpecialties = async () => {
      try {
        const res = await doctorApi.getSpecialties();
        if (res.data.success) {
          setSpecialties(res.data.specialties);
        }
      } catch (err) {
        console.error('Error fetching specialties:', err);
      }
    };
    fetchSpecialties();
  }, []);

  // Fetch Doctors with filters
  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = {
        sortBy,
      };
      if (search.trim()) params.search = search.trim();
      if (specialty && specialty !== 'All') params.specialty = specialty;
      if (condition.trim()) params.condition = condition.trim();
      if (minRating) params.minRating = minRating;
      if (maxFee) params.maxFee = maxFee;
      if (availableToday) params.availableToday = 'true';

      const res = await doctorApi.getDoctors(params);
      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, [specialty, minRating, maxFee, availableToday, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSpecialty('All');
    setCondition('');
    setMinRating('');
    setMaxFee('');
    setAvailableToday(false);
    setSortBy('rating_desc');
    setSearchParams({});
  };

  const allSpecialtyOptions = [
    'All',
    'General Physician',
    'Cardiologist',
    'Dermatologist',
    'Neurologist',
    'Pediatrician',
    'Orthopedic',
    'Psychiatrist',
    'Gastroenterologist',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Find & Consult Specialists
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Search by symptom, treated disease, specialty or doctor name.
            </p>
          </div>

          <button
            onClick={onOpenAiTriage}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal-500/10 to-emerald-500/10 border border-teal-300 text-teal-800 text-xs font-bold flex items-center gap-2 hover:bg-teal-50 transition-colors shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
            <span>Not sure? Run AI Symptom Triage</span>
          </button>
        </div>

        {/* Search & Sort Row */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-2 w-full">
            <Search className="w-5 h-5 text-slate-400 ml-2 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search symptoms (e.g. 'acne', 'migraine') or doctor name..."
              className="w-full py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  fetchDoctors();
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto justify-between border-t md:border-t-0 pt-2 md:pt-0 border-slate-100">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500"
              >
                <option value="rating_desc">Highest Rated</option>
                <option value="fee_asc">Fee: Low to High</option>
                <option value="fee_desc">Fee: High to Low</option>
                <option value="experience_desc">Most Experienced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Sidebar Filters + Doctors Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <div className={`space-y-6 lg:block ${mobileFilterOpen ? 'block' : 'hidden'}`}>
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-teal-600" />
                Filter Specialists
              </h3>
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs text-teal-600 hover:text-teal-800 font-bold flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Specialties Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Medical Specialty
              </label>
              <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
                {allSpecialtyOptions.map((spec) => (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => setSpecialty(spec)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      specialty === spec
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{spec}</span>
                    {specialty === spec && <span className="text-[10px] uppercase font-bold">Active</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Today */}
            <div className="pt-3 border-t border-slate-100">
              <label className="flex items-center gap-2.5 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={availableToday}
                  onChange={(e) => setAvailableToday(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-slate-300"
                />
                <span>Available Today Only</span>
              </label>
            </div>

            {/* Minimum Rating */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Minimum Rating
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {['', '4.0', '4.5', '4.8'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMinRating(r)}
                    className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1 border transition-all ${
                      minRating === r
                        ? 'bg-teal-600 text-white border-teal-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {r ? (
                      <>
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {r}+
                      </>
                    ) : (
                      'Any'
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Fee */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 uppercase tracking-wider">
                  Max Fee
                </label>
                <span className="font-bold text-teal-600">
                  {maxFee ? `$${maxFee}` : 'Any Fee'}
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                step="10"
                value={maxFee || '200'}
                onChange={(e) => setMaxFee(e.target.value === '200' ? '' : e.target.value)}
                className="w-full accent-teal-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>$40</span>
                <span>$120</span>
                <span>$200+</span>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Results Grid */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>
              Showing <strong className="text-slate-900">{doctors.length}</strong> qualified medical doctors
            </span>
            {specialty !== 'All' && (
              <span className="bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-200">
                Filtered: {specialty}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-72 bg-slate-100 rounded-3xl animate-pulse"></div>
              ))}
            </div>
          ) : doctors.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <Stethoscope className="w-12 h-12 text-slate-300 mx-auto" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">No doctors matched your criteria</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try adjusting your search query, clearing filters, or checking back for newly opened slots.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {doctors.map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
