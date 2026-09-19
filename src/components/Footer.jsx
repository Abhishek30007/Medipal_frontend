import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Lock, Heart, PhoneCall, Sparkles } from 'lucide-react';

export const Footer = ({ onOpenAiTriage }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-glow-teal">
                <Activity className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Medi<span className="text-teal-400">Pal</span> Telehealth
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Next-generation telehealth platform providing on-demand video & chat consultations, intelligent Gemini AI symptom triage, and verified medical specialists.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" /> HIPAA-Compliant Architecture
              </span>
              <span className="flex items-center gap-1.5 text-teal-400">
                <Lock className="w-4 h-4" /> End-to-End Encryption
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Patient Care</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/doctors" className="hover:text-teal-400 transition-colors">
                  Find Doctors & Specialists
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenAiTriage}
                  className="hover:text-teal-400 transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  AI Symptom Checker
                </button>
              </li>
              <li>
                <Link to="/patient/dashboard" className="hover:text-teal-400 transition-colors">
                  My Appointments
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=General+Physician" className="hover:text-teal-400 transition-colors">
                  Urgent Care Consults
                </Link>
              </li>
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Specialties</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/doctors?specialty=Cardiologist" className="hover:text-teal-400 transition-colors">
                  Cardiology
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=Dermatologist" className="hover:text-teal-400 transition-colors">
                  Dermatology
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=Neurologist" className="hover:text-teal-400 transition-colors">
                  Neurology
                </Link>
              </li>
              <li>
                <Link to="/doctors?specialty=Psychiatrist" className="hover:text-teal-400 transition-colors">
                  Psychiatry & Mental Health
                </Link>
              </li>
            </ul>
          </div>

          {/* Emergency Notice */}
          <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60">
            <h4 className="text-sm font-bold text-rose-400 flex items-center gap-1.5 mb-2">
              <PhoneCall className="w-4 h-4" /> Emergency Notice
            </h4>
            <p className="text-xs text-slate-400 leading-normal mb-3">
              If you are experiencing a life-threatening medical emergency (e.g. chest pain, severe bleeding, difficulty breathing), please immediately call 911 or visit your nearest emergency room.
            </p>
            <div className="text-[11px] text-teal-400 font-semibold bg-teal-950/60 px-2.5 py-1.5 rounded-lg border border-teal-800/40">
              National Suicide & Crisis Lifeline: Dial 988
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 MediPal Telehealth Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <a href="#" className="hover:text-slate-400">Doctor Agreement</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
