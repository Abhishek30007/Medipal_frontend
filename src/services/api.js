import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Optional: auto-logout on token expiration if needed
    }
    return Promise.reject(error);
  }
);

// API Endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
  updateDoctorOnboarding: (data) => api.put('/auth/doctor-onboarding', data),
};

export const doctorApi = {
  getDoctors: (params) => api.get('/doctors', { params }),
  getDoctorById: (id) => api.get(`/doctors/${id}`),
  getSpecialties: () => api.get('/doctors/specialties'),
  addSlot: (slotData) => api.post('/doctors/slots', slotData),
  deleteSlot: (slotId) => api.delete(`/doctors/slots/${slotId}`),
};

export const appointmentApi = {
  book: (data) => api.post('/appointments', data),
  getMyAppointments: () => api.get('/appointments/my'),
  getById: (id) => api.get(`/appointments/${id}`),
  updateStatus: (id, status) => api.patch(`/appointments/${id}/status`, { status }),
  savePrescription: (id, prescriptionData) =>
    api.post(`/appointments/${id}/prescription`, prescriptionData),
};

export const messageApi = {
  getMessages: (appointmentId) => api.get(`/messages/${appointmentId}`),
  sendMessage: (appointmentId, data) => api.post(`/messages/${appointmentId}`, data),
};

export const reviewApi = {
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getDoctorReviews: (doctorId) => api.get(`/reviews/doctor/${doctorId}`),
};

export const aiApi = {
  symptomCheck: (message, history) =>
    api.post('/ai/symptom-check', { message, history }),
};

export default api;
