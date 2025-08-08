// lib/server-api.ts
import axios from 'axios';
import { cookies } from 'next/headers';

export const serverApi = axios.create({
  baseURL: process.env.API_INTERNAL_URL || 'http://localhost:4000/api',
  timeout: 10000
});

serverApi.interceptors.request.use((config) => {
  const token = cookies().get('token')?.value;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const serverFetch = async <T = unknown>(url: string, config?: any): Promise<T> => {
  const response = await serverApi(url, config);
  return response.data;
};