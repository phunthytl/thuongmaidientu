import { create } from 'zustand';
import { api } from '../services/api';
import { useCartStore } from './cartStore';

export const useAuthStore = create((set, get) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    login: async (email, matKhau, requiredRoleGroup) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/dang-nhap', { email, matKhau });
            const tokens = data.data;

            localStorage.setItem('access_token', tokens.accessToken);
            localStorage.setItem('refresh_token', tokens.refreshToken);
            api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;

            const userRes = await api.get('/auth/me');
            const userData = userRes.data.data;

            const vaiTro = userData.vaiTro;

            if (requiredRoleGroup === 'ADMIN_SIDE' && vaiTro === 'KHACH_HANG') {
                throw new Error('Tài khoản không có quyền truy cập trang quản lý.');
            }

            set({
                user: userData,
                isAuthenticated: true,
                isLoading: false
            });

            // Gộp giỏ hàng guest vào DB, sau đó tải giỏ hàng theo user
            const khachHangId = userData.khachHangId ?? userData.id;
            await useCartStore.getState().mergeGuestCart(khachHangId);
            await useCartStore.getState().setCurrentUser(userData.id, khachHangId);
            return userData;
        } catch (err) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            delete api.defaults.headers.common['Authorization'];

            set({
                isLoading: false,
                error: err.response?.data?.message || err.message || 'Đăng nhập thất bại'
            });
            throw err;
        }
    },

    register: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const { data } = await api.post('/auth/dang-ky', userData);
            set({ isLoading: false });
            return data;
        } catch (err) {
            set({
                isLoading: false,
                error: err.response?.data?.message || err.message || 'Đăng ký thất bại'
            });
            throw err;
        }
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, isAuthenticated: false });
        useCartStore.getState().setCurrentUser(null, null);
        window.location.href = '/login';
    },

    checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return false;

        set({ isLoading: true });
        try {
            const res = await api.get('/auth/me');
            const userData = res.data.data;
            set({ user: userData, isAuthenticated: true, isLoading: false });
            const khachHangId = userData.khachHangId ?? userData.id;
            await useCartStore.getState().setCurrentUser(userData.id, khachHangId);
            return true;
        } catch (error) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            useCartStore.getState().setCurrentUser(null, null);
            return false;
        }
    }
}));
