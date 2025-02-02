import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  type: "pizza" | "wings" | "sides" | "beverages";
  name: string;
  variant_id: string;
  quantity: number;
  customizations: Record<string, any>;
  price: number;
};

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      addItem: (item) => {
        const items = get().items;
        const existingItem = items.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            total: get().total + item.price * item.quantity,
          });
        } else {
          set({
            items: [...items, item],
            total: get().total + item.price * item.quantity,
          });
        }
      },
      removeItem: (id) => {
        const items = get().items;
        const item = items.find((i) => i.id === id);
        if (item) {
          set({
            items: items.filter((i) => i.id !== id),
            total: get().total - item.price * item.quantity,
          });
        }
      },
      updateQuantity: (id, quantity) => {
        const items = get().items;
        const item = items.find((i) => i.id === id);
        if (item) {
          const diff = quantity - item.quantity;
          set({
            items: items.map((i) => (i.id === id ? { ...i, quantity } : i)),
            total: get().total + item.price * diff,
          });
        }
      },
      clearCart: () => set({ items: [], total: 0 }),
    }),
    {
      name: "cart-storage",
    }
  )
);
