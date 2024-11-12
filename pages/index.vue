<template>
  <div class="home">
    <section class="banner">
      <h1>Добро пожаловать на DevHorizon</h1>
      <p>Ваш путь к освоению веб-разработки начинается здесь</p>
      <Button @click="goToCourse" class="cta-button">Начать обучение</Button>
    </section>

    <section class="benefits">
      <h2>Почему DevHorizon?</h2>
      <div class="benefit-cards">
        <CourseCard
          title="Практические навыки"
          description="Решайте задачи и выполняйте реальные проекты."
        />
        <CourseCard
          title="Постоянный прогресс"
          description="Отслеживайте своё обучение в личном кабинете."
        />
        <CourseCard
          title="Поддержка сообщества"
          description="Учитесь вместе с другими участниками."
        />
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
const router = useRouter();

function goToCourse() {
  router.push("/about"); // перенаправление на страницу о курсе
}
</script>

<style lang="scss" scoped>
.home {
  text-align: center;

  .banner {
    background-color: var(--background-color);
    padding: 50px 20px;

    h1 {
      font-size: 2.5rem;
      margin-bottom: 20px;
    }

    p {
      font-size: 1.2rem;
      margin-bottom: 30px;
      color: #555;
    }

    .cta-button {
      padding: 10px 20px;
      font-size: 1.2rem;
      background-color: #0070f3;
      color: white;
      border-radius: 5px;
    }
  }

  .benefits {
    margin: 40px 0;

    h2 {
      font-size: 2rem;
      margin-bottom: 20px;
    }

    .benefit-cards {
      display: flex;
      justify-content: center;
      gap: 20px;
      flex-wrap: wrap;
    }
  }
}
.line {
  display: flex;
  height: 1px;
  margin: 10px 0;
  width: 100vw;
  background-color: var(--color-text);
}
</style>
