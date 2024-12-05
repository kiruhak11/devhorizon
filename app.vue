<template>
  <ClientOnly fallback-tag="div">
    <div>
      <div v-if="!isReady">
        <Loader />
      </div>
      <NuxtPage />
      <FrogModal />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import axios from "axios";

useSeoMeta({
  titleTemplate: (title) =>
    title
      ? `${title} | devHorizon`
      : "devHorizon  - Добро пожаловать в DevHorizon",
});

const isReady = ref<boolean>(false);

onMounted(async () => {
  const userStore = useUserStore();

  try {
    userStore.loadUserFromLocalStorage();
    userStore.loadCoursesFromLocalStorage();
  } catch (error) {
    console.error("Ошибка при загрузке данных пользователя:", error);
  }

  try {
    const coursesResponse = await axios.get("/api/course");

    if (Array.isArray(coursesResponse.data)) {
      userStore.setCourses(coursesResponse.data);
    } else {
      console.error(
        "Ответ от API имеет неправильный формат:",
        coursesResponse.data
      );
    }
  } catch (error) {
    console.error("Ошибка при загрузке курсов:", error);
  }

  if (!userStore.user) {
    isReady.value = true;
    return;
  }

  try {
    const response = await axios.post("/api/updateUser", {
      userId: userStore.user.id,
      userData: userStore.user,
      subscriptionData: userStore.subscription,
    });

    if (
      response.data.message &&
      response.data.message.includes("Login successful")
    ) {
      userStore.setUser(response.data.user, response.data.subscription);
      userStore.loadUserFromLocalStorage();
    } else {
      console.error(
        "Не удалось обновить данные пользователя:",
        response.data.message
      );
    }
  } catch (error) {
    console.error("Ошибка при обновлении данных пользователя:", error);
  }

  isReady.value = true;
});
</script>

<style lang="scss" src="~/assets/styles/index.scss"></style>
