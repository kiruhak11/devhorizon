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
        this.updateUserDataOnServer(false);
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
        if (!userData) {
          return;
        }
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
    async updateUserDataOnServer(password: boolean) {
      try {
        if (this.user?.id) {
          const oldUserData = JSON.parse(
            localStorage.getItem("userData") || "{}"
          );
          const oldSubscriptionData = JSON.parse(
            localStorage.getItem("subscriptionData") || "{}"
          );

          const response = await axios.post("/api/updateUser", {
            userId: this.user.id,
            userData: this.user,
            subscriptionData: this.subscription,
            isPassword: password,
          });

          if (response?.data?.error) {
            console.error(
              "Error updating user data on server",
              response.data.error
            );
          } else {
            this.setUser(response.data.user, response.data.subscription);

            const changedFields = [];
            const subscriptionTypes: Record<string, string> = {
              1: "Базовая",
              2: "Премиум",
              3: "Элита",
              4: "Элита+",
            };

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
                    `${description}: ${oldUserData[key]} → ${this.user[key]} \n`
                  );
                }
              }
            }

            for (const key in this.subscription) {
              if (this.subscription[key] !== oldSubscriptionData[key]) {
                if (key === "type") {
                  const oldTypeName =
                    subscriptionTypes[
                      oldSubscriptionData[key] as keyof typeof subscriptionTypes
                    ] || "Неизвестная";
                  const newTypeName =
                    subscriptionTypes[
                      this.subscription[key] as keyof typeof subscriptionTypes
                    ] || "Неизвестная";
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
            } else {
              toast("Нет изменений для сохранения", "info", 3500);
            }
          }
        }
      } catch (error) {
        console.error("Error updating user data on server", error);
      }
    },
  },
});
