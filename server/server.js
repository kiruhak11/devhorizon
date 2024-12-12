import { Telegraf, Markup } from "telegraf";
import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();
const app = express();
const botToken = "7696869877:AAHYLtyjbqbSSjhWrFBVLeLMis6kWtwaIK8";
const bot = new Telegraf(botToken);
const course = 2.15;
app.use(express.json());
const paidUsers = new Map();
// Временные переменные для состояния пользователей
let userState = {};
bot.start(async (ctx) => {
  const welcomeMessage = `
Привет, я ваш бот! Вот что я умею:

- Регистрация
- Управление паролем
- Добавление монет
- Совершение покупок
- Запрос возврата средств

Выберите команду с помощью кнопок ниже:
  `;
  ctx.reply(
    welcomeMessage,
    Markup.keyboard([
      ["Регистрация", "Сменить пароль"],
      ["Добавить монеты", "Оплатить", "Запросить возврат"],
    ])
      .resize()
      .oneTime()
  );
});

// Проверка регистрации пользователя
async function checkRegistration(ctx, next) {
  const telegramId = ctx.message.from.id;
  const user = await prisma.user.findUnique({ where: { telegramId } });

  if (!user) {
    return ctx.reply(
      "Вы ещё не зарегистрированы. Пожалуйста, нажмите 'Регистрация' для начала работы."
    );
  }

  return next();
}
// Обработка регистрации
bot.hears("Регистрация", async (ctx) => {
  const telegramId = ctx.message.from.id;
  const user = await prisma.user.findUnique({ where: { telegramId } });

  if (user) {
    return ctx.reply("Вы уже зарегистрированы.");
  }

  userState[telegramId] = { isRegistering: true };
  ctx.reply("Введите пароль для регистрации:");
});

// Команда смены пароля
bot.hears("Сменить пароль", checkRegistration, async (ctx) => {
  const telegramId = ctx.message.from.id;
  userState[telegramId] = { isChangingPassword: true };
  ctx.reply("Введите новый пароль:");
});

// Команда добавления монет
bot.hears("Добавить монеты", checkRegistration, async (ctx) => {
  const telegramId = ctx.message.from.id;
  userState[telegramId] = { isAddingCoins: true };
  ctx.reply("Сколько монет вы хотите добавить?");
});

// Команда оплаты
bot.hears("Оплатить", checkRegistration, (ctx) => {
  const telegramId = ctx.message.from.id;
  userState[telegramId] = { isBuyCoins: true };
  ctx.reply("Введите количество монет для покупки:");
});

