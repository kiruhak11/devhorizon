import { Telegraf } from "telegraf";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs";
import express from "express";
import bcrypt from "bcrypt";
import { ref } from "vue";

const app = express();
const bot = new Telegraf("7696869877:AAHYLtyjbqbSSjhWrFBVLeLMis6kWtwaIK8"); // Токен вашего бота

// Получаем путь к текущей директории
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Путь к файлу, где будут храниться пользователи
const usersFilePath = join(__dirname, "users.json");

app.use(express.json()); // Для парсинга JSON в запросах

// Чтение данных о пользователях
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

// Запись данных о пользователях в файл
function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), "utf-8");
}
export default add = (user, message) => {
  console.warn("add", message, user);
  bot.telegram.sendMessage(user, message);
};
// Обработка команды /start в боте
bot.start((ctx) => {
  ctx.reply("Привет! Чтобы зарегистрироваться, придумай пароль!");
});
let newPassword;
// Обработка получения данных пользователя в боте
bot.on("text", async (ctx) => {
  const message = ctx.message.text;
  const user = ctx.message.from;
  if (newPassword === true) {
    const password = message;
    const hashedPassword = await bcrypt.hash(password, 10);
    const users = readUsers();
    const existingUser = users.find((u) => u.telegram_id === user.id);
    existingUser.password = hashedPassword;
    writeUsers(users);
    ctx.reply("Пароль изменен.");
    newPassword = false;
    return;
  }
  if (message.toLowerCase() === "password") {
    ctx.reply("Введи новый пароль");
    newPassword = true;
    return;
  }
  // Проверка пароля
  if (message != "12345") {
    const password = message;
    const hashedPassword = await bcrypt.hash(password, 10);
    // Чтение данных о пользователях
    const users = readUsers();

    // Проверка на уникальность (если пользователь с таким telegram_id уже существует)
    const existingUser = users.find((u) => u.telegram_id === user.id);
    if (existingUser) {
      return ctx.reply("Ты уже зарегистрирован.");
    }

    // Создаем профиль пользователя
    const newUser = {
      telegram_id: user.id,
      username: user.username || "",
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      phone: null,
      coins: 0,
      mana: 0,
      lives: 3,
      subscription: "free",
      password: hashedPassword,
      created_at: new Date().toISOString(),
    };

    // Добавляем нового пользователя в список
    users.push(newUser);

    // Сохраняем обновленный список пользователей в файл
    writeUsers(users);

    // Отправляем сообщение об успешной регистрации
    ctx.reply(
      `Ты зарегистрирован твой пароль: ${password} и логин: ${user.id}\nДобро пожаловать, ${user.first_name}!`
    );
  } else {
    ctx.reply("Попробуй снова.");
  }
});

bot.launch();

// Обработка запроса на вход
app.post("/api/login", (req, res) => {
  const { telegramId, password } = req.body;

  // Чтение данных о пользователях
  const users = readUsers();

  // Поиск пользователя по telegramId
  const user = users.find((u) => u.telegram_id === telegramId);

  if (!user) {
    return res.status(404).json({ error: "Пользователь не найден" });
  }

  // Проверка пароля
  if (user.password !== password) {
    return res.status(401).json({ error: "Неверный пароль" });
  }

  // Если все правильно, отправляем успешный ответ
  return res.status(200).json({ message: "Успешный вход" });
});

// Стартуем сервер на порту 3001
app.listen(3001, () => {
  console.log("Server running on port 3001");
});
