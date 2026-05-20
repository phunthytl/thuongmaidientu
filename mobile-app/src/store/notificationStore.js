import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  notifications: [
    {
      id: 'welcome',
      title: 'Chào mừng đến CarShop',
      body: 'Thông báo đơn hàng, khuyến mãi và sản phẩm yêu thích sẽ hiển thị tại đây.',
      read: false
    }
  ],
  add: (notification) =>
    set((state) => ({
      notifications: [{ id: String(Date.now()), read: false, ...notification }, ...state.notifications]
    })),
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    }))
}));
