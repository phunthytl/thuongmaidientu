import { api, unwrap } from './client';

const pageContent = (data) => data?.content ?? data ?? [];

export const productApi = {
  featuredCars: (size = 6) =>
    api.get('/oto/trang-thai/DANG_BAN', { params: { page: 0, size, sort: 'ngayTao,desc' } }).then(unwrap),
  cars: (params = {}) => api.get('/oto/loc', { params }).then(unwrap),
  car: (id) => api.get(`/oto/${id}`).then(unwrap),
  brands: () => api.get('/oto/hang-xe').then(unwrap),
  accessories: (params = {}) => api.get('/phu-kien/loc', { params }).then(unwrap),
  accessory: (id) => api.get(`/phu-kien/${id}`).then(unwrap),
  accessoryTypes: () => api.get('/phu-kien/loai').then(unwrap),
  reviews: (type, id, params = { page: 0, size: 10, sort: 'ngayTao,desc' }) => {
    const path = type === 'OTO' ? `/danh-gia/oto/${id}` : `/danh-gia/phu-kien/${id}`;
    return api.get(path, { params }).then(unwrap);
  },
  createReview: (payload) => api.post('/danh-gia', payload).then(unwrap),
  pageContent
};
