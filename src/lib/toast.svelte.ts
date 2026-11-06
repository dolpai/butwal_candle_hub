import { writable } from 'svelte/store';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

let toastId = 0;

function createToastStore() {
  const { subscribe, update } = writable<Toast[]>([]);

  function show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = ++toastId;
    update((toasts) => [...toasts, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        dismiss(id);
      }, duration);
    }
  }

  function dismiss(id: number) {
    update((toasts) => toasts.filter((t) => t.id !== id));
  }

  return {
    subscribe,
    success: (msg: string) => show(msg, 'success'),
    error: (msg: string) => show(msg, 'error'),
    info: (msg: string) => show(msg, 'info'),
    warning: (msg: string) => show(msg, 'warning'),
    dismiss
  };
}

export const toasts = createToastStore();
