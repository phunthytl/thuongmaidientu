import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const KEY = 'favorite_products';

export const useFavoriteStore = create((set, get) => ({
  favorites: [],
  load: async () => {
    const raw = await AsyncStorage.getItem(KEY);
    set({ favorites: raw ? JSON.parse(raw) : [] });
  },
  toggle: async (product) => {
    const key = `${product.loaiSanPham}:${product.id}`;
    const exists = get().favorites.some((item) => item.key === key);
    const favorites = exists
      ? get().favorites.filter((item) => item.key !== key)
      : [{ ...product, key }, ...get().favorites];
    await AsyncStorage.setItem(KEY, JSON.stringify(favorites));
    set({ favorites });
  },
  isFavorite: (loaiSanPham, id) =>
    get().favorites.some((item) => item.key === `${loaiSanPham}:${id}`)
}));
