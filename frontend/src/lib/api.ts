import { ApiErrorResponse } from "@/types";

// src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';



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
    
    // Capture stack trace (excluding constructor call)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  toString() {
    return `${this.name}: ${this.message} (Status: ${this.status}, URL: ${this.url})`;
  }
}

export async function apiFetch<T = unknown>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  
  try {
    const headers:any = {
      'Content-Type': 'application/json',
      ...options?.headers,
    };
  
    // Add auth header if token exists
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const response = await fetch(url, {
      credentials: 'include',
      headers,
      ...options,
    });


    let data: unknown;
    
    try {
      data = await response.json();
    } catch {
      data = await response.text().catch(() => null);
    }

    if (response.status === 401) {
      localStorage.removeItem('token');
      // Redirect to home page and refresh
      window.location.href = '/';
      window.location.reload();
      // Throw error to stop further execution
      throw new ApiError('Session expired. Redirecting...', 401, url);
    }

    if (!response.ok) {
      const errorMessage = typeof data === 'object' && data !== null
        ? (data as ApiErrorResponse).message || 
          (data as ApiErrorResponse).error || 
          `Request failed with status ${response.status}`
        : `Request failed with status ${response.status}`;
      
      throw new ApiError(
        errorMessage,
        response.status,
        url,
        typeof data === 'object' ? (data as ApiErrorResponse) : {}
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown network error';
    throw new ApiError(errorMessage, 0, url);
  }
}