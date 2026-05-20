import { api, unwrap } from './client';

export const paymentApi = {
  isVnpayConfigured: () => api.get('/thanh-toan/vnpay/configured').then(unwrap),
  createVnpayPayment: (donHangId) => api.post(`/thanh-toan/vnpay/create/${donHangId}`).then(unwrap)
};
