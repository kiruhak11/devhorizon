export const courses = ref([]);

onMounted(async () => {
  const response = await fetch("/api/courses");
  courses.value = await response.json();
});
