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
  getAll: (params: RequestData = {}) => api.get('/projetos', { params }),

  getById: (id: string) => api.get(`/projetos/${id}`),

  create: (data: RequestData) => api.post('/projetos', data),

  update: (id: string, data: RequestData) => api.put(`/projetos/${id}`, data),

  delete: (id: string) => api.delete(`/projetos/${id}`),
}

// ======================================
// STUDY
// ======================================
export const studyAPI = {
  getAll: (params: RequestData = {}) => api.get('/estudos', { params }),

  getById: (id: string) => api.get(`/estudos/${id}`),

  create: (data: RequestData) => api.post('/estudos', data),

  update: (id: string, data: RequestData) => api.put(`/estudos/${id}`, data),

  delete: (id: string) => api.delete(`/estudos/${id}`),
}

// ======================================
// STUDY TASKS
// ======================================
export const studyTasksAPI = {
  getAll: () => api.get('/estudos/tasks'),

  create: (data: RequestData) => api.post('/estudos/tasks', data),

  complete: (id: string) => api.patch(`/estudos/tasks/${id}/complete`),

  toggle: (id: string) => api.patch(`/estudos/tasks/${id}/toggle`),

  delete: (id: string) => api.delete(`/estudos/tasks/${id}`),
}

// ======================================
// PROBLEMS
// ======================================
export const problemsAPI = {
  getAll: (params: RequestData = {}) => api.get('/problemas', { params }),

  getById: (id: string) => api.get(`/problemas/${id}`),

  create: (data: RequestData) => api.post('/problemas', data),

  update: (id: string, data: RequestData) => api.put(`/problemas/${id}`, data),

  delete: (id: string) => api.delete(`/problemas/${id}`),
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
