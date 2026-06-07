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
  services: (params = {}) => {
    const { keyword, ...pageParams } = params;
    const path = keyword ? '/dich-vu/tim-kiem' : '/dich-vu';
    return api.get(path, { params: keyword ? { ...pageParams, keyword } : pageParams }).then(unwrap);
  },
  service: (id) => api.get(`/dich-vu/${id}`).then(unwrap),
  mediaImages: (type, id) => api.get(`/media/${type}/${id}/images`).then(unwrap),
  bookService: (payload) => api.post('/lich-hen', payload).then(unwrap),
  reviews: (type, id, params = { page: 0, size: 10, sort: 'ngayTao,desc' }) => {
    const path = type === 'OTO'
      ? `/danh-gia/oto/${id}`
      : type === 'DICH_VU'
        ? `/danh-gia/dich-vu/${id}`
        : `/danh-gia/phu-kien/${id}`;
    return api.get(path, { params }).then(unwrap);
  },
  createReview: (payload) => api.post('/danh-gia', payload).then(unwrap),
  pageContent
};
