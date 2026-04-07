'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi, usersApi, resetRefreshState } from '@/lib/api';

// ── Auth Store ──────────────────────────────────────────────────────────────
export const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  initialized: false,

  init: async () => {
    if (get().initialized) return;
    try {
      const { data } = await authApi.getMe();
      set({ user: data.user, initialized: true });
    } catch {
      set({ user: null, initialized: true });
    }
  },

  refreshUser: async () => {
    try {
      const { data } = await authApi.getMe();
      set({ user: data.user });
    } catch {}
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data } = await usersApi.login({ email, password });
      resetRefreshState();
      set({ user: data.user, loading: false });
      return { ok: true };
    } catch (e) {
      set({ loading: false });
      return { ok: false, message: e.response?.data?.message || 'Login failed' };
    }
  },

  googleLogin: async (credential) => {
    set({ loading: true });
    try {
      const { data } = await authApi.googleLogin(credential);
      resetRefreshState();
      set({ user: data.user, loading: false });
      return { ok: true };
    } catch (e) {
      set({ loading: false });
      return { ok: false, message: e.response?.data?.message || 'Google login failed' };
    }
  },

  register: async (name, email, password, phoneNumber) => {
    set({ loading: true });
    try {
      const { data } = await usersApi.register({ name, email, password, phoneNumber });
      resetRefreshState();
      // Backend now sets auth cookies and returns the user — log them in immediately
      set({ user: data.user || null, loading: false });
      return { ok: true };
    } catch (e) {
      set({ loading: false });
      return { ok: false, message: e.response?.data?.message || 'Registration failed' };
    }
  },

  logout: async () => {
    try { await authApi.logout(); } catch {}
    set({ user: null });
  },
}));

// ── Cart Store ──────────────────────────────────────────────────────────────
export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, variant, quantity = 1) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.productId === product._id && i.variantId === variant._id
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.productId === product._id && i.variantId === variant._id
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
          });
        } else {
          set({
            items: [
              ...items,
              {
                productId: product._id,
                variantId: variant._id,
                name: product.name,
                variantName: variant.title,
                price: variant.price,
                image: variant.image || product.images?.[0],
                quantity,
              },
            ],
          });
        }
      },

      removeItem: (productId, variantId) => {
        set({ items: get().items.filter((i) => !(i.productId === productId && i.variantId === variantId)) });
      },

      updateQty: (productId, variantId, quantity) => {
        if (quantity < 1) return get().removeItem(productId, variantId);
        set({
          items: get().items.map((i) =>
            i.productId === productId && i.variantId === variantId ? { ...i, quantity } : i
          ),
        });
      },

      clear: () => set({ items: [] }),
    }),
    { name: 'levelup-cart' }
  )
);
