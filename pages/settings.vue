<template>
  <div class="container">
    <div class="settings-page">
      <h1>Настройки аккаунта</h1>
      <p>Здесь вы можете изменить данные вашего профиля и настройки.</p>
      <Switcher />
    </div>
  </div>
</template>

<style scoped lang="scss">
.settings-page {
  padding: 20px;

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  button {
    background-color: var(--color-primary);
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: var(--color-secondary);
    }
  }
}
</style>
