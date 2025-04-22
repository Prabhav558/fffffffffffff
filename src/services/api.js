// src/services/api.js
import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add CSRF token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('csrf_token');
    if (token) {
      config.headers['X-CSRF-Token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('csrf_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.delete('/logout');
    return response.data;
  },
};

export const userService = {
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  getUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },
};

export const academicService = {
  getCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  getCalendar: async () => {
    const response = await api.get('/calendar');
    return response.data;
  },
  getDayOrder: async () => {
    const response = await api.get('/dayorder');
    return response.data;
  },
  getMarks: async () => {
    const response = await api.get('/marks');
    return response.data;
  },
  getAttendance: async () => {
    const response = await api.get('/attendance');
    return response.data;
  },
  getTimetable: async () => {
    const response = await api.get('/timetable');
    return response.data;
  },
};

export const classService = {
  getUpcomingClasses: async () => {
    const response = await api.get('/upcoming-classes');
    return response.data;
  },
  getTodayClasses: async () => {
    const response = await api.get('/today-classes');
    return response.data;
  },
  getTomorrowClasses: async () => {
    const response = await api.get('/tomorrow-classes');
    return response.data;
  },
  getDayAfterTomorrowClasses: async () => {
    const response = await api.get('/day-after-tomorrow-classes');
    return response.data;
  },
};

export const dashboardService = {
  getAllData: async () => {
    const response = await api.get('/all');
    return response.data;
  },
};

export default api;