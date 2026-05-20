import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  (Platform.OS === 'web' ? 'http://localhost:8080/api' : 'http://10.0.2.2:8080/api');

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshCall = originalRequest?.url === '/auth/refresh-token';

    if (error.response?.status === 401 && !originalRequest?._retry && !isRefreshCall) {
      originalRequest._retry = true;
      const refreshToken = await AsyncStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken
          });
          const tokens = data?.data;
          if (tokens?.accessToken) {
            await AsyncStorage.setItem('access_token', tokens.accessToken);
            if (tokens.refreshToken) {
              await AsyncStorage.setItem('refresh_token', tokens.refreshToken);
            }
            originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export const unwrap = (response) => response.data?.data ?? response.data;
