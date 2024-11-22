import { defineStore } from "pinia";
import axios from "axios";
import Modal from "~/components/MyModal.vue";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as any | null,
    subscription: null as any | null,
    courses: null as any | null,
  }),
  actions: {
    openModal(
      modalTitle: string,
      modalText: string,
      modalButtonText?: string,
      onButtonClick?: () => void
    ) {
      const [setModal] = useFrogModal({
        closeOnOverlayClick: false,
        closeOnEsc: false,
      });
      setModal(Modal, {
        modalTitle: modalTitle,
        modalText: modalText,
        modalButtonText: modalButtonText,
        onButtonClick: onButtonClick || (() => {}),
      });
    },
    buyCourse(course: any) {
      try {
        if (course ? this.user?.coins >= course?.price : false) {
          this.openModal(
            "Купть курс",
            "Ваш баланс: " +
              this.user.coins +
              " монет. \n" +
              "Цена: " +
              course?.price +
              " монет." +
              "\n" +
              "Вы уверены, что хотите купить этот курс?",
            "Купить",
            () => this.buyCourseF(course)
          );
        } else {
          this.openModal(
            "Купть курс",
            "Ваш баланс: " +
              this.user.coins +
              " монет. \n" +
              "Цена: " +
              course?.price +
              " монет." +
              "\n" +
              "Недостаточно монет",
            "Закрыть"
          );
        }
      } catch (error) {
        console.error("Ошибка при покупке курса:", error);
      }
    },
    async buyCourseF(course: any) {
      if (this.user && course ? this.user.coins >= course?.price : false) {
        this.user.coins -= course ? course?.price : 0;
        this.subscription.type = course ? course?.id : 0;
        this.updateUserDataOnServer();
      }
    },
    setCourses(courses: any) {
      this.courses = courses;
      localStorage.setItem("coursesData", JSON.stringify(courses));
    },
    setUser(userData: any, subscriptionData: any) {
      this.user = userData;
      this.subscription = subscriptionData;
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem(
        "subscriptionData",
        JSON.stringify(subscriptionData)
      );
    },
    loadCoursesFromLocalStorage() {
      const coursesData = localStorage.getItem("coursesData");
      try {
        if (coursesData) {
          this.courses = JSON.parse(coursesData);
        } else {
          console.error("No courses data found in localStorage");
        }
      } catch (error) {
        console.error("Ошибка при разборе данных из localStorage:", error);
      }
    },
    loadUserFromLocalStorage() {
      const userData = localStorage.getItem("userData");
      const subscriptionData = localStorage.getItem("subscriptionData");

      try {
        if (userData) {
          this.user = JSON.parse(userData);
        } else {
          console.error("No user data found in localStorage");
        }

        if (subscriptionData) {
          this.subscription = JSON.parse(subscriptionData);
        } else {
          console.error("No subscription data found in localStorage");
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
          }
        }
      } catch (error) {
        console.error("Error updating user data on server", error);
      }
    },
  },
});
