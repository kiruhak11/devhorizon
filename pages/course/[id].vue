<template>
  <NuxtLayout>
    <div class="course-container">
      <h2 class="course-title">{{ course?.title }}</h2>
      <p class="course-description">{{ course?.description }}</p>
      <UiButton v-if="isCourseActiv">Начать</UiButton>
      <NuxtLink to="/course" class="back-link">Назад к курсам</NuxtLink>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { courses } from "~/data/courses";
const userStore = useUserStore();
const route = useRoute();
const courseId = Number(route.params.id);

const course = courses.find((c) => c.id === courseId);

const isCourseActiv = userStore.subscription.type == course?.id;
onMounted(() => {});
</script>

<style scoped lang="scss">
.course-container {
  margin: 0 auto;
  padding: 50px 20px;
  max-width: 800px;
  background-color: var(--color-background);
  border-radius: 8px;
}

.course-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 20px;
}

.course-description {
  font-size: 1.125rem;
  color: var(--color-text);
  margin-bottom: 30px;
}

.back-link {
  color: var(--color-primary);
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-primary-dark);
  }
}
</style>
