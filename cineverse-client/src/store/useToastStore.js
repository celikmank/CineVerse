import { create } from 'zustand';

let idCounter = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],
  show: (message, type = 'info', durationMs = 2500) => {
    const id = ++idCounter;
    set(state => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      const remove = get().remove;
      remove(id);
    }, durationMs);
  },
  remove: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}));