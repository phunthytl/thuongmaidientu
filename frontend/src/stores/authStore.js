import { create } from 'zustand';
import { api } from '../services/api';

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

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        delete api.defaults.headers.common['Authorization'];
        set({ user: null, isAuthenticated: false });
        window.location.href = '/login';
    },

    checkAuth: async () => {
        const token = localStorage.getItem('access_token');
        if (!token) return false;

        set({ isLoading: true });
        try {
            const res = await api.get('/auth/me');
            set({ user: res.data.data, isAuthenticated: true, isLoading: false });
            return true;
        } catch (error) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            return false;
        }
    }
}));
