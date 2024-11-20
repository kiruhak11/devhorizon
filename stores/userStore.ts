// Хранилище Pinia
import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as any | null,
  }),
  actions: {
    setUser(userData: any) {
      this.user = userData;
      localStorage.setItem("userData", JSON.stringify(userData));
    },
    loadUserFromLocalStorage() {
      const userData = localStorage.getItem("userData");
      if (userData) {
        try {
          this.user = JSON.parse(userData);
        } catch (error) {
          console.error(
            "Ошибка при разборе данных пользователя из localStorage:",
            error
          );
        }
      }
    },
    clearUser() {
      this.user = null;
      localStorage.removeItem("userData");
    },
    async updateUserDataOnServer() {
      try {
        if (this.user?.id) {
          console.log("Updating user data on server", this.user);

          // Отправляем запрос на серверный API для обновления данных пользователя
          const response = await axios.post("/api/updateUser", {
            userId: this.user.id,
            userData: this.user,
          });

          // Обрабатываем ответ от сервера
          if (response?.data?.error) {
            console.error(
              "Error updating user data on server",
              response.data.error
            );
          } else {
            // Обновляем данные пользователя в локальном хранилище
            this.setUser(response.data);
            console.log("User data updated successfully", response.data);
          }
        }
      } catch (error) {
        console.error("Error updating user data on server", error);
      }
    },
  },
});
