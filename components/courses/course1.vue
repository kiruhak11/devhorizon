<template>
  <div class="course-container">
    <h2 v-if="currentStep?.title" class="step-title">
      {{ currentStep.title }}
    </h2>

    <div
      v-if="currentStep?.type === 'info'"
      class="step-info"
      v-html="currentStep.content"
    ></div>
    <div v-else-if="currentStep?.type === 'task'" class="step-task">
      <p>{{ currentStep.task }}</p>
      <pre>{{ currentStep.code }}</pre>
      <textarea
        v-model="userAnswer"
        placeholder="Введите исправленный код"
        :class="{ success: isCorrect === true, error: isCorrect === false }"
      ></textarea>

      <UiButton class="full" @click="checkAnswer">Проверить</UiButton>
    </div>

    <div class="step-navigation">
      <UiButton
        :disabled="currentStepIndex === 0"
        @click="goToPreviousStep"
        class="nav-button left"
      >
        <
      </UiButton>

      <span class="step-id"
        >Шаг {{ currentStepIndex + 1 }} из {{ currentSteps.length }}</span
      >

      <UiButton
        :disabled="isCorrect !== true && currentStep?.type === 'task'"
        @click="goToNextStep"
        class="nav-button right"
      >
        ></UiButton
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { steps1, steps2 } from "~/data/steps";
import { ref, computed, watch } from "vue";
const userStore = useUserStore();

const lastChar = Number(window.location.href.slice(-1));
const userProgressKey = `userCourseProgress_${lastChar}`;

const currentStepIndex = ref(
  Number(localStorage.getItem(userProgressKey)) || 0
);

const currentSteps = computed(() => {
  if (lastChar === 1) {
    return steps1;
  } else if (lastChar === 2) {
    return steps2;
  } else {
    return steps1;
  }
});

const currentStep = computed(() => currentSteps.value[currentStepIndex.value]);
const isLastStep = computed(
  () => currentStepIndex.value === currentSteps.value.length - 1
);

const userAnswer = ref("");
const isCorrect = ref<boolean | null>(null);

const goToNextStep = () => {
  if (!isLastStep.value) {
    currentStepIndex.value++;
    saveProgress();
    clearAnswerAndError();
  }
};

const goToPreviousStep = () => {
  if (currentStepIndex.value > 0) {
    currentStepIndex.value--;
    saveProgress();
    clearAnswerAndError();
  }
};

const checkAnswer = () => {
  if (currentStep.value?.type === "task") {
    const normalizeAnswer = (answer: string) =>
      answer.trim().toLowerCase().replace(/['"`]/g, '"');

    const normalizedUserAnswer = userAnswer.value
      .split("\n")
      .map(normalizeAnswer);

    const normalizedCorrectAnswer = Array.isArray(
      currentStep.value.correctAnswer
    )
      ? currentStep.value.correctAnswer.map(normalizeAnswer)
      : [];

    if (
      JSON.stringify(normalizedUserAnswer) ===
      JSON.stringify(normalizedCorrectAnswer)
    ) {
      isCorrect.value = true;
    } else {
      isCorrect.value = false;
      let errorMessage = "";
      const longest = Math.max(
        normalizedUserAnswer.length,
        normalizedCorrectAnswer.length
      );

      for (let i = 0; i < longest; i++) {
        const userPart = normalizedUserAnswer[i] || "Пусто";
        const correctPart = normalizedCorrectAnswer[i] || "Пусто";

        if (userPart !== correctPart) {
          errorMessage += `\n- В строке ${
            i + 1
          }: Ваш ответ: "${userPart}", \n правильный ответ: \n- ${correctPart}`;
        }
      }

      userStore.openModal(
        "Ошибка",
        `Ваш ответ неверен. Пожалуйста, обратите внимание на следующие моменты:
            ${errorMessage.trim()}
          `
      );
    }
  }
};

const saveProgress = () => {
  localStorage.setItem(userProgressKey, String(currentStepIndex.value));
};

const clearAnswerAndError = () => {
  userAnswer.value = "";
  isCorrect.value = null;
};

watch(currentStepIndex, saveProgress);
</script>

<style scoped lang="scss">
.course-container {
  margin: auto;
  max-width: 800px;

  border-radius: 16px;
  background: var(--color-background);
  color: var(--color-text);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.step-title {
  font-size: 1.75rem;
  text-align: center;
  margin-bottom: 16px;
}

.step-info {
  font-size: 1.125rem;
  line-height: 1.6;
  margin-bottom: 16px;
}

.step-task pre {
  background: var(--color-secondary-background);
  padding: 16px;
  border-radius: 8px;
  margin: 16px 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

textarea {
  width: 100%;
  height: 100px;
  margin: 16px 0;
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: border-color 0.3s, box-shadow 0.3s;
  font-family: "Courier New", Courier, monospace;
  resize: none;

  &.success {
    border-color: var(--color-success);
    box-shadow: 0 0 8px var(--color-success);
  }

  &.error {
    border-color: var(--color-danger);
    box-shadow: 0 0 8px var(--color-danger);
  }
}

.step-navigation {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  gap: 20px;
}

.nav-button {
  font-size: 18px;
  padding: 12px 20px;
  background: var(--color-primary);
  color: white;
  border: 1px solid var(--color-primary);
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: var(--color-primary-hover);
    transform: scale(1.1);
  }

  &:disabled {
    background: var(--color-disabled);
    cursor: not-allowed;
  }
}

.step-id {
  font-size: 1.125rem;
  color: var(--color-text);
}
</style>
