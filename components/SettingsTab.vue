<template>
  <div>
    <h3 class="tab-title">Настройки профиля</h3>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="name">Имя</label>
        <input v-model="name" id="name" type="text" placeholder="Ваше имя" />
      </div>
      <div class="form-group">
        <label for="email">Email</label>
        <input
          v-model="email"
          id="email"
          type="email"
          placeholder="Ваш email"
        />
      </div>
      <div class="btns">
        <UiButton>Сохранить изменения</UiButton>
        <UiButton theme="danger">Удалить аккаунт</UiButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";

const name = ref("Иван Иванов");
const email = ref("ivan.ivanov@example.com");

const updateProfile = () => {
  console.log("Профиль обновлен", { name: name.value, email: email.value });
};
</script>

<style scoped lang="scss">
.tab-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 20px;
  color: var(--color-primary);
}

.form-group {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 8px;
    font-weight: bold;
    color: var(--color-text-dark);
  }

  input {
    padding: 8px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    font-size: 1rem;
    color: var(--color-text);
  }
}

.btns {
  display: flex;
  gap: 16px;
}
</style>
