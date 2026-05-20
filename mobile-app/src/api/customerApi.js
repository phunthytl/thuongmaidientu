import { api, unwrap } from './client';

export const customerApi = {
  addresses: (khachHangId) => api.get(`/khach-hang/${khachHangId}/dia-chi`).then(unwrap),
  createAddress: (khachHangId, payload) =>
    api.post(`/khach-hang/${khachHangId}/dia-chi`, payload).then(unwrap),
  updateAddress: (khachHangId, id, payload) =>
    api.put(`/khach-hang/${khachHangId}/dia-chi/${id}`, payload).then(unwrap),
  deleteAddress: (khachHangId, id) =>
    api.delete(`/khach-hang/${khachHangId}/dia-chi/${id}`).then(unwrap),
  warehouses: () => api.get('/kho-hang/active').then(unwrap)
};
