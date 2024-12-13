<template>
  <div class="card">
    <h4 class="card-title">{{ title }}</h4>
    <p class="card-description">{{ description }}</p>
    <p class="card-price">{{ price }} ₽</p>
    <UiButton class="buy-button" @click="onBuyModal">Купить</UiButton>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: number;
  title: string;
  description: string;
  price: number;
  effect: number;
  type: "subscription" | "itemlives" | "itemMana" | "item";
}>();

const userStore = useUserStore();
const router = useRouter();
const onBuyModal = () => {
  if (!userStore.user) {
    userStore.openModal(
      "Внимание",
      "Для покупки подписки войдите в систему.",
      "Войти",
      () => {
        router.push("/login");
      }
    );
    return;
  }
  if (
    props.type === "subscription" &&
    userStore.subscription.type >= props.effect
  ) {
    userStore.openModal(
      `Внимание`,
      `Ваша подписка уже включает в себя ${props.title} \nЖелаете продлить ее на месяц?`,
      "Да",
      () => {
        if (userStore.user.coins < props.price) {
          toast("У вас недостаточно монет.", "error", 3000);
          return;
        }
        userStore.subscription.type = props.effect;
        // Получаем текущую дату окончания подписки
        const currentEndDate = new Date(userStore.subscription.end);

        // Добавляем один месяц к существующей дате
        currentEndDate.setMonth(currentEndDate.getMonth() + 1);

        // Обновляем дату окончания подписки
        userStore.subscription.end = currentEndDate;

        userStore.updateUserDataOnServer(false);
      }
    );
    return;
  }
  userStore.openModal(
    `${props.title}`,
    `${props.description}\nЦена: ${props.price} \n\nВНИМАНИЕ! Данные о вашей прошлой подписке будут удалены!`,
    "Купить",
    onBuy
  );
};

const onBuy = () => {
  if (userStore.user.coins < props.price) {
    toast("У вас недостаточно монет.", "error", 3000);
    return;
  }

  userStore.user.coins -= props.price;

  switch (props.type) {
    case "subscription":
      userStore.subscription.type = props.effect;
      userStore.subscription.end = new Date(
        new Date().setMonth(new Date().getMonth() + 1)
      );
      break;
    case "itemlives":
      userStore.user.lives += props.effect;
      break;
    case "itemMana":
      userStore.user.mana += props.effect;
      break;
    case "item":
      userStore.user.lives += props.effect;
      userStore.user.mana += props.effect;
      break;
    default:
      break;
  }

  userStore.updateUserDataOnServer(false); // Обновляем данные на сервере
};
</script>

<style scoped lang="scss">
.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  font-size: 1.25rem;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.card-description {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.card-price {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.buy-button {
  padding: 8px 16px;
}
</style>
