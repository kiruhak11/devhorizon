import { reactive } from "vue";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration: number;
}

export const toastStore = reactive({
  toasts: [] as Toast[],
  addToast(toast: Omit<Toast, "id">) {
    const id = Date.now();
    this.toasts.push({ id, ...toast });

    // Удаляем тост через заданное время
    setTimeout(() => this.removeToast(id), toast.duration);
  },
  removeToast(id: number) {
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
  },
});
