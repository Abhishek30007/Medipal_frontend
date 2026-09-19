import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  FileText,
  Star,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  User,
  Activity,
} from 'lucide-react';
import { appointmentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PrescriptionModal } from '../components/PrescriptionModal';
import { ReviewModal } from '../components/ReviewModal';

export const PatientDashboard = ({ onOpenAiTriage }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescriptionAppt, setSelectedPrescriptionAppt] = useState(null);
  const [selectedReviewAppt, setSelectedReviewAppt] = useState(null);

  const fetchAppointments = async () => {
    try {
      const res = await appointmentApi.getMyAppointments();
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'confirmed' || a.status === 'active' || a.status === 'pending'
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-teal-800/40">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl bg-teal-800/50 object-cover border-2 border-teal-400/40"
          />
          <div>
            <h1 className="text-2xl font-bold">Hello, {user?.name || 'Patient'} 👋</h1>
            <p className="text-xs text-teal-200/80 mt-1">
              Manage your upcoming telehealth visits, digital prescriptions, and AI symptom triage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAiTriage}
            className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-glow-teal flex items-center gap-2 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            AI Symptom Check
          </button>
          <Link
            to="/doctors"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-all"
          >
            Book New Specialist
          </Link>
        </div>
      </div>

      {/* Main Grid: Left Upcoming Consultations | Right Health Profile / Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Upcoming & Past Appointments */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Upcoming Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Active & Upcoming Consultations ({upcomingAppointments.length})
              </h2>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2].map((n) => (
                  <div key={n} className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : upcomingAppointments.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
                <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">No upcoming consultations scheduled</p>
                <Link
                  to="/doctors"
                  className="inline-block px-4 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-sm"
                >
                  Find a Doctor Today
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((appt) => {
                  const doctorUser = appt.doctorId?.userId || {};
                  return (
                    <div
                      key={appt._id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-teal-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={doctorUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctorUser.name}`}
                          alt={doctorUser.name}
                          className="w-14 h-14 rounded-2xl object-cover bg-slate-100 border border-slate-200"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">{doctorUser.name || 'Doctor'}</h3>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              appt.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                                : 'bg-teal-50 text-teal-800'
                            }`}>
                              {appt.status}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-teal-600">
                            {appt.doctorId?.specialization}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                            <span className="flex items-center gap-1 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {appt.date}
                            </span>
                            <span className="flex items-center gap-1 font-medium">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {appt.timeSlot?.startTime} - {appt.timeSlot?.endTime}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 pt-1 line-clamp-1">
                            <strong>Reason:</strong> {appt.reasonForVisit}
                          </p>
                        </div>
                      </div>

                      <div className="w-full sm:w-auto flex sm:flex-col items-center justify-end gap-2">
                        <Link
                          to={`/consultation/${appt._id}`}
                          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-glow-teal flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Video className="w-4 h-4" />
                          <span>Enter Consultation Room</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Consultations Section */}
          <div className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Past Consultations & Electronic Prescriptions ({pastAppointments.length})
            </h2>

            {pastAppointments.length === 0 ? (
              <p className="text-xs text-slate-500 italic bg-white p-6 rounded-2xl border border-slate-200">
                No past consultations recorded.
              </p>
            ) : (
              <div className="space-y-3">
                {pastAppointments.map((appt) => {
                  const doctorUser = appt.doctorId?.userId || {};
                  return (
                    <div
                      key={appt._id}
                      className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={doctorUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctorUser.name}`}
                          alt={doctorUser.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100"
                        />
                        <div>
                          <p className="text-sm font-bold text-slate-900">{doctorUser.name}</p>
                          <p className="text-xs text-slate-500">
                            {appt.doctorId?.specialization} • {appt.date}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        {/* Prescription Button */}
                        {appt.prescription?.medicines?.length > 0 || appt.diagnosis ? (
                          <button
                            type="button"
                            onClick={() => setSelectedPrescriptionAppt(appt)}
                            className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 text-xs font-bold rounded-xl border border-teal-200 flex items-center gap-1.5 transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5 text-teal-600" />
                            View Rx
                          </button>
                        ) : null}

                        {/* Leave Review Button */}
                        {appt.status === 'completed' && !appt.hasReview && (
                          <button
                            type="button"
                            onClick={() => setSelectedReviewAppt(appt)}
                            className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            Rate Doctor
                          </button>
                        )}

                        <Link
                          to={`/consultation/${appt._id}`}
                          className="px-3 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-semibold"
                        >
                          View Room History
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Patient Medical Profile Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Patient Medical Intake
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Full Name</span>
                <span className="font-bold text-slate-900">{user?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Email</span>
                <span className="font-bold text-slate-900">{user?.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Phone</span>
                <span className="font-bold text-slate-900">{user?.phone || 'Not specified'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Blood Group</span>
                <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  {user?.bloodGroup || 'O+'}
                </span>
              </div>
              <div className="py-2 space-y-1">
                <span className="text-slate-500 font-medium block">Known Allergies</span>
                <div className="flex flex-wrap gap-1">
                  {user?.allergies?.length > 0 ? (
                    user.allergies.map((a, i) => (
                      <span key={i} className="bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded text-[11px] border border-rose-200">
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">None reported</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Modal */}
      {selectedPrescriptionAppt && (
        <PrescriptionModal
          isOpen={true}
          onClose={() => setSelectedPrescriptionAppt(null)}
          isDoctor={false}
          appointment={selectedPrescriptionAppt}
        />
      )}

      {/* Review Modal */}
      {selectedReviewAppt && (
        <ReviewModal
          isOpen={true}
          onClose={() => setSelectedReviewAppt(null)}
          doctor={selectedReviewAppt.doctorId}
          appointmentId={selectedReviewAppt._id}
          onReviewSubmitted={() => {
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
};
