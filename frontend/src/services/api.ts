import axios from 'axios'

// ======================================
// BASE URL
// ======================================
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ======================================
// AXIOS INSTANCE
// ======================================
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // importante se usar cookies no futuro
})

// ======================================
// REQUEST INTERCEPTOR (ENVIA TOKEN)
// ======================================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')

  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// ======================================
// RESPONSE INTERCEPTOR (TRATA 401)
// ======================================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')

      // evita loop infinito
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

// ======================================
// TYPES
// ======================================
type RequestData = Record<string, unknown>

// ======================================
// AUTH
// ======================================
export const authAPI = {
  register: (data: RequestData) => api.post('/auth/register', data),

  login: (data: RequestData) => api.post('/auth/login', data),

  getMe: () => api.get('/auth/me'),

  logout: () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('user')
  },

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  validateResetToken: (token: string) =>
    api.get('/auth/validate-reset-token', { params: { token } }),

  resetPassword: (data: { token: string; newPassword: string }) =>
    api.post('/auth/reset-password', data),
}

// ======================================
// PROJECTS
// ======================================
export const projectsAPI = {
  getAll: (params: RequestData = {}) => api.get('/projects', { params }),

  getById: (id: string) => api.get(`/projects/${id}`),

  create: (data: RequestData) => api.post('/projects', data),

  update: (id: string, data: RequestData) => api.put(`/projects/${id}`, data),

  delete: (id: string) => api.delete(`/projects/${id}`),
}

// ======================================
// STUDY
// ======================================
export const studyAPI = {
  getAll: (params: RequestData = {}) => api.get('/study', { params }),

  getById: (id: string) => api.get(`/study/${id}`),

  create: (data: RequestData) => api.post('/study', data),

  update: (id: string, data: RequestData) => api.put(`/study/${id}`, data),

  delete: (id: string) => api.delete(`/study/${id}`),
}

// ======================================
// STUDY TASKS
// ======================================
export const studyTasksAPI = {
  getAll: () => api.get('/study/tasks'),

  create: (data: RequestData) => api.post('/study/tasks', data),

  complete: (id: string) => api.patch(`/study/tasks/${id}/complete`),

  toggle: (id: string) => api.patch(`/study/tasks/${id}/toggle`),

  delete: (id: string) => api.delete(`/study/tasks/${id}`),
}

// ======================================
// PROBLEMS
// ======================================
export const problemsAPI = {
  getAll: (params: RequestData = {}) => api.get('/problems', { params }),

  getById: (id: string) => api.get(`/problems/${id}`),

  create: (data: RequestData) => api.post('/problems', data),

  update: (id: string, data: RequestData) => api.put(`/problems/${id}`, data),

  delete: (id: string) => api.delete(`/problems/${id}`),
}

// ======================================
// DASHBOARD
// ======================================
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),

  getAnalytics: (period: string = 'week') =>
    api.get(`/dashboard/analytics?period=${period}`),
}

// ======================================
// USER
// ======================================
export const userAPI = {
  getProfile: () => api.get('/user/profile'),

  updateProfile: (data: RequestData) => api.put('/user/profile', data),
}

export default api
