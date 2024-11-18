import { H3Event } from "h3";
import fs from "fs";
import path from "path";

// Абсолютный путь к файлу
const usersFilePath = path.resolve("server", "users.json");

export default defineEventHandler(async (event: H3Event) => {
  try {
    const { telegramId, password, type, tguser } = await readBody(event);
    console.log("Received telegramId:", telegramId);
    console.log("Received password:", password);
    if (type == "password") {
      console.log("Received type:", type);
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
    } else if (type == "telegram") {
      console.log("Received telegramId:", telegramId);
      console.log("Received password:", password);
      console.log("Received type:", type);

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
      let user = users.find(
        (u: { telegram_id: any }) => u.telegram_id === Number(telegramId)
      );

      if (!user) {
        console.log("User start creating");
        const newUser = {
          telegram_id: telegramId,
          username: tguser.username || "",
          first_name: tguser.first_name || "",
          last_name: tguser.last_name || "",
          phone: null,
          coins: 0,
          mana: 0,
          lives: 3,
          subscription: "free",
          password: "",
          created_at: new Date().toISOString(),
        };
        console.log("New user:", newUser);
        // Добавляем нового пользователя в список
        users.push(newUser);

        // Сохраняем обновленный список пользователей в файл
        writeUsers(users);

        user = newUser;
      } else {
        console.log("User found:", user);
      }

      // Преобразуем user в массив и возвращаем его
      const userArray = Object.entries(user); // Преобразуем объект в массив

      return { message: "Login successful", user: userArray };
    }
  } catch (error) {
    console.error(error);
    return { statusCode: 500, message: "Internal Server Error" };
  }

  function writeUsers(users: any) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
  }
  function readUsers() {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, "utf-8");
      if (data.trim() === "") {
        return []; // Если файл пустой, возвращаем пустой массив
      }
      return JSON.parse(data); // Парсим данные
    } else {
      return []; // Если файл не существует, возвращаем пустой массив
    }
  }
});
