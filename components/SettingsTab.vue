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
      <div class="form-group">
        <label for="password">Password</label>
        <input
          v-model="password"
          id="password"
          :type="passwordVisible ? 'text' : 'password'"
          :placeholder="
            passwordEmpty ? 'Создайте пароль!' : userStore.user?.password
          "
        />
      </div>
      <div class="btns">
        <UiButton @click="updateProfile">Сохранить изменения</UiButton>
        <UiButton theme="danger" @click="deleteAccount">
          Удалить аккаунт
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const name = ref<string>(userStore.user?.first_name || "");
const lastname = ref<string>(userStore.user?.last_name || "");
const password = ref<string>(userStore.user?.password || "");
const passwordVisible = ref<boolean>(false);
const passwordEmpty = ref<boolean>(false);

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};
const updateProfile = () => {
  if (userStore.user) {
    userStore.user.first_name = name.value;
    userStore.user.last_name = lastname.value;
    userStore.user.password = password.value;
    userStore.updateUserDataOnServer();
    handlePassword();
    alert(
      `Ваши данные обновлены успешно: ${userStore.user.first_name} ${userStore.user.last_name} ${userStore.user.password}`
    );
  }
};

const deleteAccount = () => {
  userStore.clearUser();
  router.push("/");
};
const handlePassword = () => {
  if (!userStore.user?.password) {
    passwordVisible.value = true;
    passwordEmpty.value = true;
  } else {
    passwordVisible.value = false;
    passwordEmpty.value = false;
  }
};
onMounted(() => {
  handlePassword();
});
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
