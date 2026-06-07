import { api, unwrap } from './client';

export const cartApi = {
  get: (khachHangId) => api.get(`/gio-hang/khach-hang/${khachHangId}`).then(unwrap),
  add: ({ khachHangId, loaiSanPham, sanPhamId, soLuong = 1, khoHangId }) => {
    const productType = String(loaiSanPham || '').toUpperCase();
    const productId = Number(sanPhamId);
    const body = {
      khachHangId: Number(khachHangId),
      loaiSanPham: productType,
      soLuong: Number(soLuong) || 1
    };

    if (productType === 'OTO') body.otoId = productId;
    if (productType === 'PHU_KIEN') body.phuKienId = productId;
    if (productType === 'DICH_VU') body.dichVuId = productId;
    if (khoHangId !== undefined && khoHangId !== null) body.khoHangId = Number(khoHangId);
    return api.post('/gio-hang/them', body).then(unwrap);
  },
  update: (chiTietId, soLuong) =>
    api.put(`/gio-hang/cap-nhat/${chiTietId}`, null, { params: { soLuong } }).then(unwrap),
  remove: (chiTietId) => api.delete(`/gio-hang/xoa/${chiTietId}`).then(unwrap),
  clear: (khachHangId) => api.delete(`/gio-hang/xoa-het/${khachHangId}`).then(unwrap)
};
