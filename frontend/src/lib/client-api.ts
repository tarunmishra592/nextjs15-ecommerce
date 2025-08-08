// lib/client-api.ts
'use client'; // Mark as client component

import axios, { AxiosResponse } from 'axios';

export const clientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
  withCredentials: true, // For automatic cookie handling
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

clientApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw error;
  }
);

export const apiFetch = async <T = unknown>(url: string, config?: any): Promise<T> => {
  const response = await clientApi(url, config);
  return response.data;
};