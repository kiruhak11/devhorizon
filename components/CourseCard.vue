<template>
  <div class="course-card">
    <h3 class="course-title">{{ course.title }}</h3>
    <p class="course-description">{{ course.description }}</p>
    <NuxtLink :to="`/course/${course.id}`" class="course-link"
      >Подробнее</NuxtLink
    >
  </div>
</template>

<script setup>
defineProps({
  course: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.course-card {
  background-color: var(--white);
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.course-card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.course-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary);
  margin-bottom: 8px;
}

.course-description {
  font-size: 16px;
  color: var(--text-gray);
  margin-bottom: 16px;
}

.course-link {
  color: var(--secondary);
  text-decoration: none;
  font-weight: 500;
}

.course-link:hover {
  text-decoration: underline;
}
</style>
