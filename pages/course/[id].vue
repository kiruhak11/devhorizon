<template>
  <div class="course-container">
    <h2 class="course-title">{{ course.title }}</h2>
    <p class="course-description">{{ course.description }}</p>
    <NuxtLink to="/course" class="back-link">Назад к курсам</NuxtLink>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();
const courseId = route.params.id;

const courses = [
  {
    id: "1",
    title: "Основы HTML и CSS",
    description: "Изучите базовые принципы веб-разработки.",
  },
  {
    id: "2",
    title: "JavaScript для начинающих",
    description: "Начните программировать на JavaScript с нуля.",
  },
  {
    id: "3",
    title: "Введение в Vue.js",
    description: "Постройте свой первый проект на Vue.",
  },
];

const course = courses.find((c) => c.id === courseId);
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
