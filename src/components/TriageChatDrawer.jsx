import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  Send,
  Stethoscope,
  AlertTriangle,
  HeartHandshake,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Bot,
  User,
  ArrowRight,
} from 'lucide-react';
import { aiApi } from '../services/api';

export const TriageChatDrawer = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'model',
      text: `### 👋 Hello! I'm your AI Clinical Triage Assistant.
I can help assess your symptoms, provide safe self-care guidance, highlight urgent warning signs, and recommend the right medical specialist for a consultation.

**How can I assist you today?** Please describe what you are experiencing.`,
      specialty: null,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickSymptoms = [
    'Persistent skin rash & itching for 3 days',
    'Severe throbbing migraine with light sensitivity',
    'Stomach cramping and nausea since morning',
    'Chest tightness and rapid heart palpitations',
    'Child has high fever and ear discomfort',
    'Anxiety, racing thoughts & trouble sleeping',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userText) => {
    const textToSend = userText || input;
    if (!textToSend.trim() || loading) return;

    const newMessages = [
      ...messages,
      { role: 'user', text: textToSend },
    ];

    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Build history for API
      const historyPayload = newMessages.slice(0, -1).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await aiApi.symptomCheck(textToSend, historyPayload);

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'model',
            text: res.data.reply,
            specialty: res.data.recommendedSpecialty,
            matchingDoctors: res.data.matchingDoctors || [],
          },
        ]);
      }
    } catch (err) {
      console.error('[AiTriage] Error evaluating symptoms:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          text: `⚠️ **Unable to complete AI assessment at this moment.**\n\nIf you are experiencing severe or worsening symptoms, please consult a General Physician or visit an urgent care facility immediately.`,
          specialty: 'General Physician',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookSpecialist = (specialty) => {
    onClose();
    navigate(`/doctors?specialty=${encodeURIComponent(specialty)}`);
  };

  const resetChat = () => {
    setMessages([
      {
        role: 'model',
        text: `### 👋 Hello! I'm your AI Clinical Triage Assistant.
I can help assess your symptoms, provide safe self-care guidance, highlight urgent warning signs, and recommend the right medical specialist for a consultation.

**How can I assist you today?** Please describe what you are experiencing.`,
        specialty: null,
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white flex items-center justify-between border-b border-teal-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  Gemini AI Symptom Triage
                  <span className="text-[10px] bg-teal-500/30 text-teal-300 px-2 py-0.5 rounded-full border border-teal-400/20 uppercase tracking-wide font-bold">
                    Interactive
                  </span>
                </h3>
                <p className="text-xs text-slate-300">24/7 Clinical Follow-Up & Specialist Match</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetChat}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                title="Reset Conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Safety Banner */}
          <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 flex items-center gap-2 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              <strong>Triage Guidance Only:</strong> Not a certified diagnosis. In an emergency, dial 911 immediately.
            </span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none space-y-3'
                  }`}
                >
                  {/* Message Text Rendering with Clean Formatting */}
                  <div className="whitespace-pre-line prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-headings:my-1 prose-p:my-1">
                    {msg.text}
                  </div>

                  {/* Specialist Match Card */}
                  {msg.specialty && (
                    <div className="mt-3 pt-3 border-t border-slate-100 bg-teal-50/80 p-3 rounded-xl border border-teal-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                      <div className="flex items-center gap-2 text-teal-900">
                        <Stethoscope className="w-5 h-5 text-teal-600" />
                        <div>
                          <p className="text-xs text-teal-600 font-semibold uppercase tracking-wider">Matched Specialist</p>
                          <p className="text-sm font-bold text-slate-900">{msg.specialty}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleBookSpecialist(msg.specialty)}
                        className="w-full sm:w-auto px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
                      >
                        Find {msg.specialty}s
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-white flex-shrink-0 mt-1 shadow-sm">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-center text-slate-500 text-xs py-2">
                <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-bounce [animation-delay:0.4s]"></div>
                  <span className="font-medium text-slate-600 ml-1">Analyzing symptoms & formulating triage...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Symptom Chips */}
          <div className="px-4 py-2 bg-white border-t border-slate-100 overflow-x-auto flex gap-2 no-scrollbar">
            {quickSymptoms.map((symptom, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(symptom)}
                disabled={loading}
                className="whitespace-nowrap px-3 py-1 rounded-full text-xs font-medium bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-700 border border-slate-200/60 transition-colors disabled:opacity-50 flex-shrink-0"
              >
                {symptom}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type symptoms (e.g. Sharp pain in lower right abdomen since morning)..."
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm bg-slate-50 focus:bg-white transition-all"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-glow-teal"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
