import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { authApi } from '../api/authApi';

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  bootstrapping: true,
  error: null,
  login: async (email, matKhau) => {
    set({ loading: true, error: null });
    try {
      const tokens = await authApi.login(email, matKhau);
      await AsyncStorage.multiSet([
        ['access_token', tokens.accessToken],
        ['refresh_token', tokens.refreshToken]
      ]);
      const user = await authApi.me();
      if (user?.vaiTro !== 'KHACH_HANG') {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        throw new Error('App mobile chỉ dành cho tài khoản khách hàng.');
      }
      set({ user, loading: false });
      return user;
    } catch (error) {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      set({ loading: false, error: error.response?.data?.message || error.message || 'Đăng nhập thất bại' });
      throw error;
    }
  },
  register: async (payload) => {
    set({ loading: true, error: null });
    try {
      const result = await authApi.register(payload);
      set({ loading: false });
      return result;
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || 'Đăng ký thất bại' });
      throw error;
    }
  },
  bootstrap: async () => {
    const token = await AsyncStorage.getItem('access_token');
    if (!token) {
      set({ user: null, bootstrapping: false });
      return;
    }
    try {
      const user = await authApi.me();
      if (user?.vaiTro !== 'KHACH_HANG') {
        await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
        set({ user: null, bootstrapping: false });
        return;
      }
      set({ user, bootstrapping: false });
    } catch {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      set({ user: null, bootstrapping: false });
    }
  },
  logout: async () => {
    await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
    set({ user: null });
  }
}));
