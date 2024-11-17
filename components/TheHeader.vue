<template>
  <header class="container header">
    <nav class="nav container">
      <NuxtLink v-if="!isLoginPage" to="/" class="logo"> DevHorizon </NuxtLink>

      <div v-if="isLoginPage" class="welcome-text">
        <NuxtLink to="/"> Добро пожаловать в DevHorizon</NuxtLink>
      </div>

      <div v-else class="nav-links">
        <NuxtLink to="/" class="nav-link" exact-active-class="active-link">
          Главная
        </NuxtLink>

        <NuxtLink
          to="/course"
          class="nav-link"
          exact-active-class="active-link"
        >
          Курсы
        </NuxtLink>
        <NuxtLink
          v-if="!userStore.user"
          to="/login"
          class="nav-link"
          exact-active-class="active-link"
        >
          Войти
        </NuxtLink>
        <NuxtLink
          v-else
          to="/profile"
          class="nav-link"
          exact-active-class="active-link"
        >
          Профиль
        </NuxtLink>
        <Switcher class="switcher" />
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
// @ts-ignore
const userStore = useUserStore();
const route = useRoute();
const isLoginPage = computed(() => route.path === "/login");
</script>

<style scoped lang="scss">
.switcher {
  margin-top: 1px;
}
.header {
  background: var(--color-header-background);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 6px var(--color-shadow);
  padding: 24px 32px;
  border-radius: 0 0 24px 24px;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-links {
  display: flex;
  gap: 24px;
  align-items: center;
}

.welcome-text {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  color: white;
  flex: 1;
}

.nav-link {
  font-size: 16px;
  text-decoration: none;
  color: white;
  transition: color 0.3s ease;
  &:hover {
    color: #fbbf24;
  }
}

.nav-link.active-link {
  color: #fbbf24;
}

@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    text-align: center;
  }

  .nav-links {
    flex-direction: column;
    gap: 16px;
    width: 100%;
  }
}
</style>
