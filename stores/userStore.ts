import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as any | null,
    subscription: null as any | null,
  }),
  actions: {
    setUser(userData: any, subscriptionData: any) {
      this.user = userData;
      this.subscription = subscriptionData;
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem(
        "subscriptionData",
        JSON.stringify(subscriptionData)
      );
    },

    loadUserFromLocalStorage() {
      const userData = localStorage.getItem("userData");
      const subscriptionData = localStorage.getItem("subscriptionData");

      try {
        if (userData) {
          this.user = JSON.parse(userData);
          console.log("User data loaded:", this.user);
        } else {
          console.warn("No user data found in localStorage");
        }

        if (subscriptionData) {
          this.subscription = JSON.parse(subscriptionData);
          console.log("Subscription data loaded:", this.subscription);
        } else {
          console.warn("No subscription data found in localStorage");
        }
      } catch (error) {
        console.error("Ошибка при разборе данных из localStorage:", error);
      }
    },
    clearUser() {
      this.user = null;
      this.subscription = null;
      localStorage.removeItem("subscriptionData");
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
            subscriptionData: this.subscription,
          });

          // Обрабатываем ответ от сервера
          if (response?.data?.error) {
            console.error(
              "Error updating user data on server",
              response.data.error
            );
          } else {
            // Обновляем данные пользователя в локальном хранилище
            this.setUser(response.data.user, response.data.subscription);
            console.log("User data updated successfully", response.data);
          }
        }
      } catch (error) {
        console.error("Error updating user data on server", error);
      }
    },
  },
});
