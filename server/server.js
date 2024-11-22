import { Telegraf } from "telegraf";
import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const app = express();
const botToken = "7696869877:AAHYLtyjbqbSSjhWrFBVLeLMis6kWtwaIK8";
const bot = new Telegraf(botToken); // Замените на токен вашего бота
app.use(express.json()); // Для парсинга JSON в запросах

let isChangingPassword = {}; // Для отслеживания смены пароля
let isAddMoney = {}; // Для отслеживания добавления монет

// Обработка команды /start
bot.start(async (ctx) => {
  const telegramId = ctx.message?.from.id;

  if (!telegramId) {
    return ctx.reply("Ошибка: не удалось определить Telegram ID.");
  }

  const user = await prisma.user.findUnique({ where: { telegramId } });

  if (user) {
    return ctx.reply(
      `Привет, ${user.firstName || "пользователь"}! Вы уже зарегистрированы.`
    );
  }

  ctx.reply("Привет! Чтобы зарегистрироваться, введите пароль.");
});

// команда /pay, возвращает один товар. С объектом думаю разберешься
bot.command("pay", (ctx) => {
  return ctx.replyWithInvoice({
    chat_id: ctx.chat.id,
    title: "Test Product",
    description: "Test description",
    payload: "{}", // хз что это, надо разбираться
    provider_token: "", // если пусто, то это звезды
    currency: "XTR", // звезды
    prices: [
      { amount: 1, label: "Test Product" }, // Product variants
    ],
  });
});

// сюда сохраняется список всех покупок в боте, надо будет в БД унести
const paidUsers = new Map();

// Запрос на возврат средств
bot.command("refund", async (ctx) => {
  const userId = ctx.from.id;
  if (!paidUsers.has(userId)) {
    return ctx.reply("You have not paid yet, there is nothing to refund");
  }

  try {
    // Да-дааа, я сделал это через API телеграма, потому что библиотека пока не умеет в такое
    const url = `https://api.telegram.org/bot${botToken}/refundStarPayment`;
    const response = await axios.post(url, {
      user_id: userId,
      telegram_payment_charge_id: paidUsers.get(userId), // Параметр payment_id обязателен
    });

    // Проверяем успешный ответ
    if (response.data.ok) {
      // Тут надо будет удалять подписку у юзера
      paidUsers.delete(userId);
      return ctx.reply("Refund successful");
    } else {
      console.error("Ошибка от Telegram API:", response.data);
    }
  } catch (error) {
    console.error("Ошибка запроса:", error.response?.data || error.message);
  }
});

// Обработка текстовых сообщений
bot.command("text", async (ctx) => {
  const message = ctx.message?.text;
  const user = ctx.message?.from;

  if (!message || !user) return;

  const telegramId = user.id;

  try {
    // Обработка смены пароля
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

    // Обработка добавления монет
    if (isAddMoney[telegramId]) {
      const money = parseInt(message, 10); // Преобразуем сообщение в число

      if (isNaN(money)) {
        ctx.reply("Введите корректное число.");
        return;
      }

      // Получаем текущего пользователя
      const user = await prisma.user.findUnique({ where: { telegramId } });

      if (!user) {
        ctx.reply("Пользователь не найден.");
        isAddMoney[telegramId] = false;
        return;
      }

      try {
        // Обновляем количество монет в базе данных

        prisma.user.update({
          where: { telegramId },
          data: { coins: user.coins + 2 }, // Например, обновление типа подписки
        }),
          // Отправляем пользователю информацию об обновлении
          ctx.reply(
            `Монеты успешно добавлены! Теперь у вас ${user.coins} монет.`
          );
        isAddMoney[telegramId] = false;
      } catch (error) {
        console.error("Ошибка при добавлении монет:", error);
        ctx.reply("Произошла ошибка при обновлении монет. Попробуйте снова.");
      }
      return;
    }

    // Смена пароля
    if (message.toLowerCase() === "password") {
      const user = await prisma.user.findUnique({ where: { telegramId } });

      if (!user) {
        return ctx.reply("Вы ещё не зарегистрированы.");
      }

      ctx.reply("Введите новый пароль:");
      isChangingPassword[telegramId] = true;
      return;
    }

    // Добавление монет
    if (message.toLowerCase() === "addmoney") {
      const user = await prisma.user.findUnique({ where: { telegramId } });

      if (!user) {
        return ctx.reply("Вы ещё не зарегистрированы.");
      }

      ctx.reply("Сколько монет вы хотите добавить?");
      isAddMoney[telegramId] = true;
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

    ctx.reply(`Регистрация завершена! Ваш ID: ${newUser.telegramId}`);
  } catch (error) {
    console.error("Ошибка при обработке сообщения:", error);
    ctx.reply("Произошла ошибка. Попробуйте ещё раз.");
  }
});

// хз зачем, но пусть будет
bot.on("pre_checkout_query", (ctx) => {
  ctx.answerPreCheckoutQuery(true);
});

// держи это в самом блять конце иначе команды работать не будут. Эта штука после успешной оплаты записывает покупку в БД
bot.on("message", (ctx) => {
  if (ctx.update.message.successful_payment != undefined) {
    ctx.reply("Thanks for the purchase!");
    paidUsers.set(
      ctx.from.id,
      ctx.message.successful_payment.telegram_payment_charge_id
    );
  }
});

// Старт сервера
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// Запуск бота
bot.launch();
