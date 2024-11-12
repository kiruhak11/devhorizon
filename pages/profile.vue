<template>
  <div class="container">
    <div class="card profile-page">
      <h1>Профиль пользователя</h1>
      <p>Добро пожаловать, {{ userName }}!</p>
      <p>Ваш прогресс: {{ progress }}%</p>
      <Button><NuxtLink to="/settings">Настройки аккаунта</NuxtLink></Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter();
const userName = ref("Ваше Имя");
const progress = ref(50);
</script>

<style scoped lang="scss">
.profile-page {
  padding: 20px;

  h1 {
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    margin-bottom: 5px;
  }

  button {
    background-color: var(--color-primary);
    color: #fff;
    border: none;
    padding: 10px 15px;
    border-radius: 5px;
    cursor: pointer;
  }
}
</style>
