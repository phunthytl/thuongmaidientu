import { api, unwrap } from './client';

export const cartApi = {
  get: (khachHangId) => api.get(`/gio-hang/khach-hang/${khachHangId}`).then(unwrap),
  add: ({ khachHangId, loaiSanPham, sanPhamId, soLuong = 1, khoHangId }) => {
    const body = { khachHangId, loaiSanPham, soLuong, khoHangId };
    if (loaiSanPham === 'OTO') body.otoId = sanPhamId;
    if (loaiSanPham === 'PHU_KIEN') body.phuKienId = sanPhamId;
    return api.post('/gio-hang/them', body).then(unwrap);
  },
  update: (chiTietId, soLuong) =>
    api.put(`/gio-hang/cap-nhat/${chiTietId}`, null, { params: { soLuong } }).then(unwrap),
  remove: (chiTietId) => api.delete(`/gio-hang/xoa/${chiTietId}`).then(unwrap),
  clear: (khachHangId) => api.delete(`/gio-hang/xoa-het/${khachHangId}`).then(unwrap)
};
