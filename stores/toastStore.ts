import { reactive } from "vue";

export interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration: number;
  isClosing: boolean; // Добавляем свойство для отслеживания статуса закрытия
}

export const toastStore = reactive({
  toasts: [] as Toast[],

  addToast(toast: Omit<Toast, "id" | "isClosing">) {
    const id = Date.now();
    this.toasts.push({ id, ...toast, isClosing: false });

    // Удаляем тост через заданное время, если он не был закрыт
    setTimeout(() => this.removeToast(id), toast.duration + 500); // Увеличиваем время на анимацию
  },

  removeToast(id: number) {
    // Удаляем тост
    this.toasts = this.toasts.filter((toast) => toast.id !== id);
  },

  // Обновляем статус тоста на закрывающийся
  updateToastStatus(id: number, isClosing: boolean) {
    const toast = this.toasts.find((t) => t.id === id);
    if (toast) {
      toast.isClosing = isClosing;
    }
  },
});
