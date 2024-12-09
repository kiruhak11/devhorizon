<template>
  <header class="container header">
    <nav class="nav container">
      <NuxtLink to="/" class="logo"> DevHorizon </NuxtLink>

      <div class="nav-links">
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
        <NuxtLink to="/shop" class="nav-link" exact-active-class="active-link">
          Магазин
        </NuxtLink>
        <NuxtLink
          v-if="!userStore.user"
          to="/login"
          class="nav-link"
          exact-active-class="active-link"
        >
          Войти
        </NuxtLink>
        <NuxtLink to="/profile" class="profile" v-else>
          <IconProfile />
          <div class="profile-menu">
            <NuxtLink
              to="/profile"
              class="nav-link"
              exact-active-class="active-link"
            >
              {{ userStore.user.firstName + " " + userStore.user.lastName }}
            </NuxtLink>
            <NuxtLink
              to="/profile"
              class="nav-link__counter"
              exact-active-class="active-link"
            >
              Баланс: {{ userStore.user.coins.toLocaleString("ru-RU") }} ₽
            </NuxtLink>
          </div>
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
const userStore = useUserStore();
</script>

<style scoped lang="scss">
.header {
  background: var(--color-header-background);
  color: white;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 6px var(--color-shadow);
  padding: 24px 32px;
  border-radius: 0 0 24px 24px;
}
.profile {
  display: flex;
  align-items: center;
  margin: -12px 0px;
  gap: 8px;
  border-radius: 12px 4px;
  border: 1px solid var(--color-border);
  right: 0;
  padding: 8px;
  .profile-menu {
    top: 100%;
    display: flex;
    flex-direction: column;
  }
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

  &__counter {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    text-decoration: none;
    color: white;
    transition: color 0.3s ease;
  }
  &:hover {
    color: var(--color-active-link);
  }
}

.nav-link.active-link {
  color: var(--color-active-link);
}
</style>
