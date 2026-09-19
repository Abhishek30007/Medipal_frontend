import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { TriageChatDrawer } from './components/TriageChatDrawer';

// Pages
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DoctorDiscovery } from './pages/DoctorDiscovery';
import { DoctorDetail } from './pages/DoctorDetail';
import { PatientDashboard } from './pages/PatientDashboard';
import { DoctorDashboard } from './pages/DoctorDashboard';
import { ConsultationRoom } from './pages/ConsultationRoom';
import { NotFound } from './pages/NotFound';
import { Sparkles } from 'lucide-react';

export const App = () => {
  const [isAiTriageOpen, setIsAiTriageOpen] = useState(false);

  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-teal-500 selection:text-white">
            
            {/* Top Navigation */}
            <Navbar onOpenAiTriage={() => setIsAiTriageOpen(true)} />

            {/* Main View Router */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home onOpenAiTriage={() => setIsAiTriageOpen(true)} />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/doctors" element={<DoctorDiscovery onOpenAiTriage={() => setIsAiTriageOpen(true)} />} />
                <Route path="/doctors/:id" element={<DoctorDetail />} />

                {/* Patient Routes */}
                <Route
                  path="/patient/dashboard"
                  element={
                    <ProtectedRoute requiredRole="patient">
                      <PatientDashboard onOpenAiTriage={() => setIsAiTriageOpen(true)} />
                    </ProtectedRoute>
                  }
                />

                {/* Doctor Routes */}
                <Route
                  path="/doctor/dashboard"
                  element={
                    <ProtectedRoute requiredRole="doctor">
                      <DoctorDashboard />
                    </ProtectedRoute>
                  }
                />

                {/* Consultation Room (Both Roles) */}
                <Route
                  path="/consultation/:id"
                  element={
                    <ProtectedRoute>
                      <ConsultationRoom />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Floating 24/7 AI Triage FAB */}
            <button
              onClick={() => setIsAiTriageOpen(true)}
              className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-700 hover:from-teal-700 hover:to-emerald-700 text-white p-4 rounded-3xl shadow-glow-teal flex items-center gap-2.5 hover:scale-105 transition-all duration-200 group border-2 border-white/20"
              title="Open Gemini AI Medical Triage Assistant"
            >
              <div className="relative">
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <span className="text-xs font-extrabold pr-1 tracking-wide hidden sm:inline">
                AI Symptom Triage
              </span>
            </button>

            {/* Global AI Triage Drawer */}
            <TriageChatDrawer
              isOpen={isAiTriageOpen}
              onClose={() => setIsAiTriageOpen(false)}
            />

            {/* Global Footer */}
            <Footer onOpenAiTriage={() => setIsAiTriageOpen(true)} />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
