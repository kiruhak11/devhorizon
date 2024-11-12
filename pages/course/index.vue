<template>
  <div class="container">
    <div class="courses-page">
      <h1>Курсы по веб-разработке</h1>
      <ul>
        <li v-for="course in courses" :key="course.id" class="card course-card">
          <NuxtLink :to="`/course/${course.id}`" class="course-title">
            {{ course.title }}
            <p>{{ course.description }}</p>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
const courses = [
  {
    id: 1,
    title: "Основы HTML",
    description: "Изучение основ HTML и структуры веб-страниц.",
  },
  {
    id: 2,
    title: "CSS и стилизация",
    description: "Работа со стилями и оформлением.",
  },
  {
    id: 3,
    title: "JavaScript для начинающих",
    description: "Основы JavaScript для интерактивности.",
  },
];
</script>

<style scoped lang="scss">
.courses-page {
  h1 {
    text-align: center;
    font-size: 32px;
  }

  ul {
    list-style-type: none;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;

    .course-card {
      .course-title {
        font-weight: bold;
        color: var(--color-primary);
        font-size: 20px;
        text-decoration: none;
        p {
          font-weight: 400;
          padding: 5px 0;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
