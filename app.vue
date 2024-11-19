<template>
  <NuxtPage />
</template>

<style lang="scss" src="~/assets/styles/index.scss"></style>
<script setup lang="ts">
import axios from "axios";

onMounted(async () => {
  const userStore = useUserStore();
  userStore.loadUserFromLocalStorage();
  if (!userStore.user) return;
  try {
    console.log("Попытка обновления данных пользователя");
    console.log(userStore.user.telegram_id);
    const response = await axios.post("/api/login", {
      telegramId: userStore.user?.telegram_id,
      type: "reload",
    });
    if (response.data.message.includes("Login successful")) {
      userStore.setUser(Object.fromEntries(Object.values(response.data.user)));
      userStore.loadUserFromLocalStorage();
      console.log("Данные пользователя обновлены");
    } else {
      console.log("Данные пользователя не обновлены");
    }
  } catch (er) {
    console.log("Данные пользователя не обновлены", er);
  }
});
</script>
