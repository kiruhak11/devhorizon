<template>
  <div class="profile-container">
    <h2 class="profile-title">Личный кабинет</h2>
    <p class="profile-description">Ваш прогресс по курсам:</p>

    <ul class="course-list">
      <li
        v-for="(course, index) in userCourses"
        :key="index"
        class="course-item"
      >
        <h3 class="course-title">{{ course.title }}</h3>
        <p class="course-progress">Прогресс: {{ course.progress }}%</p>

        <div class="progress-bar">
          <div
            class="progress-bar-fill"
            :style="{
              width: course.progress + '%',
              backgroundColor: getProgressBarColor(course.progress),
            }"
          ></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
const userCourses = [
  { title: "Основы HTML и CSS", progress: 60 },
  { title: "JavaScript для начинающих", progress: 28 },
  { title: "Введение в Vue.js", progress: 80 },
];

// Функция для определения цвета прогресс-бара
const getProgressBarColor = (progress) => {
  if (progress < 30) return "red"; // Красный
  if (progress >= 30 && progress <= 60) return "orange"; // Оранжевый
  return "green"; // Зеленый
};
</script>

<style scoped lang="scss">
.profile-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
}

.profile-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  color: var(--color-primary);
  margin-bottom: 20px;
}

.profile-description {
  font-size: 18px;
  text-align: center;
  color: var(--color-text);
  margin-bottom: 40px;
}

.course-list {
  list-style: none;
  padding: 0;
}

.course-item {
  background-color: var(--color-white);
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
}

.course-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 10px;
  color: var(--color-primary);
}

.course-progress {
  font-size: 16px;
  color: var(--color-text-light);
  margin-bottom: 15px;
}

.progress-bar {
  background-color: var(--color-bg-light);
  border-radius: 50px;
  height: 8px;
  overflow: hidden;

  border: 1px solid var(--color-border);
}

.progress-bar-fill {
  height: 100%;
  transition: width 0.3s ease-in-out;
}
</style>
