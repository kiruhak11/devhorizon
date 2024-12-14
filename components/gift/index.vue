<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <header class="modal-header">
        <div class="modal-title-container">
          <h2 class="modal-title">Рулетка</h2>
          <div class="question-mark" @click="showInfo = !showInfo">?</div>
        </div>

        <button class="modal-close" @click="closeModal">×</button>
      </header>

      <div class="modal-body">
        <div class="roulette-container">
          <div class="roulette" :style="rouletteStyle">
            <div
              class="roulette-item"
              v-for="(component, index) in randomComponents"
              :key="index"
            >
              <component :is="component" />
            </div>
          </div>
        </div>
        <div v-if="showInfo" class="info-section">
          <h4 class="info-title">Информация о компонентах</h4>
          <ul class="info-list">
            <li
              v-for="(component, index) in components"
              :key="index"
              class="info-item"
            >
              <div class="info-header">
                <strong>{{ getComponentName(component) }}</strong>
                <span class="info-probability"
                  >Шанс: {{ (probabilities[index] * 100).toFixed(1) }}%</span
                >
              </div>
              <div class="info-details">
                <span v-if="component === ComponentA"
                  >+10 монет, +3 жизни, +30 маны</span
                >
                <span v-if="component === ComponentB"
                  >+20 монет, +5 жизни, +50 маны</span
                >
                <span v-if="component === ComponentC"
                  >+30 монет, +7 жизни, +70 маны</span
                >
                <span v-if="component === ComponentD"
                  >+40 монет, +9 жизни, +90 маны</span
                >
                <span v-if="component === ComponentE"
                  >Подписка элита на 1 месяц или увеличение текущей подписки на
                  1 месяц</span
                >
              </div>
            </li>
          </ul>
        </div>
      </div>

      <footer class="modal-footer">
        <div v-if="!isSpinning && resultVisible" class="result">
          <h3>{{ selectedComponent }}</h3>
        </div>
        <UiButton v-if="hasWon" class="full" @click="closeModal"
          >Выйти</UiButton
        >
        <UiButton
          v-if="!isSpinning && !resultVisible"
          class="full"
          @click="spinRoulette"
        >
          Вращать
        </UiButton>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  type ComponentOptionsMixin,
  type ComponentProvideOptions,
  type DefineComponent,
  type PublicProps,
} from "vue";

// @ts-ignore
import ComponentA from "@/components/gift/ComponentA.vue";
import ComponentB from "@/components/gift/ComponentB.vue";
import ComponentC from "@/components/gift/ComponentC.vue";
import ComponentD from "@/components/gift/ComponentD.vue";
import ComponentE from "@/components/gift/ComponentE.vue";

const components = [
  markRaw(ComponentA),
  markRaw(ComponentB),
  markRaw(ComponentC),
  markRaw(ComponentD),
  markRaw(ComponentE),
];

// Вероятности для каждого компонента
const probabilities = [0.5, 0.3, 0.15, 0.04, 0.01];

const spinDuration = 2000;
const spinRounds = 10;

const roulettePosition = ref(0);
const isSpinning = ref(false);
const selectedIndex = ref(0);
const resultVisible = ref(false);
const end = ref(false);
const randomComponents = ref<Component[]>([]);

const generateRandomComponents = () => {
  const randomList = [];
  for (let i = 0; i < 100; i++) {
    const randomIndex = getRandomIndex();
    randomList.push(components[randomIndex]);
  }
  randomComponents.value = randomList;
};

const closeModal = () => {
  const [, close] = useFrogModal();
  close();
};

const getRandomIndex = () => {
  const random = Math.random();
  let accumulatedProbability = 0;

  for (let i = 0; i < probabilities.length; i++) {
    accumulatedProbability += probabilities[i];
    if (random < accumulatedProbability) {
      return i;
    }
  }

  return probabilities.length - 1;
};

const spinRoulette = () => {
  if (isSpinning.value) return;

  isSpinning.value = true;
  resultVisible.value = false;

  generateRandomComponents();

  const randomStop = getRandomIndex();
  const finalPosition = randomStop + components.length * spinRounds;

  roulettePosition.value = finalPosition * -100;

  setTimeout(() => {
    isSpinning.value = false;

    selectedIndex.value = randomStop;

    setTimeout(() => {
      resultVisible.value = true;
    }, 100);
  }, spinDuration);
};

