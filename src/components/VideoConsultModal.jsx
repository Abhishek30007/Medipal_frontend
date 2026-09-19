import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  PhoneOff,
  Maximize2,
  ShieldCheck,
  User,
  Sparkles,
  Volume2,
  Settings,
  MessageSquare,
} from 'lucide-react';

export const VideoConsultModal = ({
  isOpen,
  onClose,
  appointment,
  userRole,
  onOpenPrescription,
}) => {
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const localVideoRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(timer);
  }, [isOpen]);

  // Format seconds to mm:ss
  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const doctorName = appointment?.doctorId?.userId?.name || 'Dr. Specialist';
  const patientName = appointment?.patientId?.name || 'Patient';
  const otherPartyName = userRole === 'doctor' ? patientName : doctorName;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col animate-in fade-in duration-200">
      
      {/* Top Bar */}
      <div className="px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 flex items-center justify-between text-white z-10">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
          <div>
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
              Telehealth Video Consultation with {otherPartyName}
              <span className="text-[10px] bg-teal-500/20 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/30">
                HD 1080p
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Session Duration: <span className="font-mono text-emerald-400 font-bold">{formatTime(callDuration)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/60 font-semibold">
            <ShieldCheck className="w-4 h-4" /> HIPAA End-to-End Encrypted
          </div>

          {userRole === 'doctor' && onOpenPrescription && (
            <button
              onClick={onOpenPrescription}
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              Write Prescription
            </button>
          )}

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Minimize Video"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Stage */}
      <div className="flex-1 relative bg-slate-950 flex items-center justify-center p-4">
        
        {/* Remote Participant Video Box */}
        <div className="w-full h-full max-w-5xl max-h-[70vh] bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 relative flex items-center justify-center shadow-2xl">
          
          {/* Simulated HD Doctor/Patient Stream */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10"></div>

          <img
            src={
              userRole === 'doctor'
                ? appointment?.patientId?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
                : appointment?.doctorId?.userId?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&auto=format&fit=crop&q=80'
            }
            alt={otherPartyName}
            className="w-full h-full object-cover"
          />

          {/* Name Tag */}
          <div className="absolute bottom-6 left-6 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/80 text-white shadow-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-sm font-bold">{otherPartyName}</span>
            <span className="text-xs text-slate-400">({userRole === 'doctor' ? 'Patient' : 'Consulting Specialist'})</span>
          </div>

          {/* Audio Wave Indicator */}
          <div className="absolute top-6 right-6 z-20 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/60 text-xs text-emerald-400">
            <Volume2 className="w-3.5 h-3.5 animate-pulse" />
            <span>Audio Connected</span>
          </div>

          {/* Local User PiP (Picture in Picture) */}
          <div className="absolute bottom-6 right-6 z-20 w-36 sm:w-48 aspect-video bg-slate-800 rounded-2xl border-2 border-teal-500 shadow-2xl overflow-hidden">
            {videoEnabled ? (
              <div className="w-full h-full bg-slate-700 relative flex items-center justify-center">
                <div className="text-center p-2">
                  <div className="w-8 h-8 rounded-full bg-teal-600 mx-auto flex items-center justify-center text-white text-xs font-bold mb-1">
                    You
                  </div>
                  <span className="text-[10px] text-teal-200 font-semibold block">Camera Active</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
                <VideoOff className="w-6 h-6" />
              </div>
            )}
            <div className="absolute bottom-1.5 left-2 text-[10px] font-bold text-white bg-slate-900/80 px-1.5 rounded">
              You
            </div>
          </div>
        </div>
      </div>

      {/* Video Controls Footer */}
      <div className="py-5 px-6 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 flex items-center justify-center gap-4 text-white">
        
        {/* Toggle Mic */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className={`p-4 rounded-2xl transition-all shadow-lg ${
            audioEnabled
              ? 'bg-slate-800 hover:bg-slate-700 text-white'
              : 'bg-rose-600 hover:bg-rose-700 text-white'
          }`}
          title={audioEnabled ? 'Mute Microphone' : 'Unmute Microphone'}
        >
          {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Toggle Camera */}
        <button
          onClick={() => setVideoEnabled(!videoEnabled)}
          className={`p-4 rounded-2xl transition-all shadow-lg ${
            videoEnabled
              ? 'bg-slate-800 hover:bg-slate-700 text-white'
              : 'bg-rose-600 hover:bg-rose-700 text-white'
          }`}
          title={videoEnabled ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* End Call */}
        <button
          onClick={onClose}
          className="px-6 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-rose-900/50 hover:scale-105 transition-all"
        >
          <PhoneOff className="w-5 h-5" />
          <span>Leave Video Call</span>
        </button>
      </div>
    </div>
  );
};
