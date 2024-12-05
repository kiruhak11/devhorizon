import { useAsyncData, useRequestFetch, useState } from "nuxt/app";
export const useSessionState = () => useState("telegram-session", () => ({}));
export function useUserSession() {
  fetchSession();
  const session = useSessionState();
  return { session, clearSession };
}
export const clearSession = async () => {
  await $fetch("/api/telegram/session", { method: "DELETE" });
  useSessionState().value = { loggedIn: false };
};
export const fetchSession = async () => {
  const sessionState = useSessionState();
  const { data } = await useAsyncData("telegram_auth", () => useRequestFetch()("/api/telegram/session"));
  sessionState.value = data;
};
