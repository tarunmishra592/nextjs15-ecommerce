// src/lib/api.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// ========================
// Type Definitions
// ========================
export interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  [key: string]: any; // Allow additional properties
}

export class ApiError extends Error {
  status: number;
  data: ApiErrorResponse;
  url: string;

  constructor(
    message: string,
    status: number,
    url: string,
    data: ApiErrorResponse = {}
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
    this.data = data;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toString() {
    return `${this.name}: ${this.message} (Status: ${this.status}, URL: ${this.url})`;
  }

  toJSON() {
    return {
      error: this.name,
      message: this.message,
      status: this.status,
      url: this.url,
      ...this.data
    };
  }
}

// ========================
// API Configuration
// ========================
export const getApiBaseUrl = (): string => {
  // For production environment
  if (process.env.NODE_ENV === 'production') {
    return process.env.NEXT_PUBLIC_API_URL || 'https://nextjs15-ecommerce-rvcc.vercel.app/api';
  }
  
  // For local development
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
};

// Create axios instance with base config
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    credentials: 'include'
  },
  timeout: 10000 // 10 seconds
});

// ========================
// Request Interceptor
// ========================
apiClient.interceptors.request.use((config: AxiosRequestConfig) => {
  // Only attempt to get token on client-side
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ========================
// Response Interceptor
// ========================
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Store token if present in response
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },
  (error: any) => {
    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      throw new ApiError('Request timeout', 408, error.config.url);
    }
    
    if (!error.response) {
      throw new ApiError('Network Error', 0, error.config.url);
    }

    const { status, config, data } = error.response;
    const url = config?.url || '';
    const errorData = data || {};

    // Handle 401 Unauthorized
    if (status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      throw new ApiError(
        errorData.message || 'Session expired',
        status,
        url,
        errorData
      );
    }

    // Handle other errors
    throw new ApiError(
      errorData.message || error.message || 'Request failed',
      status,
      url,
      errorData
    );
  }
);

// ========================
// Main API Fetch Function
// ========================
export async function apiFetch<T = unknown>(
  path: string,
  options?: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await apiClient(path, options);
    return response.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    const url = `${getApiBaseUrl()}${path}`;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new ApiError(errorMessage, 0, url);
  }
}
