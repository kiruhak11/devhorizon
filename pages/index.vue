<template>
  <NuxtLayout name="default">
    <div class="welcome-container container">
      <h2 class="welcome-title">Добро пожаловать в DevHorizon</h2>
      <p class="welcome-description">
        Добро пожаловать в DevHorizon — ваш путь к мастерству в веб-разработке!
        Здесь вы найдете все, что нужно для того, чтобы стать профессионалом: от
        основ программирования до создания современных веб-приложений. Мы
        предлагаем курсы, которые помогут вам развивать навыки шаг за шагом,
        независимо от вашего начального уровня.
      </p>
      <div class="subscription-container" :theme="'easy'" v-if="isMobile">
        <h2 class="subscription-title">Самый популярный курс:</h2>
        <CourseCard :key="1" :course="userStore.courses[0]" />
      </div>

      <div class="subscription-container" :theme="'easy'" v-else>
        <h2 class="subscription-title">Наши курсы:</h2>
        <div class="subscription-container__courses">
          <CourseCard
            v-for="course in userStore.courses"
            :key="course.id"
            :course="course"
          />
        </div>
      </div>

      <div class="auth-buttons" v-if="!userStore.user">
        <UiButton :class="isMobile ? 'full' : ''" to="/login"
          >Войти или создать аккаунт</UiButton
        >
      </div>

      <div class="auth-buttons" v-else>
        <UiButton :class="isMobile ? 'full' : ''" to="/profile"
          >Перейти в личный кабинет</UiButton
        >
        <UiButton
          :class="isMobile ? 'full' : ''"
          theme="danger"
          @click="userStore.clearUser"
          >Выход</UiButton
        >
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
const userStore = useUserStore();
const { isMobile } = useDevice();
</script>

<style scoped lang="scss">
.welcome-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 16px;

  .welcome-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--color-primary);
    margin-bottom: 16px;
    @media (max-width: 768px) {
      font-size: 32px;
    }
  }

  .welcome-description {
    font-size: 1.125rem;
    color: var(--color-text);
    margin-bottom: 40px;
    @media (max-width: 768px) {
      font-size: 16px;
      padding: 0 20px;
    }
  }

  .subscription-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    &__courses {
      display: flex;
      gap: 24px;
      @media (max-width: 768px) {
      }
    }
    @media (max-width: 768px) {
      gap: 16px;
      justify-content: center;
    }
  }

  .auth-buttons {
    margin-top: 60px;
    display: flex;
    justify-content: center;
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
    @media (max-width: 768px) {
      margin-top: 40px;
      flex-direction: column;
      gap: 16px;
    }
  }
}
</style>
