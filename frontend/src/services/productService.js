import { api } from './api';

export const productService = {
  // OTO
  getFeaturedCars: async (page = 0, size = 4) => {
    // Lấy xe đang bán để hiển thị ở trang chủ
    const response = await api.get(`/oto/trang-thai/DANG_BAN?page=${page}&size=${size}&sort=ngayTao,desc`);
    return response.data;
  },

  getCars: async (params) => {
    const response = await api.get('/oto', { params });
    return response.data;
  },

  getCarDetail: async (id) => {
    const response = await api.get(`/oto/${id}`);
    return response.data;
  },

  getCarsByBrand: async (brand, page = 0, size = 12) => {
    const response = await api.get(`/oto/hang-xe/${brand}?page=${page}&size=${size}`);
    return response.data;
  },

  searchCars: async (keyword, page = 0, size = 12) => {
    const response = await api.get(`/oto/tim-kiem?keyword=${keyword}&page=${page}&size=${size}`);
    return response.data;
  },

  getFilteredCars: async (params) => {
    const response = await api.get('/oto/loc', { params });
    return response.data;
  },

  getBrands: async () => {
    const response = await api.get('/oto/hang-xe');
    return response.data;
  },

  getCarImages: async (id) => {
    const response = await api.get(`/media/OTO/${id}/images`);
    return response.data;
  },

  // PHU KIEN
  getAccessories: async (params) => {
    const response = await api.get('/phu-kien', { params });
    return response.data;
  },

  getFeaturedAccessories: async (page = 0, size = 4) => {
    const response = await api.get(`/phu-kien?page=${page}&size=${size}&sort=ngayTao,desc`);
    return response.data;
  },

  getAccessoryDetail: async (id) => {
    const response = await api.get(`/phu-kien/${id}`);
    return response.data;
  },

  getFilteredAccessories: async (params) => {
    const response = await api.get('/phu-kien/loc', { params });
    return response.data;
  },

  getAccessoryTypes: async () => {
    const response = await api.get('/phu-kien/loai');
    return response.data;
  }
};
