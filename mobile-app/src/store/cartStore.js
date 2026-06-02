import { create } from 'zustand';
import { cartApi } from '../api/cartApi';
import { customerIdOf } from '../utils/format';

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  load: async (user) => {
    const khachHangId = Number(customerIdOf(user));
    if (!khachHangId || user?.vaiTro !== 'KHACH_HANG') {
      throw new Error('Bạn cần đăng nhập bằng tài khoản khách hàng để thêm giỏ hàng.');
    }
    if (!khachHangId) return;
    set({ loading: true });
    try {
      const cart = await cartApi.get(khachHangId);
      set({ cart, loading: false });
    } catch {
      set({ cart: null, loading: false });
    }
  },
  add: async (user, payload) => {
    const khachHangId = Number(customerIdOf(user));
    if (!khachHangId || user?.vaiTro !== 'KHACH_HANG') {
      throw new Error('Bạn cần đăng nhập bằng tài khoản khách hàng để thêm giỏ hàng.');
    }
    const loaiSanPham = String(payload?.loaiSanPham || '').toUpperCase();
    const sanPhamId = Number(payload?.sanPhamId);
    if (!loaiSanPham || !Number.isFinite(sanPhamId) || sanPhamId <= 0) {
      throw new Error('Thông tin sản phẩm không hợp lệ.');
    }
    const cart = await cartApi.add({
      ...payload,
      khachHangId,
      loaiSanPham,
      sanPhamId,
      soLuong: Number(payload?.soLuong) || 1
    });
    set({ cart });
    return cart;
  },
  update: async (chiTietId, soLuong) => {
    const cart = await cartApi.update(chiTietId, soLuong);
    set({ cart });
  },
  remove: async (chiTietId) => {
    const cart = await cartApi.remove(chiTietId);
    set({ cart });
  },
  clear: async (user) => {
    const khachHangId = customerIdOf(user);
    const cart = await cartApi.clear(khachHangId);
    set({ cart });
  },
  items: () => get().cart?.chiTietGioHangs || []
}));
