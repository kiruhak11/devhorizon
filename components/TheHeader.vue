<template>
  <header class="header">
    <nav>
      <ul>
        <li><NuxtLink to="/">Главная</NuxtLink></li>
        <li><NuxtLink to="/about">О курсе</NuxtLink></li>
        <li><NuxtLink to="/account">Личный кабинет</NuxtLink></li>
      </ul>
    </nav>
    <Switcher />
  </header>
</template>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #333;
  color: white;

  nav ul {
    list-style: none;
    display: flex;
    gap: 20px;

    li a {
      color: white;
      text-decoration: none;
    }
  }
}
</style>
