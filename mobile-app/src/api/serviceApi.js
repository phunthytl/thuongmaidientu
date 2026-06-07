import { api, unwrap } from './client';

export const serviceApi = {
  // Danh sách gói dịch vụ (phân trang)
  list: (params = { page: 0, size: 50, sort: 'ngayTao,desc' }) =>
    api.get('/dich-vu', { params }).then(unwrap),

  detail: (id) => api.get(`/dich-vu/${id}`).then(unwrap),

  // Đặt lịch hẹn dịch vụ (POST /lich-hen với loaiLich = DICH_VU)
  book: (payload) => api.post('/lich-hen', payload).then(unwrap),

  // Lấy danh sách content từ Page
  content: (page) => page?.content ?? page ?? []
};
