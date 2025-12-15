import axios from 'axios';

// Ensure API URL has protocol
let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
if (apiUrl && !apiUrl.startsWith('http://') && !apiUrl.startsWith('https://')) {
  apiUrl = `https://${apiUrl}`;
}

const API_BASE_URL = apiUrl;

// Log API URL for debugging (only in browser console, not in production logs)
if (typeof window !== 'undefined') {
  console.log('API Base URL:', API_BASE_URL);
  console.log('VITE_API_URL env:', import.meta.env.VITE_API_URL);
  
  // Warn if using localhost in production
  if (API_BASE_URL.includes('localhost') && window.location.hostname !== 'localhost') {
    console.warn('⚠️ WARNING: Using localhost API URL in production! Set VITE_API_URL in Railway variables.');
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log errors for debugging
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: {
    message: string;
  };
}

// Auth API
export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  }) => {
    const response = await api.post<ApiResponse<{ owner: any; token: string }>>('/auth/register', data);
    return response.data;
  },
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<{ owner: any; token: string }>>('/auth/login', {
      email,
      password,
    });
    return response.data;
  },
  getMe: async () => {
    const response = await api.get<ApiResponse<any>>('/auth/me');
    return response.data;
  },
  updateProfile: async (data: Partial<any>) => {
    const response = await api.put<ApiResponse<any>>('/auth/profile', data);
    return response.data;
  },
};

// Customers API
export const customersApi = {
  getAll: async (params?: { isActive?: boolean; search?: string }) => {
    const response = await api.get<ApiResponse<any[]>>('/customers', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/customers/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/customers', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/customers/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/customers/${id}`);
    return response.data;
  },
};

// Buyers API
export const buyersApi = {
  getAll: async (params?: { isActive?: boolean; search?: string }) => {
    const response = await api.get<ApiResponse<any[]>>('/buyers', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/buyers/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/buyers', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/buyers/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/buyers/${id}`);
    return response.data;
  },
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/categories');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/categories/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/categories', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/categories/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/categories/${id}`);
    return response.data;
  },
  createSubCategory: async (categoryId: string, data: any) => {
    const response = await api.post<ApiResponse<any>>(`/categories/${categoryId}/subcategories`, data);
    return response.data;
  },
  updateSubCategory: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/categories/subcategories/${id}`, data);
    return response.data;
  },
};

// Products API
export const productsApi = {
  getAll: async (params?: { isActive?: boolean; search?: string }) => {
    const response = await api.get<ApiResponse<any[]>>('/products', { params });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/products/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/products', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/products/${id}`);
    return response.data;
  },
};

// Purchases API
export const purchasesApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/purchases');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/purchases/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/purchases', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/purchases/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/purchases/${id}`);
    return response.data;
  },
};

// Sales API
export const salesApi = {
  getAll: async () => {
    const response = await api.get<ApiResponse<any[]>>('/sales');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<any>>(`/sales/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post<ApiResponse<any>>('/sales', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put<ApiResponse<any>>(`/sales/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(`/sales/${id}`);
    return response.data;
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: async () => {
    const response = await api.get<ApiResponse<any>>('/dashboard/stats');
    return response.data;
  },
};

export default api;

