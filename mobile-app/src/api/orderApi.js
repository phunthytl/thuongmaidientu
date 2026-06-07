import { api, unwrap } from './client';

export const orderApi = {
  create: (payload) => api.post('/don-hang', payload).then(unwrap),
  listByCustomer: (khachHangId, params = { page: 0, size: 20, sort: 'ngayTao,desc' }) =>
    api.get(`/don-hang/khach-hang/${khachHangId}`, { params }).then(unwrap),
  detail: (id) => api.get(`/don-hang/${id}`).then(unwrap)
};
