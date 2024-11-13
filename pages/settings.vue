<template>
  <div class="profile-container">
    <h3 class="profile-title">Ваш профиль</h3>

    <p class="profile-info">
      Имя пользователя: <span class="font-medium">user123</span>
    </p>

    <button class="btn btn-primary">Изменить пароль</button>

    <button class="btn btn-danger">Удалить аккаунт</button>
  </div>
</template>

<script setup>
// Логика для кнопок, если нужно, добавим позже
</script>

<style scoped lang="scss">
.profile-container {
  max-width: 600px;
  margin: 40px auto;
  padding: 24px;
  background-color: var(--color-white);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-title {
  font-size: 1.75rem;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 16px;
}

.profile-info {
  font-size: 1.125rem;
  color: var(--color-text);
  margin-bottom: 20px;

  .font-medium {
    font-weight: 500;
  }
}

.btn {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &.btn-primary {
    background-color: var(--color-primary);
    color: white;
    border: none;

    &:hover {
      transform: translateY(-2px);
    }
  }

  &.btn-danger {
    background-color: #e53e3e;
    color: white;
    border: none;

    &:hover {
      background-color: #c53030;
      transform: translateY(-2px);
    }
  }
}
</style>
