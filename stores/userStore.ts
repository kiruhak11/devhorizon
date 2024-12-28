import { defineStore } from "pinia";
import axios from "axios";
import Modal from "~/components/MyModal.vue";
import GiftModal from "~/components/gift/index.vue";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as any | null,
    subscription: null as any | null,
    courses: null as any | null,
    progress: null as any | null,
    users: [] as any | null,
    subscriptions: [] as any | null,
  }),
  actions: {
    async fetchUsers() {
      try {
        const response = await axios.get("/api/users");
        this.users = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    async fetchSubscriptions() {
      try {
        const response = await axios.get("/api/subscriptions");
        this.subscriptions = response.data;
      } catch (error) {
        console.error(error);
      }
    },
    openGiftModal() {
      const [setModal] = useFrogModal({
        closeOnOverlayClick: false,
        closeOnEsc: false,
      });
      setModal(GiftModal, {});
    },
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

    userSubscription() {
      try {
        if (this.subscription.type == 1) {
          return "Базовая";
        } else if (this.subscription.type == 2) {
          return "Премиум";
        } else if (this.subscription.type == 3) {
          return "Эксперт";
        } else if (this.subscription.type >= 4) {
          return "Эксперт+";
        } else {
          return "Ошибка";
        }
      } catch (error) {
        console.error("Error loading user subscription:", error);
        return null;
      }
    },
    async buyCourseF(course: any) {
      if (this.user && course ? this.user.coins >= course?.price : false) {
        this.user.coins -= course ? course?.price : 0;
        this.subscription.type = course ? course?.id : 0;
        this.updateUserDataOnServer(false);
      }
    },
    setCourses(courses: any) {
      this.courses = courses;
      localStorage.setItem("coursesData", JSON.stringify(courses));
    },
    setUser(userData: any, subscriptionData: any, progressData: any) {
      this.user = userData;
      this.subscription = subscriptionData;
      this.progress = progressData;
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem(
        "subscriptionData",
        JSON.stringify(subscriptionData)
      );
      localStorage.setItem("userProgress", JSON.stringify(progressData));
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
    // Пример метода в userStore
    updateCourseProgress(courseId: number, progress: number) {
      const courseProgress = this.progress.find(
        (p: { courseId: number }) => p.courseId === courseId
      );
      if (courseProgress) {
        courseProgress.progress = progress;
      } else {
        this.progress.push({ courseId, progress });
      }
      this.updateUserDataOnServer(false); // Обновляем данные пользователя на сервере
    },

    loadUserFromLocalStorage() {
      const userData = localStorage.getItem("userData");
      const subscriptionData = localStorage.getItem("subscriptionData");
      const userProgress = localStorage.getItem("userProgress");
      try {
        // Ensure the data exists and is not undefined or null before parsing
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

        if (userProgress) {
          this.progress = JSON.parse(userProgress);
        } else {
          console.error("No progress data found in localStorage");
        }
      } catch (error) {
        console.error("Ошибка при разборе данных из localStorage:", error);
      }
    },
    clearUser() {
      this.user = null;
      this.subscription = null;
      this.progress = null;
      localStorage.removeItem("subscriptionData");
      localStorage.removeItem("userData");
      localStorage.removeItem("userProgress");
    },
    async updateUserDataOnServer(password: boolean) {
      try {
        if (this.user?.id) {
          const oldUserData = JSON.parse(
            localStorage.getItem("userData") || "{}"
          );
          const oldSubscriptionData = JSON.parse(
            localStorage.getItem("subscriptionData") || "{}"
          );
          const oldProgressData = JSON.parse(
            localStorage.getItem("userProgress") || "{}"
          );
          const response = await axios.post("/api/updateUser", {
            userId: this.user.id,
            userData: this.user,
            subscriptionData: this.subscription,
            progressData: this.progress,
            isPassword: password,
          });

          if (response?.data?.error) {
            console.error(
              "Error updating user data on server",
              response.data.error
            );
          } else {
            this.setUser(
              response.data.user,
              response.data.subscription,
              response.data.progress
            );

            const changedFields = [];

            const userFieldDescriptions: Record<string, string> = {
              username: "Имя пользователя",
              firstName: "Имя",
              lastName: "Фамилия",
              phone: "Телефон",
              coins: "Монеты",
              mana: "Мана",
              lives: "Жизни",
              gift: "Подарок",
              createdAt: "Дата создания",
            };

            for (const key in this.user) {
              if (this.user[key] !== oldUserData[key]) {
                const description = userFieldDescriptions[key] || key;

                if (key === "password") {
                  changedFields.push(`Пароль был изменён.`);
                } else if (key === "gift" || key === "createdAt") {
                  const oldDate = oldUserData[key]
                    ? new Date(oldUserData[key]).toLocaleDateString()
                    : "не задана";
                  const newDate = this.user[key]
                    ? new Date(this.user[key]).toLocaleDateString()
                    : "не задана";
                  changedFields.push(
                    `${description}: ${oldDate} → ${newDate} \n`
                  );
                } else {
                  changedFields.push(
                    `${description}: ${
                      this.user[key] - oldUserData[key] > 0
                        ? `+${this.user[key] - oldUserData[key]}`
                        : `${this.user[key] - oldUserData[key]}`
                    } \n`
                  );
                }
              }
            }

            for (const key in this.subscription) {
              if (this.subscription[key] !== oldSubscriptionData[key]) {
                if (key === "type") {
                  const oldTypeName =
                    this.userSubscription[
                      oldSubscriptionData[
                        key
                      ] as keyof typeof this.userSubscription
                    ] || this.userSubscription();
                  const newTypeName =
                    this.userSubscription[
                      this.subscription[
                        key
                      ] as keyof typeof this.userSubscription
                    ] || this.userSubscription();
                  changedFields.push(
                    `Подписка: \n"${oldTypeName}" → "${newTypeName}"`
                  );
                } else if (key === "end") {
                  const newEndDate = new Date(
                    this.subscription[key]
                  ).toLocaleDateString();
                  changedFields.push(
                    `Подписка теперь действительна до ${newEndDate}`
                  );
                } else {
                  changedFields.push(
                    `Подписка ${key}: ${this.subscription[key]}`
                  );
                }
              }
            }

            if (changedFields.length > 0) {
              changedFields.forEach((message) => {
                toast(message, "success", 3500);
              });
            }
          }
        }
      } catch (error) {
        console.error("Error updating user data on server", error);
      }
    },
  },
});
