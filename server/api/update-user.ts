import { H3Event } from "h3";
import fs from "fs";
import path from "path";

// Абсолютный путь к файлу users.json
const usersFilePath = path.resolve("server", "users.json");

export default defineEventHandler(async (event: H3Event) => {
  try {
    // Получаем данные из тела запроса
    const { telegramId, updatedUserData } = await readBody(event);

    if (!telegramId || !updatedUserData) {
      return { statusCode: 400, message: "Invalid data" };
    }

    // Проверка существования файла
    if (!fs.existsSync(usersFilePath)) {
      return { statusCode: 404, message: "Users file not found" };
    }

    // Чтение пользователей из файла
    const readUsers = () => {
      const data = fs.readFileSync(usersFilePath, "utf-8");
      return JSON.parse(data);
    };
    const usersData = fs.readFileSync(usersFilePath, "utf-8");
    let users = JSON.parse(usersData);

    // Находим пользователя по telegramId
    const userIndex = users.findIndex(
      (user: { telegram_id: number }) => user.telegram_id === telegramId
    );

    if (userIndex === -1) {
      return { statusCode: 404, message: "User not found" };
    }
    if (!Array.isArray(users)) {
      // Если данные не массив, преобразуем их в массив
      console.warn(
        "Data in users.json is not an array, converting to array..."
      );
      users = Object.values(users); // Преобразуем объект в массив
    }
    // Обновляем данные пользователя
    users[userIndex] = { ...users[userIndex], ...updatedUserData };

    // Сохраняем измененные данные обратно в users.json
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    return { statusCode: 200, message: "User data updated successfully" };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, message: "Internal Server Error" };
  }
});
