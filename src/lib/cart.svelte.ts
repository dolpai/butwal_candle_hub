import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { CartItem } from '$lib/types';

const CART_KEY = 'bch_cart';

function loadCart(): CartItem[] {
  if (!browser) return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (!browser) return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

function createCartStore() {
  const { subscribe, set, update } = writable<CartItem[]>(loadCart());

  return {
    subscribe,
    add: (item: Omit<CartItem, 'quantity'>, quantity = 1) => {
      update((items) => {
        const existing = items.find((i) => i.product_id === item.product_id);
        if (existing) {
          const newQty = Math.min(existing.quantity + quantity, item.stock);
          return items.map((i) =>
            i.product_id === item.product_id ? { ...i, quantity: newQty } : i
          );
        }
        return [...items, { ...item, quantity: Math.min(quantity, item.stock) }];
      });
    },
    updateQuantity: (productId: string, quantity: number) => {
      update((items) =>
        items
          .map((i) =>
            i.product_id === productId
              ? { ...i, quantity: Math.max(0, Math.min(quantity, i.stock)) }
              : i
          )
          .filter((i) => i.quantity > 0)
      );
    },
    remove: (productId: string) => {
      update((items) => items.filter((i) => i.product_id !== productId));
    },
    clear: () => set([]),
    set: (items: CartItem[]) => {
      saveCart(items);
      set(items);
    }
  };
}

export const cart = createCartStore();

// Subscribe to save cart on every change
if (browser) {
  cart.subscribe((items) => {
    saveCart(items);
  });
}

export function getCartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const price = item.discount_price ?? item.price;
    return sum + price * item.quantity;
  }, 0);
}

export function getCartCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export function getEffectivePrice(item: CartItem): number {
  return item.discount_price ?? item.price;
}
