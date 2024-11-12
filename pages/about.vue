<template>
  <div class="container">
    <div class="about-page">
      <h1>О DevHorizon</h1>
      <p>
        DevHorizon — это онлайн-платформа для изучения веб-разработки. Мы
        предоставляем курсы, которые помогут вам освоить необходимые навыки.
      </p>
      <p>
        Наша миссия — помочь людям развиваться в области веб-технологий и
        получить необходимые знания для работы в IT-индустрии.
      </p>

      <Button class="cta-button">
        <NuxtLink to="/course">Начать обучение</NuxtLink>
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.about-page {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  Button {
    margin: 10px;
  }
  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }
}
</style>
