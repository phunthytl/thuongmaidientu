import { api, unwrap } from './client';

export const paymentApi = {
  isVnpayConfigured: () => api.get('/thanh-toan/vnpay/configured').then(unwrap),
  createVnpayPayment: (donHangId, payload = {}) =>
    api.post(`/thanh-toan/vnpay/create/${donHangId}`, payload).then(unwrap)
};