// Команда запроса возврата средств
bot.hears("Запросить возврат", checkRegistration, async (ctx) => {
  const userId = ctx.message.from.id;

  if (!paidUsers.has(userId)) {
    return ctx.reply("Вы ещё не совершали оплату.");
  }

  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/refundStarPayment`,
      {
        user_id: userId,
        telegram_payment_charge_id: paidUsers.get(userId),
      }
    );

    if (response.data.ok) {
      paidUsers.delete(userId);
      ctx.reply("Возврат средств выполнен успешно.");
    } else {
      console.error("Ошибка Telegram API:", response.data);
      ctx.reply("Ошибка при запросе возврата средств.");
    }
  } catch (error) {
    console.error("Ошибка запроса:", error.response?.data || error.message);
    ctx.reply("Произошла ошибка при запросе возврата средств.");
  }
});

// Общий обработчик для завершения регистрации, смены пароля и добавления монет
bot.on("text", async (ctx) => {
  const telegramId = ctx.message.from.id;
  const message = ctx.message.text;
  if (userState[telegramId]?.isRegistering) {
    const gift = new Date(
      new Date().setUTCHours(new Date().getUTCHours() - 24)
    );

    try {
      if (!ctx.message || !ctx.message.from) {
        ctx.reply("Не удалось получить данные пользователя.");
        return;
      }

      const {
        username = "",
        first_name = "",
        last_name = "",
      } = ctx.message.from;

      const newUser = await prisma.user.create({
        data: {
          telegramId: Number(ctx.message.from.id),
          username,
          firstName: first_name,
          lastName: last_name,
          password: await bcrypt.hash(ctx.message.text, 10), // Передаем текст сообщения как пароль
          gift,
        },
      });
      const newSubscription = await prisma.subscription.create({
        data: {
          id: newUser.id,
          type: 1,
          userId: newUser.id,
          end: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        },
      });

      ctx.reply(`Регистрация завершена! Ваш ID: ${newUser.telegramId}`);
    } catch (error) {
      console.error("Ошибка при регистрации:", error);
      ctx.reply("Произошла ошибка при регистрации. Попробуйте снова.");
    }

    delete userState[telegramId].isRegistering;
    return;
  }

  if (userState[telegramId]?.isChangingPassword) {
    const hashedPassword = await bcrypt.hash(message, 10);

    try {
      await prisma.user.update({
        where: { telegramId },
        data: { password: hashedPassword },
      });

      ctx.reply("Пароль успешно изменён!");
    } catch (error) {
      console.error("Ошибка при смене пароля:", error);
      ctx.reply("Произошла ошибка при смене пароля. Попробуйте снова.");
    }

    delete userState[telegramId].isChangingPassword;
    return;
  }
  if (userState[telegramId]?.isBuyCoins) {
    const amount = parseInt(message, 10);
    // Проверка, что message - число в диапазоне от 2 до 100000
    if (!Number.isInteger(amount) || amount < 2 || amount > 100000) {
      return ctx.reply("Введите число от 2 до 100000.");
    }

    return ctx.replyWithInvoice({
      chat_id: ctx.chat.id,
      title: "Купить монеты",
      description: `Вы желаете приобрести ${amount} монет?`,
      payload: "{}", // хз что это, надо разбираться
      provider_token: "", // если пусто, то это звезды
      currency: "XTR", // звезды
      prices: [
        {
          amount: Math.round(amount / course),
          label: "Приобрести",
        }, // Product variants
      ],
    });
  }
  if (userState[telegramId]?.isAddingCoins) {
    const coins = parseInt(message, 10);

    if (isNaN(coins)) {
      ctx.reply("Введите корректное число.");
      return;
    }

    try {
      const user = await prisma.user.findUnique({ where: { telegramId } });

      if (!user) {
        return ctx.reply("Пользователь не найден.");
      }

      const updatedUser = await prisma.user.update({
        where: { telegramId },
        data: { coins: user.coins + coins },
      });

      ctx.reply(
        `Монеты успешно добавлены! Теперь у вас ${updatedUser.coins} монет.`
      );
    } catch (error) {
      console.error("Ошибка при добавлении монет:", error);
      ctx.reply("Произошла ошибка при добавлении монет.");
    }

    delete userState[telegramId].isAddingCoins;
    return;
  }
  if (ctx.update.message.successful_payment) {
    // Извлекаем информацию из payload

    const coinsPurchased = parseInt(message, 10);

    // Добавляем монеты пользователю в БД
    try {
      const user = await prisma.user.findUnique({ where: { telegramId } });

      if (!user) {
        return ctx.reply("Пользователь не найден. Обратитесь в поддержку.");
      }

      const updatedUser = await prisma.user.update({
        where: { telegramId },
        data: { coins: user.coins + coinsPurchased },
      });

      // Сообщение пользователю
      ctx.reply(
        `Оплата прошла успешно! Ваш баланс пополнен на ${coinsPurchased} монет. Теперь у вас ${updatedUser.coins} монет.`
      );
    } catch (error) {
      console.error("Ошибка обновления монет в БД:", error);
      ctx.reply(
        "Произошла ошибка при обработке платежа. Свяжитесь с поддержкой."
      );
    }
  }
  ctx.reply("Выберите команду с помощью кнопок.");
});
// Старт сервера
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// Запуск бота
bot.launch();
