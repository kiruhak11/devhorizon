<template>
  <NuxtLayout name="default">
    <div class="welcome-container container">
      <!-- Вводный баннер -->
      <div class="welcome-banner">
        <img src="/images/banner.webp" alt="DevHorizon" class="banner-image" />
        <div class="banner-content">
          <h2 class="welcome-title">Ваш путь к мастерству в разработке</h2>
          <p class="welcome-description">
            Присоединяйтесь к DevHorizon и начните создавать современные
            веб-приложения с нуля.
          </p>
          <UiButton theme="primary" to="/courses">Начать сейчас</UiButton>
        </div>
      </div>

      <!-- Почему выбирают нас -->
      <section class="why-us">
        <h2 class="section-title">Почему выбирают нас</h2>
        <div class="features">
          <div class="feature">
            <img src="/images/icon-experience.webp" alt="Опыт" />
            <h3>Для любого уровня</h3>
            <p>Курсы подходят как новичкам, так и профессионалам.</p>
          </div>
          <div class="feature">
            <img src="/images/icon-flexible.webp" alt="Гибкость" />
            <h3>Гибкий график</h3>
            <p>Учитесь в любое время и с любого устройства.</p>
          </div>
          <div class="feature">
            <img src="/images/icon-flexible.webp" alt="Сообщество" />
            <h3>Поддержка сообщества</h3>
            <p>Получайте помощь от опытных менторов и участников.</p>
          </div>
        </div>
      </section>

      <!-- Популярные курсы -->
      <section class="popular-courses">
        <h2 class="section-title">Популярные курсы</h2>
        <div class="courses">
          <CourseCard
            v-for="course in userStore.courses"
            :key="course.id"
            :course="course"
          />
        </div>
        <UiButton theme="primary" to="/courses">Смотреть все курсы</UiButton>
      </section>

      <!-- Отзывы студентов -->
      <section class="reviews">
        <h2 class="section-title">Что говорят наши студенты</h2>
        <div class="review-slider">
          <div class="review">
            <p class="review-text">" Я очень доволен курсами DevHorizon."</p>
            <p class="review-author">— John Doe</p>
          </div>
        </div>
      </section>

      <!-- Авторизация -->
      <div class="auth-buttons" v-if="!userStore.user">
        <UiButton :class="isMobile ? 'full' : ''" to="/login"
          >Войти или создать аккаунт</UiButton
        >
      </div>
      <div class="auth-buttons" v-else>
        <UiButton :class="isMobile ? 'full' : ''" to="/profile"
          >Перейти в личный кабинет</UiButton
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
  padding: 30px 16px;

  .welcome-banner {
    position: relative;
    .banner-image {
      width: 100%;
      border-radius: 8px;
    }
    .banner-content {
      position: absolute;
      top: 20%;
      left: 10%;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
      h2 {
        font-size: 3rem;
      }
    }
  }

  .why-us,
  .popular-courses,
  .reviews {
    margin: 40px 0;
    .section-title {
      font-size: 2rem;
      margin-bottom: 20px;
    }
    .features,
    .courses,
    .review-slider {
      display: flex;
      gap: 20px;
      justify-content: center;
    }
  }

  .auth-buttons {
    margin-top: 60px;
    display: flex;
    gap: 24px;
  }
}
</style>
