import { api } from './api';

const BASE = '/ton-kho';

export const inventoryService = {
  // Lấy tồn kho tại tất cả kho cho 1 xe
  getStockByOto: async (otoId) => {
    const response = await api.get(`${BASE}/oto/${otoId}`);
    return response.data;
  },

  // Tạo/cập nhật tồn kho (Admin)
  upsertStock: async (data) => {
    const response = await api.post(BASE, data);
    return response.data;
  },

  // Lấy tồn kho tại tất cả kho cho 1 phụ kiện
  getStockByPhuKien: async (phuKienId) => {
    const response = await api.get(`${BASE}/phu-kien/${phuKienId}`);
    return response.data;
  },
};
