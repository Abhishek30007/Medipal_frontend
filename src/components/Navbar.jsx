import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Activity,
  Calendar,
  User,
  LogOut,
  Sparkles,
  Search,
  Stethoscope,
  Menu,
  X,
  Clock,
  ShieldCheck,
} from 'lucide-react';

export const Navbar = ({ onOpenAiTriage }) => {
  const { user, isAuthenticated, isDoctor, isPatient, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-glow-teal group-hover:scale-105 transition-transform duration-200">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                Medi<span className="text-teal-600">Pal</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200/60">
                  Telehealth
                </span>
              </span>
              <span className="text-xs text-slate-500 font-medium">Instant Consultations & Triage</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5">
            <Link
              to="/doctors"
              className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                isActive('/doctors')
                  ? 'text-teal-700 bg-teal-50/80 font-bold'
                  : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
              }`}
            >
              <Search className="w-4 h-4" />
              Find Doctors
            </Link>

            <button
              onClick={onOpenAiTriage}
              className="px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-teal-50/60 transition-colors flex items-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-teal-600 group-hover:scale-110 transition-transform animate-pulse-subtle" />
              AI Symptom Triage
              <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                24/7 AI
              </span>
            </button>

            {isAuthenticated && (
              <Link
                to={isDoctor ? '/doctor/dashboard' : '/patient/dashboard'}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 ${
                  isActive(isDoctor ? '/doctor/dashboard' : '/patient/dashboard')
                    ? 'text-teal-700 bg-teal-50/80 font-bold'
                    : 'text-slate-600 hover:text-teal-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                {isDoctor ? 'Doctor Portal' : 'My Consultations'}
              </Link>
            )}
          </nav>

          {/* Right Action / Profile */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={onOpenAiTriage}
              className="px-3 py-1.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/60 text-xs font-semibold flex items-center gap-1.5 hover:bg-teal-100 transition-colors shadow-sm"
              title="Interactive Symptom Assessment"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              Triage Assistant
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-3 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-teal-300 bg-white hover:bg-slate-50 transition-all shadow-sm"
                >
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{user?.name}</p>
                    <p className="text-[11px] font-medium text-teal-600 capitalize">
                      {isDoctor ? '🩺 Doctor' : '👤 Patient'}
                    </p>
                  </div>
                  <img
                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full border border-teal-500/20 object-cover bg-teal-50"
                  />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to={isDoctor ? '/doctor/dashboard' : '/patient/dashboard'}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-teal-600" />
                        Dashboard & Schedule
                      </Link>

                      <Link
                        to="/doctors"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-teal-50 hover:text-teal-700 font-medium transition-colors"
                      >
                        <Stethoscope className="w-4 h-4 text-teal-600" />
                        Browse Specialists
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 shadow-glow-teal hover:shadow-lg transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/doctors"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700"
          >
            Find Doctors
          </Link>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAiTriage();
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-teal-700 bg-teal-50 flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-600" />
              AI Symptom Triage
            </span>
            <span className="text-xs bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">24/7</span>
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to={isDoctor ? '/doctor/dashboard' : '/patient/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-700"
              >
                {isDoctor ? 'Doctor Dashboard' : 'My Consultations'}
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-semibold text-rose-600 hover:bg-rose-50"
              >
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-semibold border border-slate-200 text-slate-700"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-2.5 rounded-xl text-sm font-semibold text-white bg-teal-600"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
