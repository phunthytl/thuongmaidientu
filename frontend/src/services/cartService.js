import { api } from './api';

const BASE = '/gio-hang';

export const cartService = {
  // Lấy giỏ hàng theo khachHangId
  getCart: (khachHangId) =>
    api.get(`${BASE}/khach-hang/${khachHangId}`),

  // Thêm vào giỏ
  addItem: ({ khachHangId, loaiSanPham, sanPhamId, soLuong = 1, khoHangId }) => {
    const body = { khachHangId, loaiSanPham, soLuong, khoHangId };
    if (loaiSanPham === 'OTO')      body.otoId     = sanPhamId;
    if (loaiSanPham === 'PHU_KIEN') body.phuKienId = sanPhamId;
    if (loaiSanPham === 'DICH_VU')  body.dichVuId  = sanPhamId;
    return api.post(`${BASE}/them`, body);
  },

  // Cập nhật số lượng
  updateItem: (chiTietId, soLuong) =>
    api.put(`${BASE}/cap-nhat/${chiTietId}`, null, { params: { soLuong } }),

  // Cập nhật kho hàng
  updateItemKho: (chiTietId, khoHangId) =>
    api.put(`${BASE}/cap-nhat-kho/${chiTietId}`, null, { params: { khoHangId } }),

  // Xóa một item
  removeItem: (chiTietId) =>
    api.delete(`${BASE}/xoa/${chiTietId}`),

  // Xóa toàn bộ giỏ hàng
  clearCart: (khachHangId) =>
    api.delete(`${BASE}/xoa-het/${khachHangId}`),
};
