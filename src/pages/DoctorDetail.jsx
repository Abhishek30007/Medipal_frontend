import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Star,
  Building2,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Clock,
  Globe,
  Award,
  ArrowLeft,
  Lock,
  Sparkles,
  AlertCircle,
  ThumbsUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { doctorApi, appointmentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SlotPicker } from '../components/SlotPicker';

export const DoctorDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');

  // Booking Modal State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [symptomsSummary, setSymptomsSummary] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const fetchDoctor = async () => {
    try {
      const res = await doctorApi.getDoctorById(id);
      if (res.data.success) {
        setDoctor(res.data.doctor);
        setReviews(res.data.reviews || []);
      }
    } catch (err) {
      console.error('Error fetching doctor details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const handleSlotSelect = (slot, dateStr) => {
    setSelectedSlot(slot);
    setSelectedDate(dateStr);
  };

  const handleOpenBookingModal = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/doctors/${id}` } } });
      return;
    }
    if (!selectedSlot) {
      alert('Please select an available consultation time slot first.');
      return;
    }
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!reasonForVisit.trim()) {
      setBookingError('Please provide a reason or symptoms for your consultation.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');

    try {
      const payload = {
        doctorId: doctor._id,
        date: selectedDate || selectedSlot.date,
        timeSlot: {
          slotId: selectedSlot._id,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        },
        reasonForVisit,
        symptomsSummary,
        triageSpecialty: doctor.specialization,
      };

      const res = await appointmentApi.book(payload);
      if (res.data.success) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
        });

        setIsBookingModalOpen(false);
        const newApptId = res.data.appointment._id;
        navigate(`/consultation/${newApptId}`);
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      setBookingError(
        err.response?.data?.message || 'Slot already booked. Please pick another slot.'
      );
      // Refresh doctor data to show latest slot status
      fetchDoctor();
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-slate-200 rounded-3xl"></div>
          <div className="h-96 bg-slate-100 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Doctor Profile Not Found</h2>
        <button
          onClick={() => navigate('/doctors')}
          className="px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-xs"
        >
          Return to Doctor Directory
        </button>
      </div>
    );
  }

  const doctorUser = doctor.userId || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-teal-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </button>

      {/* Doctor Header Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-start gap-5">
            <div className="relative">
              <img
                src={doctorUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctorUser.name}`}
                alt={doctorUser.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover bg-slate-100 border-4 border-white shadow-md"
              />
              <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white rounded-full p-1 shadow-sm">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {doctorUser.name}
                </h1>
                <span className="bg-teal-50 text-teal-800 text-xs font-bold px-2.5 py-0.5 rounded-full border border-teal-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                  Verified Board-Certified
                </span>
              </div>

              <p className="text-base font-bold text-teal-700 flex items-center gap-2">
                <span>{doctor.specialization}</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 text-sm font-semibold">{doctor.experienceYears}+ Years Clinical Experience</span>
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 font-bold text-amber-900">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  <span>{doctor.averageRating ? doctor.averageRating.toFixed(1) : '5.0'}</span>
                  <span className="text-slate-500 font-normal">({doctor.totalReviews || 0} reviews)</span>
                </div>

                {doctor.hospitalAffiliation && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{doctor.hospitalAffiliation}</span>
                  </div>
                )}

                {doctor.languages?.length > 0 && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>{doctor.languages.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Pricing & CTA Box */}
          <div className="w-full md:w-auto bg-slate-50 p-5 rounded-2xl border border-slate-200 flex md:flex-col items-center md:items-end justify-between gap-4">
            <div className="text-left md:text-right">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider block">Standard Video Consult</span>
              <span className="text-2xl font-black text-slate-900">
                ${doctor.consultationFee}
                <span className="text-xs font-normal text-slate-500"> / 30 mins</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleOpenBookingModal}
              disabled={!selectedSlot}
              className={`px-6 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm ${
                selectedSlot
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-glow-teal hover:from-teal-700 hover:to-emerald-700'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>{selectedSlot ? `Book ${selectedSlot.startTime}` : 'Select a Slot Below'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Split: Left (Bio & Conditions Treated & Reviews) | Right (Slot Picker) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Details, Credentials & Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Bio & Education Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-slate-900">About the Doctor</h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {doctor.bio || 'Experienced practitioner dedicated to providing compassionate, personalized virtual healthcare.'}
              </p>
            </div>

            {/* Treated Conditions */}
            {doctor.conditionsTreated?.length > 0 && (
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Conditions & Diseases Treated
                </h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.conditionsTreated.map((cond, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200/70"
                    >
                      {cond}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education & License */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              {doctor.education && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Education & Fellowships</p>
                    <p className="text-xs text-slate-500 mt-0.5">{doctor.education}</p>
                  </div>
                </div>
              )}

              {doctor.licenseNumber && (
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Medical License Number</p>
                    <p className="text-xs text-slate-500 mt-0.5">{doctor.licenseNumber}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Patient Reviews Section */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Patient Reviews & Feedback</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified post-consultation ratings from MediPal patients
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 text-amber-900 font-bold text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                <span>{doctor.averageRating ? doctor.averageRating.toFixed(1) : '5.0'}</span>
                <span className="text-slate-400 font-normal">/ 5.0</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No reviews yet for this doctor.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {reviews.map((rev) => (
                  <div key={rev._id} className="py-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.patientId?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.patientId?.name}`}
                          alt={rev.patientId?.name}
                          className="w-8 h-8 rounded-full bg-slate-100 object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-800">{rev.patientId?.name || 'Verified Patient'}</p>
                          <p className="text-[10px] text-slate-400">{new Date(rev.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3.5 h-3.5 ${
                              rev.rating >= s
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed pl-10">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Live Interactive Slot Picker */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm sticky top-24 space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-teal-600" />
                Book Consultation
              </h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
                Real-Time Availability
              </span>
            </div>

            {/* Slot Picker Component */}
            <SlotPicker
              timeSlots={doctor.timeSlots || []}
              selectedSlot={selectedSlot}
              onSelectSlot={handleSlotSelect}
            />

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              {selectedSlot ? (
                <div className="p-3 bg-teal-50 rounded-2xl border border-teal-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-teal-900 block">Selected Slot:</span>
                    <span className="text-teal-700 font-semibold">{selectedDate || selectedSlot.date} at {selectedSlot.startTime}</span>
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">${doctor.consultationFee}</span>
                </div>
              ) : (
                <p className="text-xs text-slate-500 text-center">
                  Click an open time slot above to proceed with booking.
                </p>
              )}

              <button
                type="button"
                onClick={handleOpenBookingModal}
                disabled={!selectedSlot}
                className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-sm rounded-2xl shadow-glow-teal disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Continue to Intake & Booking</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-step Intake & Booking Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="p-6 bg-gradient-to-r from-teal-700 to-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">Confirm Consultation</h3>
                <p className="text-xs text-teal-100/80">
                  {doctorUser.name} ({doctor.specialization})
                </p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmBooking} className="p-6 space-y-5">
              {bookingError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-700 font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              {/* Slot Summary */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 font-medium block">Scheduled Time</span>
                  <span className="font-bold text-slate-900 text-sm">
                    {selectedDate || selectedSlot?.date} • {selectedSlot?.startTime} - {selectedSlot?.endTime}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 font-medium block">Consultation Fee</span>
                  <span className="font-bold text-teal-700 text-sm">${doctor.consultationFee}</span>
                </div>
              </div>

              {/* Reason for Visit */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Primary Reason for Consultation *
                </label>
                <input
                  type="text"
                  value={reasonForVisit}
                  onChange={(e) => setReasonForVisit(e.target.value)}
                  placeholder="e.g. Skin rash on forearm, severe recurring headache..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 text-sm"
                />
              </div>

              {/* Detailed Symptoms intake */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Describe Symptoms & Onset Duration (Optional)
                </label>
                <textarea
                  value={symptomsSummary}
                  onChange={(e) => setSymptomsSummary(e.target.value)}
                  rows={3}
                  placeholder="Provide any details about pain intensity, onset, triggers, or existing medications..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 text-sm resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={bookingLoading}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-bold rounded-xl shadow-glow-teal flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {bookingLoading ? 'Securing Slot...' : 'Confirm & Book Appointment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
