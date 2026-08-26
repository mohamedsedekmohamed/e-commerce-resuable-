import { create } from 'zustand';
import { userCart } from '@/services/userCart';
import { authService } from '@/services/auth';
import { UserCartItem } from '@/types/cart.interface';

interface CartState {
  items: UserCartItem[];
  total: number | string;
  cartCount: number;
  isLoading: boolean;
  fetchCart: (locale: string) => Promise<void>;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  total: 0,
  cartCount: 0,
  isLoading: false,
  fetchCart: async (locale: string) => {
    // Only fetch if user is authenticated
    if (!authService.getToken('user')) {
      set({ items: [], total: 0, cartCount: 0, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await userCart.index(locale);
      // The current user API returns { cart, total }, while some endpoints
      // wrap that payload as { data: { cart, total } }. Support both shapes.
      const payload = res.data.data ?? res.data;
      const cartData = Array.isArray(payload.cart) ? payload.cart : [];
      const total = payload.total ?? 0;
      set({ 
        items: cartData, 
        total, 
        cartCount: cartData.length, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Failed to fetch cart state', error);
      set({ isLoading: false });
    }
  },
  clearCart: () => set({ items: [], total: 0, cartCount: 0 }),
}));
