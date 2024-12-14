<template>
  <NuxtLayout name="default">
    <div class="admin-container">
      <h1 class="admin-title">Админ-панель</h1>

      <div class="admin-controls">
        <label for="table-select">Выберите таблицу:</label>
        <select
          id="table-select"
          v-model="selectedTable"
          @change="fetchTableData"
        >
          <option v-for="table in tables" :key="table" :value="table">
            {{ table }}
          </option>
        </select>
        <input
          v-if="selectedTable"
          type="text"
          v-model="searchQuery"
          placeholder="Поиск..."
          class="search-input"
        />
      </div>

      <div class="table-container" v-if="filteredData.length">
        <table>
          <thead>
            <tr>
              <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in filteredData" :key="row.id">
              <td v-for="(value, key) in row" :key="key">
                <input
                  v-if="isEdit && editIndex === index"
                  v-model="formData[key]"
                  :type="typeof value === 'number' ? 'number' : 'text'"
                />
                <span v-else>{{ value }}</span>
              </td>
              <td>
                <button @click="editRow(index, row)">Редактировать</button>
                <button @click="deleteRow(row.id)">Удалить</button>
                <button
                  v-if="isEdit && editIndex === index"
                  @click="saveRow(row.id)"
                >
                  Сохранить
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="no-data">Нет данных для отображения</div>

      <UiButton class="full" @click="addRow">Добавить</UiButton>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useFetch } from "~/composables/useFetch";

const router = useRouter();
const userStore = useUserStore();

// Проверяем доступ к странице
onMounted(() => {
  if (userStore.subscription.type < 5) {
    router.push("/");
  }
});

const tables = ["User", "Subscription", "Course", "Payment"];
const selectedTable = ref<string | null>(null);
const searchQuery = ref("");
const tableData = ref<any[]>([]);
const tableHeaders = ref<string[]>([]);
const formData = ref<any>({});
const isEdit = ref(false);
const editIndex = ref<number | null>(null);

// Загружаем данные для выбранной таблицы
const fetchTableData = async () => {
  if (selectedTable.value) {
    const { data, error } = await useFetch(
      `/api/admin/getTable?table=${selectedTable.value}`,
      { method: "GET", body: "" }
    );

    if (error) {
      console.error("Ошибка при получении данных:", error);
    } else if (data) {
      tableData.value = data;
      tableHeaders.value = Object.keys(data[0] || {});
    }
  }
};

// Фильтруем данные по поисковому запросу
const filteredData = computed(() => {
  if (!searchQuery.value) return tableData.value;
  return tableData.value.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  );
});

// Функция для редактирования строки
const editRow = (index: number, row: any) => {
  editIndex.value = index;
  isEdit.value = true;

  // Сохраняем копию данных строки в formData для последующего сохранения
  formData.value = { ...row };
};

// Функция для удаления строки
const deleteRow = async (id: number) => {
  if (selectedTable.value) {
    const { error } = await useFetch(
      `/api/admin/deleteRow?table=${selectedTable.value}&id=${id}`,
      {
        method: "DELETE",
        body: JSON.stringify({ id }),
      }
    );
    if (error) {
      console.error("Ошибка при удалении записи:", error);
    } else {
      fetchTableData();
    }
  }
};

// Функция для сохранения изменений или добавления новой строки
const saveRow = async (id: any) => {
  const url = isEdit.value
    ? `/api/admin/updateRow?table=${selectedTable.value}`
    : `/api/admin/createRow?table=${selectedTable.value}`;

  const method = isEdit.value ? "PUT" : "POST";

  // Копируем данные из formData
  const dataToSend = { ...formData.value };

  // Удаляем ID, если это создание новой записи
  if (!isEdit.value && "id" in dataToSend) {
    delete dataToSend.id;
  }

  try {
    const { data, error } = await useFetch(url, {
      method,
      body: JSON.stringify(dataToSend),
    });

    if (error) {
      console.error("Error while saving:", error);
      alert(`Ошибка при сохранении: ${error}`);
    } else {
      fetchTableData();
      isEdit.value = false;
      editIndex.value = null;
    }
  } catch (err) {
    console.error("Ошибка при сохранении:", err);
  }
};

// Функция для добавления новой строки
const addRow = () => {
  console.log("Добавление новой строки");

  // Создаем пустую строку для каждого заголовка таблицы
  const newRow = tableHeaders.value.reduce(
    (acc: Record<string, any>, header: string) => {
      acc[header] = ""; // Пустое значение для каждого поля
      return acc;
    },
    {} as Record<string, any>
  );

  tableData.value.push(newRow); // Добавляем строку в таблицу

  isEdit.value = true;
  editIndex.value = -1; // Это новая строка
};
</script>

<style scoped lang="scss">
.admin-container {
  margin: 40px auto;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.admin-title {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  color: var(--color-primary);
}

.admin-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px;
  text-align: left;
  border: 1px solid var(--color-border);
}

th {
  background-color: var(--color-background-light);
  font-weight: bold;
}

.no-data {
  text-align: center;
  color: var(--color-text-dark);
  margin-top: 20px;
}

.form-container {
  margin-top: 20px;
}

.form-group {
  margin-bottom: 12px;
}

input {
  padding: 8px;
  margin-top: 4px;
  width: 100%;
}

button {
  margin-top: 12px;
  padding: 10px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
}
</style>
