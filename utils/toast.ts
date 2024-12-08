import { toastStore } from "~/stores/toastStore";

export const toast = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  duration: number
) => {
  toastStore.addToast({ message, type, duration });
};
