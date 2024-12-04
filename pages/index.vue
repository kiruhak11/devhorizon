<template>
  <NuxtLayout name="default">
    <div class="welcome-container container">
      <h2 class="welcome-title">Добро пожаловать в DevHorizon</h2>
      <p class="welcome-description">
        Начните свое путешествие в веб-разработке с нуля до профессионала!
      </p>

      <div class="subscription-container" :theme="'easy'">
        <CourseCard
          v-for="course in userStore.courses"
          :key="course.id"
          :course="course"
        />
      </div>

      <div class="auth-buttons" v-if="!userStore.user">
        <UiButton to="/login">Войти или создать аккаунт</UiButton>
      </div>

      <div class="auth-buttons" v-else>
        <UiButton to="/profile">Перейти в личный кабинет</UiButton>
        <UiButton theme="danger" @click="userStore.clearUser">Выход</UiButton>
      </div>
    </div>
    <button @click="migrateData">Мигрировать данные</button>
  </NuxtLayout>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const migrateData = async () => {
  try {
    const response = await fetch("/api/migration", {
      method: "POST",
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message || "Миграция данных успешна!");
    } else {
      alert("Ошибка миграции данных: " + (data.error || "Неизвестная ошибка"));
    }
  } catch (error) {
    console.error(error);
    alert("Ошибка при отправке запроса на сервер");
  }
};
</script>

<style scoped lang="scss">
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 80px 16px;

  .welcome-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--color-primary);
    margin-bottom: 16px;
  }

  .welcome-description {
    font-size: 1.125rem;
    color: var(--color-text);
    margin-bottom: 40px;
  }

  .subscription-container {
    display: flex;
    gap: 24px;
    margin-top: 40px;
  }

  .auth-buttons {
    margin-top: 60px;
    display: flex;
    gap: 24px;

    .auth-button {
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: bold;
      text-transform: uppercase;
      transition: background-color 0.3s ease;

      &.primary {
        background-color: var(--color-primary);
        color: white;

        &:hover {
          background-color: (var(--color-primary), 10%);
        }
      }
    }
  }
}
</style>
