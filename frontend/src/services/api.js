import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://blog-app-296j.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000, // 8 second timeout to prevent hanging
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const userAPI = {
  signup: (data) => apiClient.post('/users/signup', data),
  login: (data) => apiClient.post('/users/login', data),
  getMe: () => apiClient.get('/users/me'),
  updateProfile: (data) => apiClient.put('/users/update', data),
};

export const blogAPI = {
  createBlog: (data) => apiClient.post('/blogs/create', data),
  getAllBlogs: (category, page = 1, limit = 10) => apiClient.get('/blogs/all', { params: { category, page, limit } }),
  getBlog: (id) => apiClient.get(`/blogs/${id}`),
  getUserBlogs: () => apiClient.get('/blogs/user/my-blogs'),
  updateBlog: (id, data) => apiClient.put(`/blogs/${id}`, data),
  deleteBlog: (id) => apiClient.delete(`/blogs/${id}`),
};

export default apiClient;
