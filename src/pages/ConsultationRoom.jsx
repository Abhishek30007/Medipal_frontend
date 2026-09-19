import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Video,
  Send,
  FileText,
  Clock,
  Calendar,
  User,
  ShieldCheck,
  Star,
  CheckCircle2,
  AlertCircle,
  Stethoscope,
  Lock,
  ArrowLeft,
  Volume2,
} from 'lucide-react';
import { appointmentApi, messageApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { PrescriptionModal } from '../components/PrescriptionModal';
import { ReviewModal } from '../components/ReviewModal';
import { VideoConsultModal } from '../components/VideoConsultModal';

export const ConsultationRoom = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, isConnected } = useSocket();

  const [appointment, setAppointment] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [typingUser, setTypingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch appointment data and historical messages
  const fetchRoomData = async () => {
    try {
      const [apptRes, msgRes] = await Promise.all([
        appointmentApi.getById(id),
        messageApi.getMessages(id),
      ]);

      if (apptRes.data.success) {
        setAppointment(apptRes.data.appointment);
      }
      if (msgRes.data.success) {
        setMessages(msgRes.data.messages);
      }
    } catch (err) {
      console.error('Error fetching room data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [id]);

  // Socket.IO Room Lifecycle
  useEffect(() => {
    if (!socket || !appointment) return;

    // Join room
    socket.emit('join_room', {
      appointmentId: id,
      userId: user?._id,
      userName: user?.name,
      role: user?.role,
    });

    // Listen for new messages
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Listen for typing indicator
    socket.on('typing_indicator', ({ isTyping, userName, role }) => {
      if (isTyping && userName !== user?.name) {
        setTypingUser({ userName, role });
      } else {
        setTypingUser(null);
      }
    });

    // Listen for status updates
    socket.on('status_updated', ({ status }) => {
      setAppointment((prev) => (prev ? { ...prev, status } : prev));
    });

    return () => {
      socket.emit('leave_room', {
        appointmentId: id,
        userName: user?.name,
      });
      socket.off('receive_message');
      socket.off('typing_indicator');
      socket.off('status_updated');
    };
  }, [socket, appointment, id, user]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typingUser]);

  // Handle typing debounce
  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (socket && appointment) {
      socket.emit('typing_start', {
        appointmentId: id,
        userName: user?.name,
        role: user?.role,
      });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('typing_stop', {
          appointmentId: id,
          userName: user?.name,
        });
      }, 1500);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const messageData = {
      appointmentId: id,
      senderId: user?._id,
      senderRole: user?.role,
      senderName: user?.name,
      message: inputText.trim(),
      type: 'text',
    };

    if (socket && isConnected) {
      socket.emit('send_message', messageData);
    } else {
      // Fallback via HTTP API
      messageApi.sendMessage(id, messageData).then((res) => {
        if (res.data.success) {
          setMessages((prev) => [...prev, res.data.message]);
        }
      });
    }

    if (socket) {
      socket.emit('typing_stop', { appointmentId: id, userName: user?.name });
    }

    setInputText('');
  };

  const handleEndConsultation = async () => {
    if (user?.role === 'doctor') {
      setIsPrescriptionModalOpen(true);
    } else {
      if (confirm('Are you sure you want to mark this consultation completed?')) {
        await appointmentApi.updateStatus(id, 'completed');
        fetchRoomData();
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-slate-600">Entering consultation room...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Consultation Session Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-5 py-2.5 bg-teal-600 text-white font-bold rounded-xl text-xs"
        >
          Return Home
        </button>
      </div>
    );
  }

  const isDoctor = user?.role === 'doctor';
  const doctorUser = appointment?.doctorId?.userId || {};
  const patientUser = appointment?.patientId || {};
  const otherPersonName = isDoctor ? patientUser.name : doctorUser.name;
  const isCompleted = appointment.status === 'completed';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(isDoctor ? '/doctor/dashboard' : '/patient/dashboard')}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <img
            src={
              isDoctor
                ? patientUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${patientUser.name}`
                : doctorUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doctorUser.name}`
            }
            alt={otherPersonName}
            className="w-12 h-12 rounded-2xl object-cover bg-slate-100 border border-slate-200"
          />

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">
                Consultation: {otherPersonName}
              </h1>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                appointment.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800 animate-pulse'
                  : appointment.status === 'completed'
                  ? 'bg-slate-100 text-slate-700'
                  : 'bg-teal-50 text-teal-800'
              }`}>
                {appointment.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {appointment.date} • {appointment.timeSlot?.startTime} - {appointment.timeSlot?.endTime} ({appointment.doctorId?.specialization})
            </p>
          </div>
        </div>

        {/* Room Action Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end flex-wrap">
          {/* Launch HD Video Button */}
          {!isCompleted && (
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-glow-teal flex items-center gap-2 transition-all"
            >
              <Video className="w-4 h-4" />
              <span>Launch HD Video</span>
            </button>
          )}

          {/* Prescription Button */}
          {(isDoctor || isCompleted) && (
            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-sm transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>{isDoctor && !isCompleted ? 'Write Prescription' : 'View Prescription'}</span>
            </button>
          )}

          {/* Rate Doctor for Patient */}
          {!isDoctor && isCompleted && !appointment.hasReview && (
            <button
              onClick={() => setIsReviewModalOpen(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Star className="w-4 h-4 fill-white" />
              <span>Rate Consultation</span>
            </button>
          )}

          {/* Doctor Mark Completed */}
          {isDoctor && !isCompleted && (
            <button
              onClick={handleEndConsultation}
              className="px-4 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 font-bold text-xs rounded-xl border border-rose-200 transition-colors"
            >
              Conclude Visit
            </button>
          )}
        </div>
      </div>

      {/* Main Split Layout: Left (Clinical Summary & Intake) | Right (Real-time Socket.IO Chat) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Col: Patient Medical Intake & Clinical Notes */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-teal-600" />
                Intake & Medical Summary
              </h3>
              <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-bold">
                Confidential
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Reason For Consultation
                </span>
                <p className="font-semibold text-slate-900 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  {appointment.reasonForVisit}
                </p>
              </div>

              {appointment.symptomsSummary && (
                <div>
                  <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                    Reported Symptoms & Onset
                  </span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                    {appointment.symptomsSummary}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block font-medium">Blood Group</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block">{patientUser.bloodGroup || 'O+'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block font-medium">Gender / Age</span>
                  <span className="font-bold text-slate-900 text-sm mt-0.5 block capitalize">{patientUser.gender || 'Not specified'}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold uppercase tracking-wider block mb-1">
                  Known Allergies
                </span>
                <div className="flex flex-wrap gap-1">
                  {patientUser.allergies?.length > 0 ? (
                    patientUser.allergies.map((a, i) => (
                      <span key={i} className="bg-rose-50 text-rose-700 font-semibold px-2 py-0.5 rounded border border-rose-200">
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">None reported</span>
                  )}
                </div>
              </div>
            </div>

            {/* Issued Diagnosis / Rx Summary if present */}
            {appointment.diagnosis && (
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-600" />
                  Issued Clinical Diagnosis
                </span>
                <p className="font-bold text-sm text-slate-900 bg-teal-50/60 p-3 rounded-xl border border-teal-100">
                  {appointment.diagnosis}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Real-Time Consultation Chat Room */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col h-[650px] overflow-hidden">
          
          {/* Chat Room Sub-Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-600 font-semibold">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span>{isConnected ? 'Socket.IO Real-Time Stream Connected' : 'Connecting WebSocket...'}</span>
            </div>
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              Encrypted Medical Chat
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
            {messages.map((msg, index) => {
              const isMe = msg.senderId === user?._id;
              const isSystem = msg.senderRole === 'system' || msg.type === 'system_event';
              const isPrescriptionAlert = msg.type === 'prescription_alert';

              if (isSystem) {
                return (
                  <div key={index} className="text-center my-3">
                    <span className="inline-block px-3 py-1 rounded-full bg-slate-200/70 text-slate-600 text-[11px] font-semibold border border-slate-300/40">
                      {msg.message}
                    </span>
                  </div>
                );
              }

              if (isPrescriptionAlert) {
                return (
                  <div key={index} className="my-3 p-4 bg-teal-50 border border-teal-200 rounded-2xl text-center space-y-2">
                    <p className="text-xs font-bold text-teal-900">{msg.message}</p>
                    <button
                      onClick={() => setIsPrescriptionModalOpen(true)}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                    >
                      Open Full Prescription
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={index}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] text-slate-400 font-semibold px-1 mb-0.5">
                    {msg.senderName} ({msg.senderRole === 'doctor' ? 'Doctor' : 'Patient'}) • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                      isMe
                        ? 'bg-teal-600 text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {typingUser && (
              <div className="flex items-center gap-2 text-xs text-slate-400 py-1">
                <span className="font-semibold text-slate-600">{typingUser.userName}</span> is typing...
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          {isCompleted ? (
            <div className="p-4 bg-slate-100 text-center border-t border-slate-200 text-xs text-slate-500 font-semibold flex items-center justify-center gap-1.5">
              <Lock className="w-4 h-4 text-slate-400" />
              This consultation is concluded. Chat history is preserved in read-only archive mode.
            </div>
          ) : (
            <div className="p-4 bg-white border-t border-slate-200">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Type message to doctor/patient in consultation..."
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-slate-50 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed shadow-glow-teal transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Video Consult Modal */}
      <VideoConsultModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        appointment={appointment}
        userRole={user?.role}
        onOpenPrescription={() => {
          setIsVideoModalOpen(false);
          setIsPrescriptionModalOpen(true);
        }}
      />

      {/* Prescription Modal */}
      {isPrescriptionModalOpen && (
        <PrescriptionModal
          isOpen={true}
          onClose={() => setIsPrescriptionModalOpen(false)}
          isDoctor={isDoctor}
          appointment={appointment}
          onSavePrescription={async (data) => {
            await appointmentApi.savePrescription(id, data);
            fetchRoomData();
          }}
        />
      )}

      {/* Review Modal for Patient */}
      {isReviewModalOpen && (
        <ReviewModal
          isOpen={true}
          onClose={() => setIsReviewModalOpen(false)}
          doctor={appointment.doctorId}
          appointmentId={id}
          onReviewSubmitted={() => {
            fetchRoomData();
          }}
        />
      )}
    </div>
  );
};
