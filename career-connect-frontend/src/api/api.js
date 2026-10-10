import axios from 'axios';
import { mockStore } from './mockStore';

// Base API configuration pointing to Spring Boot backend
const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1500, // 1.5s timeout for quick fallback if backend is offline
});

// State tracking for backend connectivity
let isBackendOnline = null; // null = checking, true = connected, false = offline (demo mode)
let lastCheckTime = 0;
const CHECK_INTERVAL = 10000; // Check real backend every 10 seconds

export const getBackendStatus = () => isBackendOnline;

function updateBackendStatus(online) {
  if (isBackendOnline !== online) {
    isBackendOnline = online;
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('backend-status-change', { detail: { isOnline: online } })
      );
    }
  }
}

// Background ping to check if Spring Boot backend comes online
export async function checkBackendHealth() {
  try {
    await axios.get(`${API_BASE_URL}/jobs`, { timeout: 1200 });
    updateBackendStatus(true);
    return true;
  } catch (err) {
    if (err.response) {
      // Backend replied with HTTP status (e.g. 200, 401, 500) -> backend is online
      updateBackendStatus(true);
      return true;
    }
    updateBackendStatus(false);
    return false;
  }
}

// Helper: Try backend call, fallback to mock store if backend is unreachable
async function callWithFallback(backendCall, mockFallback) {
  const now = Date.now();

  // If backend is known to be offline and recently checked, use mock immediately for snappy UI
  if (isBackendOnline === false && now - lastCheckTime < CHECK_INTERVAL) {
    try {
      const mockData = await mockFallback();
      return { data: mockData };
    } catch (err) {
      throw err;
    }
  }

  try {
    const response = await backendCall();
    lastCheckTime = now;
    updateBackendStatus(true);
    return response;
  } catch (err) {
    // Check if network error, connection refused, or timeout
    const isNetworkError =
      !err.response ||
      err.code === 'ERR_NETWORK' ||
      err.code === 'ECONNABORTED' ||
      err.message?.includes('Network Error') ||
      err.message?.includes('timeout');

    if (isNetworkError) {
      lastCheckTime = now;
      updateBackendStatus(false);
      try {
        const mockData = await mockFallback();
        return { data: mockData };
      } catch (mockErr) {
        throw mockErr;
      }
    }

    // Backend is online and gave an explicit HTTP response (e.g. 400 Bad Request)
    updateBackendStatus(true);
    throw err;
  }
}

// Student APIs
export const studentApi = {
  register: (studentData) =>
    callWithFallback(
      () => api.post('/students/register', studentData),
      () => mockStore.registerStudent(studentData)
    ),

  login: (credentials) =>
    callWithFallback(
      () =>
        api.post('/students/login', {
          username: credentials.email,
          password: credentials.password,
        }),
      () => mockStore.loginStudent(credentials.email, credentials.password)
    ),

  getById: (id) =>
    callWithFallback(
      () => api.get(`/students/${id}`),
      () => mockStore.getStudentById(id)
    ),

  update: (id, studentData) =>
    callWithFallback(
      () => api.put(`/students/${id}`, studentData),
      () => mockStore.updateStudent(id, studentData)
    ),
};

// AI Recommendation APIs
export const recommendationApi = {
  getForStudent: (studentId) =>
    callWithFallback(
      () => api.get(`/recommendations/student/${studentId}`),
      () => mockStore.getRecommendationsForStudent(studentId)
    ),

  getGuestRecommendations: (params = {}) =>
    callWithFallback(
      () => api.get('/recommendations/guest', { params }),
      () => mockStore.getGuestRecommendations(params)
    ),
};

// Jobs APIs
export const jobApi = {
  getAll: (params = {}) =>
    callWithFallback(
      () => api.get('/jobs', { params }),
      () => mockStore.getJobs(params)
    ),

  getById: (id) =>
    callWithFallback(
      () => api.get(`/jobs/${id}`),
      () => mockStore.getJobById(id)
    ),

  create: (jobData) =>
    callWithFallback(
      () => api.post('/jobs', jobData),
      () => mockStore.createJob(jobData)
    ),

  update: (id, jobData) =>
    callWithFallback(
      () => api.put(`/jobs/${id}`, jobData),
      () => mockStore.updateJob(id, jobData)
    ),

  delete: (id) =>
    callWithFallback(
      () => api.delete(`/jobs/${id}`),
      () => mockStore.deleteJob(id)
    ),
};

// Internships APIs
export const internshipApi = {
  getAll: (params = {}) =>
    callWithFallback(
      () => api.get('/internships', { params }),
      () => mockStore.getInternships(params)
    ),

  getById: (id) =>
    callWithFallback(
      () => api.get(`/internships/${id}`),
      () => mockStore.getInternshipById(id)
    ),

  create: (internshipData) =>
    callWithFallback(
      () => api.post('/internships', internshipData),
      () => mockStore.createInternship(internshipData)
    ),

  update: (id, internshipData) =>
    callWithFallback(
      () => api.put(`/internships/${id}`, internshipData),
      () => mockStore.updateInternship(id, internshipData)
    ),

  delete: (id) =>
    callWithFallback(
      () => api.delete(`/internships/${id}`),
      () => mockStore.deleteInternship(id)
    ),
};

// Applications APIs
export const applicationApi = {
  apply: (applicationData) =>
    callWithFallback(
      () => api.post('/applications', applicationData),
      () => mockStore.apply(applicationData)
    ),

  getByStudent: (studentId) =>
    callWithFallback(
      () => api.get(`/applications/student/${studentId}`),
      () => mockStore.getApplicationsByStudent(studentId)
    ),

  getByJob: (jobId) =>
    callWithFallback(
      () => api.get(`/applications/job/${jobId}`),
      () => mockStore.getApplicationsByJob(jobId)
    ),

  getByInternship: (internshipId) =>
    callWithFallback(
      () => api.get(`/applications/internship/${internshipId}`),
      () => mockStore.getApplicationsByInternship(internshipId)
    ),

  getAll: () =>
    callWithFallback(
      () => api.get('/applications'),
      () => mockStore.getAllApplications()
    ),

  updateStatus: (id, status) =>
    callWithFallback(
      () => api.put(`/applications/${id}/status`, { status }),
      () => mockStore.updateApplicationStatus(id, status)
    ),
};

// Admin APIs
export const adminApi = {
  login: (credentials) =>
    callWithFallback(
      () => api.post('/admin/login', credentials),
      () => mockStore.loginAdmin(credentials.username, credentials.password)
    ),

  getStats: () =>
    callWithFallback(
      () => api.get('/admin/stats'),
      () => mockStore.getAdminStats()
    ),
};

export default api;
