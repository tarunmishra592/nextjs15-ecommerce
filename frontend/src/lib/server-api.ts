import axios from 'axios';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const serverApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
  timeout: 10000,
});

// Request interceptor for server-side token injection
serverApi.interceptors.request.use(async(config) => {
  const cookieData = await cookies();
  const token = cookieData.get('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for 401 handling
serverApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear cookies before redirect
      const request = error.config;
      request.headers['set-cookie'] = [
        'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT'
      ];
      redirect(`/login?error=session_expired&redirect=${encodeURIComponent(request.url)}`);
    }
    return Promise.reject(error);
  }
);

// Utility function for server components
export const serverFetch = async <T = any>(url: string, config?: any): Promise<T> => {
  try {
    const response = await serverApi(url, config);
    return response.data;
  } catch (error) {
    // Errors (including 401) are handled by the interceptor
    throw error;
  }
};