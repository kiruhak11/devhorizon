import { H3Event } from "h3";
import fs from "fs";
import path from "path";

// Абсолютный путь к файлу
const usersFilePath = path.resolve("server", "users.json");

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { telegramId, password } = await readBody(event);
    console.log("Received telegramId:", telegramId);
    console.log("Received password:", password);

    console.log("Путь к файлу users.json:", usersFilePath);

    // Проверка существования файла
    if (!fs.existsSync(usersFilePath)) {
      console.log("Файл users.json не найден.");
      return { statusCode: 404, message: "Users file not found" };
    }

    // Чтение пользователей
    const readUsers = () => {
      const data = fs.readFileSync(usersFilePath, "utf-8");
      return JSON.parse(data);
    };

    const users = readUsers();
    console.log("Users from file:", users);

    // Убедимся, что telegramId в файле и в запросе имеют одинаковый тип
    const user = users.find(
      (u: { telegram_id: any }) => u.telegram_id === Number(telegramId)
    );

    console.log("User found:", user);

    if (!user) {
      return { statusCode: 404, message: "User not found" };
    }

    if (user.password !== password) {
      return { statusCode: 401, message: "Incorrect password" };
    }

    // Преобразуем user в массив и возвращаем его
    const userArray = Object.entries(user); // Преобразуем объект в массив

    return { message: "Login successful", user: userArray };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, message: "Internal Server Error" };
  }
});
