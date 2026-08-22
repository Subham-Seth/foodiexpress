import axios from 'axios';

const api = axios.create({
  baseURL:import.meta.env.VITE_API_BASE_URL ||  '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor to dynamically attach Bearer Token
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('foodiexpress_user');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        if (parsed && parsed.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error('Failed to parse user session', err);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    
    // If token is invalid or expired
    if (error.response?.status === 401) {
      if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/checkout')) {
        // Option to prompt re-login if unauthorized on protected routes
      }
    }

    return Promise.reject(new Error(message));
  }
);

// Auth Service
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData)
};

// Food Service
export const foodAPI = {
  getAll: (params) => api.get('/foods', { params }),
  getFeatured: () => api.get('/foods/featured'),
  getById: (id) => api.get(`/foods/${id}`),
  create: (foodData) => api.post('/foods', foodData),
  update: (id, foodData) => api.put(`/foods/${id}`, foodData),
  delete: (id) => api.delete(`/foods/${id}`),
  addReview: (id, reviewData) => api.post(`/foods/${id}/reviews`, reviewData)
};

// Category Service
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`)
};

// Order Service
export const orderAPI = {
  create: (orderData) => api.post('/orders', orderData),
  getMyOrders: () => api.get('/orders/my-orders'),
  getById: (id) => api.get(`/orders/${id}`),
  pay: (id, paymentData) => api.put(`/orders/${id}/pay`, paymentData),
  getAllAdmin: (params) => api.get('/orders', { params }),
  updateStatus: (id, statusData) => api.put(`/orders/${id}/status`, statusData)
};

// Admin Service
export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: (params) => api.get('/admin/users', { params }),
  updateUserRole: (id, roleData) => api.put(`/admin/users/${id}/role`, roleData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`)
};

// Contact Service
export const contactAPI = {
  sendMessage: (data) => api.post('/contact', data),
  getAll: () => api.get('/contact'),
  markAsRead: (id) => api.put(`/contact/${id}/read`)
};

// File Upload Service
export const uploadAPI = {
  uploadImage: (formData) =>
    api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
};

export default api;
