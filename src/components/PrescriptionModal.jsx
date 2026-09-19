import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  X,
  Stethoscope,
  Pill,
  Calendar,
  Download,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export const PrescriptionModal = ({
  isOpen,
  onClose,
  isDoctor,
  appointment,
  onSavePrescription,
}) => {
  const [diagnosis, setDiagnosis] = useState(
    appointment?.diagnosis || ''
  );
  const [generalAdvice, setGeneralAdvice] = useState(
    appointment?.prescription?.generalAdvice || ''
  );
  const [followUpDate, setFollowUpDate] = useState(
    appointment?.prescription?.followUpDate || ''
  );
  const [medicines, setMedicines] = useState(
    appointment?.prescription?.medicines?.length > 0
      ? appointment.prescription.medicines
      : [
          {
            name: '',
            dosage: '',
            frequency: 'Twice daily after meals',
            duration: '5 days',
            notes: '',
          },
        ]
  );
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleAddMedicine = () => {
    setMedicines([
      ...medicines,
      {
        name: '',
        dosage: '',
        frequency: 'Twice daily after meals',
        duration: '5 days',
        notes: '',
      },
    ]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, idx) => idx !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...medicines];
    updated[index][field] = value;
    setMedicines(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      alert('Please enter a clinical diagnosis');
      return;
    }

    setSaving(true);
    try {
      await onSavePrescription({
        diagnosis,
        generalAdvice,
        followUpDate,
        medicines: medicines.filter((m) => m.name.trim() !== ''),
      });
      onClose();
    } catch (err) {
      console.error('Error saving prescription:', err);
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-slate-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-teal-300 border border-white/20">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isDoctor && appointment?.status !== 'completed'
                  ? 'Issue Medical Prescription'
                  : 'Official Medical Prescription'}
              </h3>
              <p className="text-xs text-teal-100/80">
                MediPal Telehealth Clinical Summary & Electronic Rx
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {isDoctor && appointment?.status !== 'completed' ? (
          // Doctor Form
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Diagnosis */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Primary Clinical Diagnosis *
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Allergic Dermatitis / Tension Headache"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
              />
            </div>

            {/* Medicines List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-teal-600" />
                  Prescribed Medications
                </label>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Medicine
                </button>
              </div>

              <div className="space-y-3">
                {medicines.map((med, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 relative"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                        placeholder="Drug Name (e.g. Cetirizine 10mg)"
                        className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                        placeholder="Dosage (e.g. 1 tablet)"
                        className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                        placeholder="Frequency (e.g. Once daily at bedtime)"
                        className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedicineChange(idx, 'duration', e.target.value)}
                        placeholder="Duration (e.g. 7 days)"
                        className="px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-teal-500"
                      />
                    </div>

                    {medicines.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMedicine(idx)}
                        className="text-xs text-rose-500 hover:text-rose-700 flex items-center gap-1 font-medium mt-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* General Advice */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Clinical Advice & Dietary Recommendations
              </label>
              <textarea
                value={generalAdvice}
                onChange={(e) => setGeneralAdvice(e.target.value)}
                rows={3}
                placeholder="e.g. Drink 2-3 liters of water, apply cold compress twice daily, avoid sun exposure..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm resize-none"
              />
            </div>

            {/* Follow-up */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Recommended Follow-up
              </label>
              <input
                type="text"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                placeholder="e.g. 7 days or if rash worsens"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:outline-none text-sm"
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white text-sm font-bold rounded-xl shadow-glow-teal flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                {saving ? 'Finalizing...' : 'Issue Rx & Complete Consult'}
              </button>
            </div>
          </form>
        ) : (
          // View / Print Mode
          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            {/* Header info */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <p className="text-xs text-slate-500">Patient Name</p>
                <p className="text-base font-bold text-slate-900">{appointment?.patientId?.name || 'Patient'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">Consulting Doctor</p>
                <p className="text-base font-bold text-teal-700">{appointment?.doctorId?.userId?.name || 'Doctor'}</p>
                <p className="text-xs text-slate-500">{appointment?.doctorId?.specialization}</p>
              </div>
            </div>

            {/* Diagnosis */}
            <div className="bg-teal-50/60 p-4 rounded-2xl border border-teal-100">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Clinical Diagnosis</span>
              <p className="text-base font-bold text-slate-900 mt-1">
                {appointment?.diagnosis || 'General Clinical Review & Consultation'}
              </p>
            </div>

            {/* Medications */}
            {appointment?.prescription?.medicines?.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Pill className="w-4 h-4 text-teal-600" /> Prescribed Medications
                </h4>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                  {appointment.prescription.medicines.map((med, idx) => (
                    <div key={idx} className="p-3 bg-white flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{med.name}</p>
                        <p className="text-xs text-slate-500">{med.frequency} • {med.duration}</p>
                      </div>
                      <span className="text-xs font-semibold bg-slate-100 px-2.5 py-1 rounded-lg text-slate-700">
                        {med.dosage}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* General Advice */}
            {appointment?.prescription?.generalAdvice && (
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Doctor Instructions & Care Plan</h4>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
                  {appointment.prescription.generalAdvice}
                </p>
              </div>
            )}

            {/* Follow up */}
            {appointment?.prescription?.followUpDate && (
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Follow-up Recommended: {appointment.prescription.followUpDate}</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
                <ShieldCheck className="w-4 h-4" /> Digitally Verified Prescription
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
