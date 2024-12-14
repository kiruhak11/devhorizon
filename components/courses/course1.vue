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

      <span class="step-id">
        Шаг {{ currentStepIndex + 1 }} из {{ currentSteps.length }}
      </span>

      <UiButton
        :disabled="isCorrect !== true && currentStep?.type === 'task'"
        @click="goToNextStep"
        class="nav-button right"
      >
        >
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { steps1, steps2 } from "~/data/steps";
import { ref, computed, watch } from "vue"; // Import the API function

const userStore = useUserStore();
const lastChar = Number(window.location.href.slice(-1)); // Get the course ID from the URL
const userProgressKey = `userCourseProgress_${lastChar}`;

const currentStepIndex = ref(
  Number(localStorage.getItem(userProgressKey)) || 0
);
const currentSteps = computed(() => {
  return lastChar === 1 ? steps1 : lastChar === 2 ? steps2 : steps1;
});
const currentStep = computed(() => currentSteps.value[currentStepIndex.value]);
const isLastStep = computed(
  () => currentStepIndex.value === currentSteps.value.length - 1
);

const userAnswer = ref("");
const isCorrect = ref<boolean | null>(null);

const saveProgress = async () => {
  const progressData = {
    userId: userStore.user.id, // userStore should contain user data
    courseId: lastChar, // Course ID from the URL
    progress: currentStepIndex.value * 4, // Current step index as progress
    createdAt: new Date().toISOString(), // Current timestamp
  };

  // Find the course progress entry in the userStore.progress array
  const existingProgressIndex = userStore.progress.findIndex(
    (progress: { userId: any; courseId: number }) =>
      progress.userId === userStore.user.id && progress.courseId === lastChar
  );

  if (existingProgressIndex !== -1) {
    // If the progress entry for the course exists, update it
    userStore.progress[existingProgressIndex] = {
      ...userStore.progress[existingProgressIndex],
      ...progressData,
    };
  } else {
    // If no progress entry exists for this course, create a new entry
    userStore.progress.push(progressData);
  }

  try {
    // Send the progress to the server
    await userStore.updateUserDataOnServer(false);
  } catch (error) {
    // Log any errors that occur during the update
    console.error("Failed to update progress:", error);
  }

  // Optionally, update the progress in localStorage
  localStorage.setItem(userProgressKey, currentStepIndex.value.toString());
};

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
      if (userStore.user.lives > 0) {
        userStore.user.lives--;
        console.log("Lives remaining: ", userStore.user.lives); // Логируем оставшиеся жизни
        userStore.updateUserDataOnServer(false); // Обновляем данные пользователя на сервере
      } else {
        userStore.openModal("Ошибка", "У вас нет жизни");
        return;
      }
      userStore.openModal(
        "Ошибка",
        `Ваш ответ неверен. У вас осталось: ${userStore.user.lives} жизней. 
        Пожалуйста, обратите внимание на следующие моменты:
            ${errorMessage.trim()}`
      );
    }
  }
};

const clearAnswerAndError = () => {
  userAnswer.value = "";
  isCorrect.value = null;
};

// Watcher to save progress whenever the step index changes
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
