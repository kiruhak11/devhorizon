<template>
  <div class="course-page">
    <h1>{{ course.title }}</h1>
    <p>{{ course.description }}</p>
    <h2>Содержание курса</h2>
    <ul>
      <li v-for="lesson in course.lessons" :key="lesson.id">
        {{ lesson.title }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const course = ref({
  title: "Основы HTML",
  description: "Подробное изучение основ HTML.",
  lessons: [
    { id: 1, title: "Введение в HTML" },
    { id: 2, title: "Работа с тегами" },
    { id: 3, title: "Структура страницы" },
  ],
});
</script>

<style scoped lang="scss">
.course-page {
  padding: 20px;

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  h2 {
    margin-top: 20px;
    font-size: 20px;
  }

  ul {
    list-style-type: none;
    padding: 0;

    li {
      margin-bottom: 10px;
    }
  }
}
</style>