const rouletteStyle = computed(() => ({
  transform: `translateY(${roulettePosition.value}px)`,
  transition: isSpinning.value
    ? `${spinDuration}ms cubic-bezier(0.2, 0.8, 0.4, 1)`
    : "none",
}));

const hasWon = ref(false);
const showInfo = ref(false); // Флаг для отображения информации

let componentName = "";
const selectedComponent = computed(() => {
  if (!resultVisible.value) {
    return "";
  }
  const finalIndex =
    (roulettePosition.value / -100) % randomComponents.value.length;

  const selected = randomComponents.value[Math.floor(finalIndex)];
  const userStore = useUserStore();

  if (hasWon.value) {
    return componentName;
  }

  switch (selected) {
    case ComponentA:
      componentName = "Компонент A";
      userStore.user.coins += 10;
      userStore.user.lives += 3;
      userStore.user.mana += 30;
      break;
    case ComponentB:
      componentName = "Компонент B";
      userStore.user.coins += 20;
      userStore.user.lives += 5;
      userStore.user.mana += 50;
      break;
    case ComponentC:
      componentName = "Компонент C";
      userStore.user.coins += 30;
      userStore.user.lives += 7;
      userStore.user.mana += 70;
      break;
    case ComponentD:
      componentName = "Компонент D";
      userStore.user.coins += 40;
      userStore.user.lives += 9;
      userStore.user.mana += 90;
      break;
    case ComponentE:
      componentName = "Компонент E";
      if (userStore.subscription.type <= 2) {
        userStore.subscription.type = 2;
        userStore.subscription.end = new Date(
          new Date().setMonth(new Date().getMonth() + 1)
        );
      } else {
        const currentEndDate = new Date(userStore.subscription.end);
        currentEndDate.setMonth(currentEndDate.getMonth() + 1);
        userStore.subscription.end = currentEndDate;
      }
      break;
    default:
      componentName = "Неизвестный компонент";
  }

  hasWon.value = true;
  userStore.user.gift = new Date(
    new Date().setUTCHours(new Date().getUTCHours() + 24)
  );
  userStore.updateUserDataOnServer(false);

  return componentName;
});

// Функция для получения имени компонента
const getComponentName = (
  component: DefineComponent<
    {},
    {},
    {},
    {},
    {},
    ComponentOptionsMixin,
    ComponentOptionsMixin,
    {},
    string,
    PublicProps,
    Readonly<{}> & Readonly<{}>,
    {},
    {},
    {},
    {},
    string,
    ComponentProvideOptions,
    true,
    {},
    HTMLDivElement
  >
) => {
  if (component === ComponentA) return "Компонент A";
  if (component === ComponentB) return "Компонент B";
  if (component === ComponentC) return "Компонент C";
  if (component === ComponentD) return "Компонент D";
  if (component === ComponentE) return "Компонент E";
  return "Неизвестный компонент";
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.info-toggle {
  margin-top: 20px;
  text-align: center;
}

.info-section {
  margin-top: 20px;
  font-size: 1rem;
  color: #333;
  text-align: left;
}

.info-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #444;
}

.info-list {
  list-style-type: none;
  padding: 0;
}

.info-item {
  background-color: #f7f7f7;
  margin: 10px 0;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.info-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.info-probability {
  font-size: 0.9rem;
  color: #999;
}

.info-details {
  font-size: 0.9rem;
  color: #555;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 350px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}
.modal-title-container {
  gap: 8px;
  display: flex;
  align-items: center;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-title {
  margin: 0;
}

.modal-close {
  position: relative;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
.question-mark {
  border: 1px solid #ccc;
  border-radius: 50%;
  padding: 0 5px;
  cursor: pointer;
}
.roulette-container {
  overflow: hidden;
  height: 100px;
  margin: 20px 0 0 0;
  border: 2px solid #ddd;
  border-radius: 8px;
  position: relative;
}

.roulette {
  display: flex;
  flex-direction: column;
  transition: transform 2s cubic-bezier(0.2, 0.8, 0.4, 1);
}

.roulette-item {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  border-bottom: 1px solid #ddd;
  background: #e9e9e9;
}

.result {
  margin-top: 8px;
  font-size: 1.2rem;
  color: #333;
  opacity: 0;
  transition: opacity 0.5s ease-in;
}

.result.visible {
  opacity: 1;
}

.modal-footer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.modal-button:hover {
  background: #0056b3;
}
</style>
