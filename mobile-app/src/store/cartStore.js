import { create } from 'zustand';
import { cartApi } from '../api/cartApi';
import { customerIdOf } from '../utils/format';

const emptyGuestCart = () => ({ guest: true, chiTietGioHangs: [], tongTien: 0 });

const normalizeGuestCart = (items) => ({
  guest: true,
  chiTietGioHangs: items,
  tongTien: items.reduce((sum, item) => sum + Number(item.thanhTien || 0), 0)
});

const isCustomer = (user) => Number(customerIdOf(user)) > 0 && user?.vaiTro === 'KHACH_HANG';

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,

  load: async (user) => {
    if (!isCustomer(user)) {
      set((state) => ({ cart: state.cart?.guest ? state.cart : emptyGuestCart() }));
      return;
    }

    if (get().cart?.guest && get().cart.chiTietGioHangs.length > 0) {
      return;
    }

    set({ loading: true });
    try {
      const cart = await cartApi.get(Number(customerIdOf(user)));
      set({ cart, loading: false });
    } catch {
      set({ cart: null, loading: false });
    }
  },

  add: async (user, payload) => {
    const loaiSanPham = String(payload?.loaiSanPham || '').toUpperCase();
    const sanPhamId = Number(payload?.sanPhamId);
    if (!loaiSanPham || !Number.isFinite(sanPhamId) || sanPhamId <= 0) {
      throw new Error('Thông tin sản phẩm không hợp lệ.');
    }

    if (!isCustomer(user)) {
      if (loaiSanPham !== 'PHU_KIEN') {
        throw new Error('Chỉ phụ kiện mới có thể thêm vào giỏ hàng.');
      }

      const currentItems = get().cart?.guest ? get().cart.chiTietGioHangs : [];
      const khoHangId = payload?.khoHangId ? Number(payload.khoHangId) : null;
      const id = `guest-${loaiSanPham}-${sanPhamId}-${khoHangId || 'none'}`;
      const soLuong = Number(payload?.soLuong) || 1;
      const donGia = Number(payload?.donGia ?? payload?.gia ?? 0);
      const existing = currentItems.find((item) => item.id === id);
      const nextItems = existing
        ? currentItems.map((item) => item.id === id
          ? { ...item, soLuong: item.soLuong + soLuong, thanhTien: donGia * (item.soLuong + soLuong) }
          : item)
        : [
            ...currentItems,
            {
              id,
              loaiSanPham,
              sanPhamId,
              soLuong,
              donGia,
              thanhTien: donGia * soLuong,
              khoHangId,
              tenKho: payload?.tenKho,
              tinhThanhTen: payload?.tinhThanhTen,
              diaChiChiTiet: payload?.diaChiChiTiet,
              tonKho: payload?.tonKho,
              tenSanPham: payload?.tenSanPham || payload?.tenPhuKien || 'Phụ kiện',
              hinhAnh: payload?.hinhAnh,
              hinhAnhs: payload?.hinhAnhs,
              displayImage: payload?.displayImage
            }
          ];

      const cart = normalizeGuestCart(nextItems);
      set({ cart });
      return cart;
    }

    const cart = await cartApi.add({
      ...payload,
      khachHangId: Number(customerIdOf(user)),
      loaiSanPham,
      sanPhamId,
      soLuong: Number(payload?.soLuong) || 1
    });
    set({ cart });
    return cart;
  },

  update: async (chiTietId, soLuong) => {
    if (get().cart?.guest) {
      const nextItems = get().cart.chiTietGioHangs.map((item) => item.id === chiTietId
        ? { ...item, soLuong, thanhTien: Number(item.donGia || 0) * soLuong }
        : item);
      set({ cart: normalizeGuestCart(nextItems) });
      return;
    }

    const cart = await cartApi.update(chiTietId, soLuong);
    set({ cart });
  },

  remove: async (chiTietId) => {
    if (get().cart?.guest) {
      const nextItems = get().cart.chiTietGioHangs.filter((item) => item.id !== chiTietId);
      set({ cart: normalizeGuestCart(nextItems) });
      return;
    }

    const cart = await cartApi.remove(chiTietId);
    set({ cart });
  },

  clear: async (user) => {
    if (get().cart?.guest || !isCustomer(user)) {
      set({ cart: emptyGuestCart() });
      return;
    }

    const cart = await cartApi.clear(customerIdOf(user));
    set({ cart });
  },

  items: () => get().cart?.chiTietGioHangs || []
}));
