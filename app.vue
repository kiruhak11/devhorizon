// Компонент
<template>
  <FrogModal />
  <NuxtPage />
</template>

<style lang="scss" src="~/assets/styles/index.scss"></style>

<script setup lang="ts">
import axios from "axios";
import { useUserStore } from "~/stores/userStore"; // Путь к вашему хранилищу

onMounted(async () => {
  const userStore = useUserStore(); // Получаем доступ к хранилищу пользователя
  userStore.loadUserFromLocalStorage(); // Загружаем данные пользователя из localStorage

  // Если нет данных о пользователе, выходим
  if (!userStore.user) return;

  try {
    const telegramId = userStore.user.telegramId; // Получаем telegram_id пользователя
    console.log(
      "Попытка обновления данных пользователя для telegramId:",
      telegramId
    );
    console.log(userStore);
    // Отправляем запрос на сервер для обновления данных
    const response = await axios.post("/api/updateUser", {
      userId: userStore.user.id,
      userData: userStore.user,
      subscriptionData: userStore.subscription,
    });

    // Логирование ответа для проверки
    console.log("Ответ от сервера:", response.data);

    // Проверяем, успешен ли ответ
    if (
      response.data.message &&
      response.data.message.includes("Login successful")
    ) {
      // Обновляем данные пользователя в хранилище
      userStore.setUser(
        response.data.user,
        response.data.subscription,
        response.data.courses
      );
      userStore.loadUserFromLocalStorage(); // Загружаем обновленные данные из localStorage

      console.log("Данные пользователя успешно обновлены:", response.data);
      console.log(
        "Данные пользователя в хранилище:",
        response.data.subscription
      );
    } else {
      console.log(
        "Не удалось обновить данные пользователя:",
        response.data.message
      );
    }
  } catch (error) {
    console.error("Ошибка при обновлении данных пользователя:", error);
  }
});
</script>
