import React from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Building2,
  Clock,
  GraduationCap,
  Calendar,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const DoctorCard = ({ doctor }) => {
  const doctorUser = doctor.userId || {};
  const hasAvailableSlots = doctor.timeSlots?.some((s) => !s.isBooked);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 hover:border-teal-300 shadow-sm hover:shadow-glass-hover transition-all duration-300 flex flex-col justify-between overflow-hidden group">
      
      <div className="p-6 space-y-4">
        {/* Top Profile Header */}
        <div className="flex items-start gap-4">
          <div className="relative">
            <img
              src={doctorUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctorUser.name}`}
              alt={doctorUser.name}
              className="w-16 h-16 rounded-2xl object-cover bg-slate-100 border-2 border-white shadow-sm"
            />
            {doctor.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white rounded-full p-0.5 shadow-sm" title="Verified Doctor">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                {doctorUser.name || 'Specialist Doctor'}
              </h3>
            </div>
            
            <p className="text-sm font-semibold text-teal-600 flex items-center gap-1.5 mt-0.5">
              <span>{doctor.specialization}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 text-xs font-medium">{doctor.experienceYears}+ yrs exp</span>
            </p>

            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60 text-amber-800 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>{doctor.averageRating ? doctor.averageRating.toFixed(1) : '5.0'}</span>
                <span className="text-slate-400 font-normal">({doctor.totalReviews || 0})</span>
              </div>

              {doctor.hospitalAffiliation && (
                <div className="flex items-center gap-1 truncate text-slate-500" title={doctor.hospitalAffiliation}>
                  <Building2 className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                  <span className="truncate">{doctor.hospitalAffiliation}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bio snippet */}
        {doctor.bio && (
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {doctor.bio}
          </p>
        )}

        {/* Treated Conditions Tags */}
        {doctor.conditionsTreated && doctor.conditionsTreated.length > 0 && (
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Treats</p>
            <div className="flex flex-wrap gap-1.5">
              {doctor.conditionsTreated.slice(0, 4).map((cond, idx) => (
                <span
                  key={idx}
                  className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/50"
                >
                  {cond}
                </span>
              ))}
              {doctor.conditionsTreated.length > 4 && (
                <span className="text-[11px] font-medium bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">
                  +{doctor.conditionsTreated.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Action */}
      <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-4">
        <div>
          <span className="text-[11px] text-slate-500 font-medium block">Consultation Fee</span>
          <span className="text-lg font-extrabold text-slate-900">
            ${doctor.consultationFee}
            <span className="text-xs font-normal text-slate-500"> / session</span>
          </span>
        </div>

        <Link
          to={`/doctors/${doctor._id}`}
          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm hover:shadow transition-all"
        >
          <span>Book Slot</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
