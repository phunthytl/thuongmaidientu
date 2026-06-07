import { create } from 'zustand';
import { cartService } from '../services/cartService';

// ─── Guest cart helpers ────────────────────────────────────────────────────────
const GUEST_KEY = 'cart_storage_guest';

const loadGuestCart = () => {
  try {
    const data = localStorage.getItem(GUEST_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveGuestCart = (items) => {
  if (!items.length) {
    localStorage.removeItem(GUEST_KEY);
    return;
  }
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
};

const normalizeKhoHangId = (value) => value || null;

const sameCartLine = (item, id, type, khoHangId) =>
  item.id === id &&
  item.type === type &&
  normalizeKhoHangId(item.khoHangId) === normalizeKhoHangId(khoHangId);

const findCartLine = (items, { chiTietId, id, type, khoHangId }) => {
  if (chiTietId) {
    return items.find((item) => item.chiTietId === chiTietId);
  }
  return items.find((item) => sameCartLine(item, id, type, khoHangId));
};

// ─── Map API response → store item shape ──────────────────────────────────────
const mapApiItem = (ct) => ({
  // Dùng chiTietId làm key để gọi API cập nhật/xoá
  chiTietId: ct.id,
  id:        ct.sanPhamId,
  type:      ct.loaiSanPham,   // 'OTO' | 'PHU_KIEN' | 'DICH_VU'
  name:      ct.tenSanPham,
  hinhAnh:   ct.hinhAnh || '',
  gia:       parseFloat(ct.donGia),
  quantity:  ct.soLuong,
  khoHangId: ct.khoHangId || null,
});

// ─── Store ────────────────────────────────────────────────────────────────────
export const useCartStore = create((set, get) => ({
  items:           loadGuestCart(),
  currentUserId:   null,
  khachHangId:     null,   // id bảng khach_hang (khác với user.id)
  isLoadingCart:   false,

  // ── Khởi tạo user (gọi khi login / checkAuth) ─────────────────────────────
  setCurrentUser: async (userId, khachHangId) => {
    if (get().currentUserId === userId) return;

    if (!userId) {
      // Đăng xuất → dùng guest cart
      set({ currentUserId: null, khachHangId: null, items: loadGuestCart() });
      return;
    }

    set({ currentUserId: userId, khachHangId, isLoadingCart: true });
    try {
      const res = await cartService.getCart(khachHangId);
      const apiItems = res.data?.data?.chiTietGioHangs ?? [];
      set({ items: apiItems.map(mapApiItem), isLoadingCart: false });
    } catch {
      set({ items: [], isLoadingCart: false });
    }
  },

  // ── Fetch lại giỏ từ DB ───────────────────────────────────────────────────
  fetchCart: async () => {
    const { khachHangId } = get();
    if (!khachHangId) return;
    const res = await cartService.getCart(khachHangId);
    const apiItems = res.data?.data?.chiTietGioHangs ?? [];
    set({ items: apiItems.map(mapApiItem) });
  },

  // ── Thêm vào giỏ ─────────────────────────────────────────────────────────
  addToCart: async (product, quantity = 1) => {
    const { khachHangId, currentUserId, items } = get();

    if (!currentUserId) {
      // Guest: lưu local
      const existing = items.find(
        (i) => sameCartLine(i, product.id, product.type, product.khoHangId)
      );
      const newItems = existing
        ? items.map((i) =>
            sameCartLine(i, product.id, product.type, product.khoHangId)
              ? { ...i, quantity: i.quantity + quantity }
              : i
          )
        : [...items, { ...product, quantity }];
      set({ items: newItems });
      saveGuestCart(newItems);
      return;
    }

    // Authenticated: gọi API
    await cartService.addItem({
      khachHangId,
      loaiSanPham: product.type,
      sanPhamId:   product.id,
      soLuong:     quantity,
      khoHangId:   product.khoHangId,
    });
    await get().fetchCart();
  },

  // ── Cập nhật số lượng ────────────────────────────────────────────────────
  updateQuantity: async (id, type, quantity, chiTietId = null, khoHangId = null) => {
    const { currentUserId, items } = get();

    if (!currentUserId) {
      const newItems = items.map((i) =>
        sameCartLine(i, id, type, khoHangId) ? { ...i, quantity } : i
      );
      set({ items: newItems });
      saveGuestCart(newItems);
      return;
    }

    // Tìm chiTietId từ items
    const item = findCartLine(items, { chiTietId, id, type, khoHangId });
    if (!item?.chiTietId) return;

    await cartService.updateItem(item.chiTietId, quantity);
    await get().fetchCart();
  },

  // ── Xóa một item ─────────────────────────────────────────────────────────
  removeFromCart: async (id, type, chiTietId = null, khoHangId = null) => {
    const { currentUserId, items } = get();

    if (!currentUserId) {
      const newItems = items.filter((i) => !sameCartLine(i, id, type, khoHangId));
      set({ items: newItems });
      saveGuestCart(newItems);
      return;
    }

    const item = findCartLine(items, { chiTietId, id, type, khoHangId });
    if (!item?.chiTietId) return;

    await cartService.removeItem(item.chiTietId);
    await get().fetchCart();
  },

  // ── Xóa toàn bộ giỏ ──────────────────────────────────────────────────────
  clearCart: async () => {
    const { currentUserId, khachHangId } = get();

    if (!currentUserId) {
      set({ items: [] });
      saveGuestCart([]);
      return;
    }

    await cartService.clearCart(khachHangId);
    set({ items: [] });
  },

  // ── Gộp guest cart vào DB sau khi đăng nhập ──────────────────────────────
  mergeGuestCart: async (khachHangId) => {
    const guestItems = loadGuestCart();
    if (!guestItems.length) return;

    for (const item of guestItems) {
      try {
        await cartService.addItem({
          khachHangId,
          loaiSanPham: item.type,
          sanPhamId:   item.id,
          soLuong:     item.quantity,
          khoHangId:   item.khoHangId,
        });
      } catch {
        // Bỏ qua nếu sản phẩm không còn hợp lệ
      }
    }

    // Xóa guest cart sau khi merge
    saveGuestCart([]);
  },

  // ── Cập nhật kho cho item ────────────────────────────────────────────────
  updateItemKho: async (id, type, khoHangId, chiTietId = null, currentKhoHangId = null) => {
    const { items, currentUserId } = get();
    if (!currentUserId) {
      const newItems = items.map(i =>
        sameCartLine(i, id, type, currentKhoHangId) ? { ...i, khoHangId } : i
      );
      set({ items: newItems });
      saveGuestCart(newItems);
      return;
    }

    const item = findCartLine(items, { chiTietId, id, type, khoHangId: currentKhoHangId });
    if (!item?.chiTietId) return;

    await cartService.updateItemKho(item.chiTietId, khoHangId);
    await get().fetchCart();
  },

  // ── Helpers ──────────────────────────────────────────────────────────────
  getTotalPrice: () =>
    get().items.reduce((total, item) => total + item.gia * item.quantity, 0),

  getItemCount: () =>
    get().items.reduce((count, item) => count + item.quantity, 0),
}));
