import axios from 'axios';

// Base API instance
export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to attach JWT
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Response interceptor for automatic refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Prevent infinite loops if refresh itself fails
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/refresh-token' && originalRequest.url !== '/auth/dang-nhap') {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    const res = await axios.post('http://localhost:8080/api/auth/refresh-token', { refreshToken });
                    if (res.data?.data?.accessToken) {
                        localStorage.setItem('access_token', res.data.data.accessToken);
                        if (res.data.data.refreshToken) {
                            localStorage.setItem('refresh_token', res.data.data.refreshToken);
                        }
                        api.defaults.headers.common['Authorization'] = `Bearer ${res.data.data.accessToken}`;
                        originalRequest.headers['Authorization'] = `Bearer ${res.data.data.accessToken}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    // Refresh invalid, force logout
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        return Promise.reject(error);
    }
);
