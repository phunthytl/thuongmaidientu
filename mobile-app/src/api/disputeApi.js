import { api, unwrap } from './client';

export const disputeApi = {
  create: (payload) => api.post('/khieu-nai', payload).then(unwrap),
  listByCustomer: (khachHangId, params = { page: 0, size: 50, sort: 'ngayTao,desc' }) =>
    api.get(`/khieu-nai/khach-hang/${khachHangId}`, { params }).then(unwrap)
};
