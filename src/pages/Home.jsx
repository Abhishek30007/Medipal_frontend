import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  Sparkles,
  Stethoscope,
  Heart,
  Brain,
  ShieldCheck,
  Video,
  Clock,
  Star,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Award,
  Zap,
  PhoneCall,
  Activity,
} from 'lucide-react';
import { doctorApi } from '../services/api';
import { DoctorCard } from '../components/DoctorCard';

export const Home = ({ onOpenAiTriage }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [docsRes, specsRes] = await Promise.all([
          doctorApi.getDoctors({ sortBy: 'rating_desc' }),
          doctorApi.getSpecialties(),
        ]);
        if (docsRes.data.success) {
          setFeaturedDoctors(docsRes.data.doctors.slice(0, 4));
        }
        if (specsRes.data.success) {
          setSpecialties(specsRes.data.specialties);
        }
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/doctors?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      navigate('/doctors');
    }
  };

  const specialtyIcons = {
    Cardiologist: Heart,
    Dermatologist: Sparkles,
    'General Physician': Stethoscope,
    Neurologist: Brain,
    Pediatrician: Activity,
    Orthopedic: Activity,
    Psychiatrist: Sparkles,
    Gastroenterologist: Activity,
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-teal-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            
            {/* Live Badge */}
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-teal-300 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>24/7 Board-Certified Specialists & Instant AI Triage</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Virtual Healthcare, <br />
              <span className="bg-gradient-to-r from-teal-400 via-emerald-300 to-cyan-400 bg-clip-text text-transparent">
                Simplified & Immediate.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect with top medical doctors through encrypted real-time video & chat. Get instant Gemini-powered symptom triage guidance in seconds.
            </p>

            {/* Search & AI Triage Bar */}
            <div className="pt-4 max-w-2xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="bg-white p-2 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-center gap-2 text-slate-800"
              >
                <div className="flex-1 flex items-center gap-3 px-4 w-full">
                  <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search symptoms (e.g. Migraine, Acne) or Doctor name..."
                    className="w-full py-2.5 text-sm font-medium focus:outline-none bg-transparent placeholder:text-slate-400"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={onOpenAiTriage}
                    className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl sm:rounded-full bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-teal-200/80"
                  >
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    AI Triage
                  </button>

                  <button
                    type="submit"
                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl sm:rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-xs font-bold shadow-glow-teal flex items-center justify-center gap-1.5 transition-all"
                  >
                    <span>Find Doctors</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Quick Suggestion Chips */}
              <div className="flex items-center justify-center flex-wrap gap-2 pt-4 text-xs text-slate-400">
                <span className="font-semibold text-slate-300">Popular:</span>
                {['Skin Rash', 'Migraine', 'Anxiety', 'Hypertension', 'Fever'].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => navigate(`/doctors?condition=${encodeURIComponent(chip)}`)}
                    className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-teal-900/60 text-slate-300 hover:text-teal-200 border border-slate-700 text-[11px] transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl mx-auto border-t border-slate-800/80 text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">100% Verified</p>
                  <p className="text-xs text-slate-400">Licensed Doctors</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">&lt; 15 Min</p>
                  <p className="text-xs text-slate-400">Average Wait Time</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">HD Telehealth</p>
                  <p className="text-xs text-slate-400">Encrypted Video & Chat</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">4.9 / 5.0</p>
                  <p className="text-xs text-slate-400">Patient Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Triage Banner Feature */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-teal-700/50">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" /> Powered by Google Gemini
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Unsure which specialist you need?
            </h2>
            <p className="text-sm text-teal-100/90 leading-relaxed">
              Our interactive AI triage assistant asks clinically-informed follow-up questions, checks for red flag warnings, suggests safe home relief, and connects you directly with the right specialist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenAiTriage}
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-teal-50 text-teal-900 font-extrabold text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-teal-600 group-hover:rotate-12 transition-transform" />
              Start Free AI Symptom Assessment
            </button>
          </div>
        </div>
      </section>

      {/* Medical Specialties Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Top Medical Disciplines</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Explore Specialties & Care Areas
            </h2>
          </div>
          <Link
            to="/doctors"
            className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1.5"
          >
            <span>View All Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[
            { name: 'Cardiologist', desc: 'Heart health, blood pressure & arrhythmias', count: '14+ Doctors', color: 'from-rose-500 to-red-600', icon: Heart },
            { name: 'Dermatologist', desc: 'Skin conditions, acne, eczema & rashes', count: '18+ Doctors', color: 'from-teal-500 to-emerald-600', icon: Sparkles },
            { name: 'General Physician', desc: 'Everyday illnesses, fever, cough & checkups', count: '32+ Doctors', color: 'from-blue-500 to-indigo-600', icon: Stethoscope },
            { name: 'Neurologist', desc: 'Migraines, nerve pain & dizziness', count: '10+ Doctors', color: 'from-purple-500 to-indigo-600', icon: Brain },
            { name: 'Pediatrician', desc: 'Infant, toddler & teen medical care', count: '12+ Doctors', color: 'from-amber-500 to-orange-600', icon: Activity },
            { name: 'Orthopedic', desc: 'Joint, back pain, sports injury & bones', count: '15+ Doctors', color: 'from-cyan-500 to-blue-600', icon: Activity },
            { name: 'Psychiatrist', desc: 'Anxiety, depression, ADHD & therapy', count: '11+ Doctors', color: 'from-violet-500 to-purple-600', icon: Sparkles },
            { name: 'Gastroenterologist', desc: 'Acid reflux, digestive issues & IBS', count: '9+ Doctors', color: 'from-emerald-500 to-teal-600', icon: Activity },
          ].map((spec) => {
            const IconComponent = spec.icon;
            return (
              <Link
                key={spec.name}
                to={`/doctors?specialty=${encodeURIComponent(spec.name)}`}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-teal-300 hover:shadow-glass-hover transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${spec.color} text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {spec.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600">
                  <span>{spec.count}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Top-Rated Practitioners</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Consult with Verified Doctors
            </h2>
          </div>
          <Link
            to="/doctors"
            className="text-sm font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1.5"
          >
            <span>Browse All {featuredDoctors.length}+ Doctors</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-80 bg-slate-100 rounded-2xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDoctors.map((doc) => (
              <DoctorCard key={doc._id} doctor={doc} />
            ))}
          </div>
        )}
      </section>

      {/* How it Works */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600">Simple 4-Step Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              How MediPal Telehealth Works
            </h2>
            <p className="text-sm text-slate-600">
              From symptom triage to verified digital prescription in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'AI Symptom Triage',
                desc: 'Chat with our 24/7 Gemini assistant to clarify symptoms and identify the ideal specialist.',
                icon: Sparkles,
              },
              {
                step: '02',
                title: 'Select Doctor & Slot',
                desc: 'Compare credentials, reviews, and fees. Pick a convenient time slot with concurrency protection.',
                icon: Calendar,
              },
              {
                step: '03',
                title: 'Live Video Consultation',
                desc: 'Join your time-gated consultation room for real-time video, chat, and medical history sharing.',
                icon: Video,
              },
              {
                step: '04',
                title: 'Prescription & Records',
                desc: 'Receive digital prescriptions, care instructions, and leave reviews right on your dashboard.',
                icon: Award,
              },
            ].map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-200">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
