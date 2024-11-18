import { defineStore } from "pinia";
import axios from "axios";

import { stringify, parse } from "flatted";
export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as Record<string, any> | null,
  }),
  actions: {
    setUser(userData: Record<string, any>) {
      this.user = userData;
      localStorage.setItem("userData", JSON.stringify(userData));
    },
    loadUserFromLocalStorage() {
      const userM = localStorage.getItem("userData");
      if (userM) {
        try {
          this.user = JSON.parse(userM);
        } catch (error) {
          console.error("Failed to parse userData from localStorage:", error);
        }
      }
    },
    clearUser() {
      this.user = null;
      localStorage.removeItem("userData");
    },

    async updateUserDataOnServer() {
      try {
        if (this.user?.telegram_id) {
          // Используем flatted для безопасной сериализации
          const userToSend = useUserStore();
          const response = await axios.post("/api/update-user", {
            telegramId: this.user.telegram_id,
            updatedUserData: userToSend.user, // Отправляем безопасно сериализованные данные
          });

          if (response.status === 200) {
            if (userToSend.user) {
              userToSend.setUser(userToSend.user);
            }
            console.log("User data updated on servera", userToSend.user);
          } else {
            console.error(
              "Failed to update user data on server",
              response.data
            );
          }
        }
      } catch (error) {
        console.error("Error updating user data on server", error);
      }
    },
  },
});
