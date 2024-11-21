import { Telegraf } from "telegraf";

import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const bot = new Telegraf("7696869877:AAHYLtyjbqbSSjhWrFBVLeLMis6kWtwaIK8");
app.use(express.json()); // Для парсинга JSON в запросах

let isChangingPassword = {}; // Для отслеживания статуса смены пароля

// Обработка команды /start в боте
bot.start(async (ctx) => {
  const telegramId = ctx.message?.from.id;

  if (!telegramId)
    return ctx.reply("Ошибка: не удалось определить Telegram ID.");

  // Проверяем, есть ли пользователь в базе
  const user = await prisma.user.findUnique({
    where: { telegramId },
  });

  if (user) {
    return ctx.reply(
      `Привет, ${user.firstName || "пользователь"}! Вы уже зарегистрированы.`
    );
  }

  ctx.reply("Привет! Чтобы зарегистрироваться, придумай пароль.");
});

// Обработка текстовых сообщений
bot.on("text", async (ctx) => {
  const message = ctx.message?.text;
  const user = ctx.message?.from;

  if (!message || !user) return;

  const telegramId = user.id;

  // Если пользователь находится в процессе смены пароля
  if (isChangingPassword[telegramId]) {
    const newPassword = message;
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { telegramId },
      data: { password: hashedPassword },
    });

    ctx.reply("Пароль успешно изменён!");
    isChangingPassword[telegramId] = false;
    return;
  }

  if (message.toLowerCase() === "password") {
    const existingUser = await prisma.user.findUnique({
      where: { telegramId },
    });

    if (!existingUser) {
      return ctx.reply("Вы ещё не зарегистрированы.");
    }

    ctx.reply("Введите новый пароль:");
    isChangingPassword[telegramId] = true;
    return;
  }

  // Регистрация нового пользователя
  const hashedPassword = await bcrypt.hash(message, 10);

  const existingUser = await prisma.user.findUnique({
    where: { telegramId },
  });

  if (existingUser) {
    return ctx.reply("Вы уже зарегистрированы.");
  }

  const newUser = await prisma.user.create({
    data: {
      telegramId,
      username: user.username || "",
      firstName: user.first_name || "",
      lastName: user.last_name || "",
      password: hashedPassword,
      subscription: {
        create: {
          type: 1, // Тип подписки (по умолчанию 1)
          end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Годовая подписка
        },
      },
    },
  });

  ctx.reply(`Регистрация завершена! Ваш логин: ${newUser.telegramId}`);
});

// Старт сервера
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// Запуск бота
bot.launch();
