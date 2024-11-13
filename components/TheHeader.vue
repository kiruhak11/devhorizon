<template>
  <header class="header">
    <nav class="nav container">
      <NuxtLink to="/" class="logo"> DevHorizon </NuxtLink>

      <div class="nav-links">
        <NuxtLink to="/" class="nav-link" exact-active-class="active-link">
          Главная
        </NuxtLink>
        <NuxtLink
          to="/profile"
          class="nav-link"
          exact-active-class="active-link"
        >
          Профиль
        </NuxtLink>
        <NuxtLink
          to="/course"
          class="nav-link"
          exact-active-class="active-link"
        >
          Курсы
        </NuxtLink>
        <NuxtLink to="/login" class="nav-link" exact-active-class="active-link">
          Войти
        </NuxtLink>
        <Switcher />
      </div>
    </nav>
  </header>
</template>

<style scoped lang="scss">
.header {
  background: var(--color-header-background); /* Градиентный фон */
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
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

.nav-link {
  font-size: 16px;
  text-decoration: none;
  color: white;
  transition: color 0.3s ease;
  &:hover {
    color: #fbbf24; /* Желтый цвет при наведении */
  }
}

.nav-link.active-link {
  color: #fbbf24; /* Желтый цвет для активной ссылки */
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
