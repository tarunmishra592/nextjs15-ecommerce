import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiErrorResponse } from "@/types";


export const getApiBaseUrl = () => {
  // For server-side rendering (including Vercel preview/deployment)
  if (typeof window === 'undefined' || process.env.VERCEL_ENV === 'production') {
    return process.env.API_URL || 'http://localhost:4000/api';
  }
  
  // Browser/client
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
};

class ApiError extends Error {
  status: number;
  data: ApiErrorResponse;
  url: string;

  constructor(message: string, status: number, url: string, data: ApiErrorResponse = {}) {
    super(message);
    this.status = status;
    this.url = url;
    this.data = data;
    this.name = 'ApiError';
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toString() {
    return `${this.name}: ${this.message} (Status: ${this.status}, URL: ${this.url})`;
  }
}

// Create axios instance with base config
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use((config: any) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
      window.location.reload();
      throw new ApiError('Session expired. Redirecting...', 401, error.config.url || '');
    }
    
    const url = error.config?.url || '';
    const status = error.response?.status || 0;
    const responseData = error.response?.data || {};
    
    const errorMessage = typeof responseData === 'object' && responseData !== null
      ? (responseData as ApiErrorResponse).message || 
        (responseData as ApiErrorResponse).error || 
        `Request failed with status ${status}`
      : `Request failed with status ${status}`;
    
    throw new ApiError(
      errorMessage,
      status,
      url,
      typeof responseData === 'object' ? (responseData as ApiErrorResponse) : {}
    );
  }
);

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
    const errorMessage = error instanceof Error ? error.message : 'Unknown network error';
    throw new ApiError(errorMessage, 0, url);
  }
}