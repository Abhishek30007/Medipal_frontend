import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  Video,
  User,
  Star,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText,
  AlertCircle,
  Stethoscope,
  DollarSign,
  Activity,
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { appointmentApi, doctorApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { PrescriptionModal } from '../components/PrescriptionModal';

export const DoctorDashboard = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrescriptionAppt, setSelectedPrescriptionAppt] = useState(null);

  // New Slot State
  const [newSlotDate, setNewSlotDate] = useState(new Date().toISOString().split('T')[0]);
  const [newSlotStartTime, setNewSlotStartTime] = useState('10:00 AM');
  const [newSlotEndTime, setNewSlotEndTime] = useState('10:30 AM');
  const [slotAdding, setSlotAdding] = useState(false);
  const [slotMessage, setSlotMessage] = useState('');

  const fetchAppointments = async () => {
    try {
      const res = await appointmentApi.getMyAppointments();
      if (res.data.success) {
        setAppointments(res.data.appointments);
      }
    } catch (err) {
      console.error('Error fetching doctor appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (apptId, newStatus) => {
    try {
      const res = await appointmentApi.updateStatus(apptId, newStatus);
      if (res.data.success) {
        fetchAppointments();
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    setSlotAdding(true);
    setSlotMessage('');
    try {
      const res = await doctorApi.addSlot({
        date: newSlotDate,
        startTime: newSlotStartTime,
        endTime: newSlotEndTime,
      });
      if (res.data.success) {
        setSlotMessage('Time slot added successfully!');
        await refreshUser();
      }
    } catch (err) {
      console.error('Error adding slot:', err);
      setSlotMessage(err.response?.data?.message || 'Failed to add slot');
    } finally {
      setSlotAdding(false);
    }
  };

  const handleDeleteSlot = async (slotId) => {
    if (!confirm('Are you sure you want to remove this open availability slot?')) return;
    try {
      const res = await doctorApi.deleteSlot(slotId);
      if (res.data.success) {
        await refreshUser();
      }
    } catch (err) {
      console.error('Error deleting slot:', err);
      alert(err.response?.data?.message || 'Failed to delete slot');
    }
  };

  const doctorProfile = user?.doctorProfile || {};
  const activeSlots = doctorProfile.timeSlots || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Doctor Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-teal-800/40">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl bg-teal-800/50 object-cover border-2 border-teal-400/40"
          />
          <div>
            <h1 className="text-2xl font-bold">{user?.name} 🩺</h1>
            <p className="text-xs text-teal-200/80 mt-0.5">
              {doctorProfile.specialization || 'Physician'} • {doctorProfile.hospitalAffiliation || 'MediPal Medical Network'}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs">
              <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-800/40">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {doctorProfile.averageRating ? doctorProfile.averageRating.toFixed(1) : '5.0'} ({doctorProfile.totalReviews || 0} reviews)
              </span>
              <span className="text-teal-300 font-semibold">
                Fee: ${doctorProfile.consultationFee || 60} / session
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-500/40 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Online & Ready for Telehealth
          </span>
        </div>
      </div>

      {/* Main Grid: Left Consultation Queue | Right Slot & Availability Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Appointments Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-600" />
              Patient Consultations Queue ({appointments.length})
            </h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-32 bg-slate-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center space-y-3 shadow-sm">
              <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">No appointments booked currently</p>
              <p className="text-xs text-slate-500">Ensure your availability slots are added below so patients can book.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((appt) => {
                const patientUser = appt.patientId || {};
                return (
                  <div
                    key={appt._id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:border-teal-300 transition-all space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                      <div className="flex items-start gap-3">
                        <img
                          src={patientUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${patientUser.name}`}
                          alt={patientUser.name}
                          className="w-12 h-12 rounded-2xl object-cover bg-slate-100"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">{patientUser.name}</h3>
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                              appt.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                                : appt.status === 'completed'
                                ? 'bg-slate-100 text-slate-700'
                                : 'bg-teal-50 text-teal-800'
                            }`}>
                              {appt.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                            <span>{appt.date}</span>
                            <span>•</span>
                            <span className="font-semibold text-slate-700">{appt.timeSlot?.startTime} - {appt.timeSlot?.endTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <Link
                          to={`/consultation/${appt._id}`}
                          className="px-4 py-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-glow-teal flex items-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Launch Room</span>
                        </Link>

                        {appt.status !== 'completed' && (
                          <button
                            type="button"
                            onClick={() => setSelectedPrescriptionAppt(appt)}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Write Rx
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Patient Reason & Clinical Intake */}
                    <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs space-y-1.5">
                      <p className="font-semibold text-slate-800">
                        <strong className="text-teal-700">Reason:</strong> {appt.reasonForVisit}
                      </p>
                      {appt.symptomsSummary && (
                        <p className="text-slate-600">
                          <strong>Intake Symptoms:</strong> {appt.symptomsSummary}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-slate-500 pt-1 text-[11px]">
                        <span>Blood Group: <strong>{patientUser.bloodGroup || 'O+'}</strong></span>
                        <span>Allergies: <strong>{patientUser.allergies?.join(', ') || 'None reported'}</strong></span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 1 Col: Availability & Slot Manager */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-teal-600" />
                Slot Manager
              </h3>
              <span className="text-xs text-slate-400">{activeSlots.length} Total Slots</span>
            </div>

            {/* Add Slot Form */}
            <form onSubmit={handleAddSlot} className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-800 block">Open New Availability Slot</span>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Date</label>
                <input
                  type="date"
                  value={newSlotDate}
                  onChange={(e) => setNewSlotDate(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Start Time</label>
                  <input
                    type="text"
                    value={newSlotStartTime}
                    onChange={(e) => setNewSlotStartTime(e.target.value)}
                    placeholder="10:00 AM"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">End Time</label>
                  <input
                    type="text"
                    value={newSlotEndTime}
                    onChange={(e) => setNewSlotEndTime(e.target.value)}
                    placeholder="10:30 AM"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              {slotMessage && (
                <p className="text-[11px] font-semibold text-teal-700">{slotMessage}</p>
              )}

              <button
                type="submit"
                disabled={slotAdding}
                className="w-full py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                {slotAdding ? 'Adding...' : 'Add Slot to Calendar'}
              </button>
            </form>

            {/* Existing Slots List */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Upcoming Active Slots</span>
              <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                {activeSlots.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No slots generated.</p>
                ) : (
                  activeSlots.slice(0, 15).map((slot) => (
                    <div
                      key={slot._id}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-800">{slot.date}</span>
                        <span className="text-slate-500 ml-2">{slot.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          slot.isBooked
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {slot.isBooked ? 'Booked' : 'Open'}
                        </span>
                        {!slot.isBooked && (
                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(slot._id)}
                            className="text-slate-400 hover:text-rose-600 p-1"
                            title="Remove Slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Doctor Prescription Modal */}
      {selectedPrescriptionAppt && (
        <PrescriptionModal
          isOpen={true}
          onClose={() => setSelectedPrescriptionAppt(null)}
          isDoctor={true}
          appointment={selectedPrescriptionAppt}
          onSavePrescription={async (data) => {
            await appointmentApi.savePrescription(selectedPrescriptionAppt._id, data);
            fetchAppointments();
          }}
        />
      )}
    </div>
  );
};
