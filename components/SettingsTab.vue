<template>
  <div>
    <h3 class="tab-title">Настройки профиля</h3>
    <div>
      <div class="form-group">
        <label for="name">Имя</label>
        <input v-model="name" id="name" type="text" placeholder="Ваше имя" />
      </div>
      <div class="form-group">
        <label for="lastname">Фамилия</label>
        <input
          v-model="lastname"
          id="lastname"
          type="text"
          placeholder="Ваш lastname"
        />
      </div>
      <div class="btns">
        <UiButton @click="updateProfile">Сохранить изменения</UiButton>
        <UiButton theme="danger" @click="deleteAccount"
          >Удалить аккаунт</UiButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const userStore = useUserStore();
const router = useRouter();
const name = ref(userStore.user.first_name);
const lastname = ref(userStore.user.last_name);

const updateProfile = () => {
  const updatedUserData = {
    first_name: name,
    last_name: lastname,
  };
  console.log(updatedUserData);
  userStore.updateUserDataOnServer(updatedUserData);

  alert(
    "Ваши данные обнавлены успешно: " +
      userStore.user.first_name +
      " " +
      userStore.user.last_name
  );
};

const deleteAccount = () => {
  userStore.clearUser();
  router.push("/");
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
