<template>
  <div class="welcome-container container">
    <!-- Заголовок и описание -->
    <h2 class="welcome-title">Добро пожаловать в DevHorizon</h2>
    <p class="welcome-description">
      Начните свое путешествие в веб-разработке с нуля до профессионала!
    </p>

    <!-- Кнопка перехода к курсам -->
    <NuxtLink to="/course" class="btn-primary"> Изучить курсы </NuxtLink>

    <!-- Причины выбрать нас -->
    <div class="reasons-container">
      <div class="reason-card">
        <h3 class="reason-title">Практический подход</h3>
        <p class="reason-description">
          Наши курсы основаны на практических заданиях, которые помогут вам
          научиться быстро.
        </p>
      </div>
      <div class="reason-card">
        <h3 class="reason-title">Обучение с опытными наставниками</h3>
        <p class="reason-description">
          Учитесь у профессионалов, которые помогут вам разобраться в любой
          трудной теме.
        </p>
      </div>
      <div class="reason-card">
        <h3 class="reason-title">Гибкость обучения</h3>
        <p class="reason-description">
          Учитесь в удобное для вас время и в своем темпе. Мы обеспечиваем
          полную гибкость.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Дополнительная логика, если требуется
</script>

<style scoped lang="scss">
.welcome-container {
  text-align: center;
  padding: 80px 0;

  .welcome-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--color-primary);
    margin-bottom: 16px;
  }

  .welcome-description {
    font-size: 1.125rem;
    color: var(--color-text);
    margin-bottom: 24px;
  }

  .reasons-container {
    margin-top: 64px;
    display: flex;
    gap: 32px;
    padding: 0 16px;
  }

  .reason-card {
    background-color: var(--color-background);
    border: 1px solid var(--color-text);
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 6px 12px var(--color-text);
    }

    .reason-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-primary);
      margin-bottom: 12px;
    }

    .reason-description {
      color: var(--color-text);
    }
  }
}
</style>
