import axios, { AxiosResponse } from 'axios';

// ========================
// 1. Type Definitions (Keep your existing error handling)
// ========================
export class ApiError extends Error { /* ... */ }

// ========================
// 2. API Configuration
// ========================
export const getApiBaseUrl = (): string => {
  return 'http://localhost:4000/api'
};

// ========================
// 3. Axios Instance (Critical Change)
// ========================
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // ← The ONLY line needed for cookie forwarding
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ========================
// 4. Simplified Interceptors
// ========================
apiClient.interceptors.request.use((config) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[API] Forwarding cookies automatically:', document.cookie);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response, // No cookie manipulation
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login'; // Optional redirect
    }
    throw error;
  }
);

// ========================
// 5. Export Clean API Function
// ========================
export const apiFetch = async <T = unknown>(url: string, config?: any): Promise<T> => {
  const response = await apiClient(url, config);
  return response.data;
};