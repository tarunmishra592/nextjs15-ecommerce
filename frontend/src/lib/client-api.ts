'use client';

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Create base API instance
const createApiClient = (baseConfig: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...baseConfig,
  });

  return instance;
};

// 1. Protected API client (with credentials and auth handling)
export const protectedApi = createApiClient({
  withCredentials: true,
});

// Add auth interceptor for protected endpoints
protectedApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Clear cookies and redirect on 401
      document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      window.location.href = `/login?error=session_expired&redirect=${encodeURIComponent(window.location.pathname)}`;
    }
    return Promise.reject(error);
  }
);

// 2. Public API client (no credentials)
export const publicApi = createApiClient({});

// Unified fetch function
export const clientApi = async <T = any>(
  url: string,
  config?: any & { protected?: boolean }
): Promise<T> => {
  const client = config?.protected ? protectedApi : publicApi;
  const { protected: _, ...requestConfig } = config || {};

  try {
    const response = await client(url, requestConfig);
    return response.data;
  } catch (error) {
    throw error; // Error handling is done in interceptors
  }
};