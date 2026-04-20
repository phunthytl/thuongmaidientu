import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product, quantity = 1) => {
        const { items } = get();
        const existingItem = items.find(item => item.id === product.id && item.type === product.type);
        
        if (existingItem) {
          set({
            items: items.map(item => 
              item.id === product.id && item.type === product.type
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({ items: [...items, { ...product, quantity }] });
        }
      },
      
      removeFromCart: (id, type) => {
        set({
          items: get().items.filter(item => !(item.id === id && item.type === type))
        });
      },
      
      updateQuantity: (id, type, quantity) => {
        set({
          items: get().items.map(item => 
            item.id === id && item.type === type ? { ...item, quantity } : item
          )
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.gia * item.quantity), 0);
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);
