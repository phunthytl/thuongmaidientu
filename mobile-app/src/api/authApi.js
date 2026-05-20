import { api, unwrap } from './client';

export const authApi = {
  login: (email, matKhau) => api.post('/auth/dang-nhap', { email, matKhau }).then(unwrap),
  register: (payload) => api.post('/auth/dang-ky', payload).then(unwrap),
  me: () => api.get('/auth/me').then(unwrap)
};
