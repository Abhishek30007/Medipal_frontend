import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Home, Search } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto shadow-sm">
          <Activity className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900">404</h1>
          <h2 className="text-xl font-bold text-slate-800">Page Not Found</h2>
          <p className="text-xs text-slate-500">
            The page you are looking for might have been moved or does not exist.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-glow-teal flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
          <Link
            to="/doctors"
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            Find Doctors
          </Link>
        </div>
      </div>
    </div>
  );
};
