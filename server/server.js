import { Telegraf, Markup } from "telegraf";
import express from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import axios from "axios";
import bodyParser from "body-parser";

const CHANNEL_USERNAME = "@GScompany_tg";
const prisma = new PrismaClient();
const app = express();
const botToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(botToken);
const course = 2.15;
app.use(express.json());
app.use(bodyParser.json());
let userState = {};

bot.start(async (ctx) => {
  const welcomeMessage = `
Привет, ${ctx.message.from.first_name || ""} я ваш бот! Вот что я умею:

- Регистрация
- Управление паролем
- Добавление монет
- Совершение покупок
- Запрос возврата средств
- Получение бонуса

Бонус: Подпишитесь на наш канал ${CHANNEL_USERNAME} и получите 199 монет!
Выберите команду с помощью кнопок ниже:
  `;
  ctx.reply(
    welcomeMessage,
    Markup.keyboard([
      ["Регистрация", "Сменить пароль", "Отправить сообщение"],
      ["Добавить монеты", "Оплатить", "Запросить возврат"],
    ])
      .resize()
      .oneTime()
  );
});
let sender = 0;
bot.on("callback_query", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  if (callbackData.startsWith("select_user_")) {
    const userId = parseInt(callbackData.split("_")[2], 10); // Извлекаем ID пользователя

    // Сохраняем состояние отправки сообщения
    userState[ctx.callbackQuery.from.id] = { isSendingTo: userId };

    await ctx.reply(`Введите сообщение для пользователя с ID ${userId}:`);
  }
  if (callbackData.startsWith("reply_to_")) {
    const userId = parseInt(callbackData.split("_")[2], 10); // Извлекаем ID пользователя
    const sanderId = ctx.callbackQuery.from.id; // ID администратора
    sender = userId;
    // Записываем состояние администратора
    userState[sanderId] = { isReplyingTo: userId };
    await ctx.reply(`Введите сообщение для пользователя с ID ${userId}:`);
  }
});
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

bot.hears("Получить бонус", checkRegistration, async (ctx) => {
  const telegramId = ctx.message.from.id;

  try {
    // Проверяем, есть ли пользователь в базе
    const user = await prisma.user.findUnique({ where: { telegramId } });

    if (!user) {
      return ctx.reply("Пользователь не найден.");
    }

    // Проверяем, получал ли пользователь бонус ранее
    if (user.hasReceivedBonus) {
      return ctx.reply("Вы уже получили бонус за подписку.");
    }

    // Проверяем статус подписки пользователя
    const response = await axios.get(
      `https://api.telegram.org/bot${botToken}/getChatMember`,
      {
        params: {
          chat_id: CHANNEL_USERNAME,
          user_id: telegramId,
        },
      }
    );

    const status = response.data.result.status;

    // Если пользователь подписан
    if (["member", "administrator", "creator"].includes(status)) {
      // Обновляем баланс и помечаем, что бонус был получен
      const updatedUser = await prisma.user.update({
        where: { telegramId },
        data: {
          coins: user.coins + 199,
          hasReceivedBonus: true,
        },
      });

      ctx.reply(
        `Спасибо за подписку! Вам начислено 199 монет. Теперь у вас ${updatedUser.coins} монет.`
      );
    } else {
      ctx.reply(
        `Пожалуйста, подпишитесь на наш канал ${CHANNEL_USERNAME} и повторите команду.`
      );
    }
  } catch (error) {
    console.error("Ошибка проверки подписки:", error.response?.data || error);
    ctx.reply(
      "Не удалось проверить подписку. Убедитесь, что вы подписались, и попробуйте снова."
    );
  }
});

bot.hears("Отправить сообщение", checkRegistration, async (ctx) => {
  try {
    // Получаем список пользователей
    const users = await prisma.user.findMany();

    if (users.length === 0) {
      await ctx.reply("Нет доступных пользователей.");
      return;
    }

    // Формируем inline-кнопки с именами пользователей
    const inlineKeyboard = users.map((user) => [
      {
        text: `${user.firstName || ""} ${user.lastName || ""}`.trim(), // Имя пользователя
        callback_data: `select_user_${user.telegramId}`, // Callback data содержит ID пользователя
      },
    ]);

    await ctx.reply("Выберите пользователя:", {
      reply_markup: { inline_keyboard: inlineKeyboard },
    });
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    await ctx.reply("Произошла ошибка при получении списка пользователей.");
  }
});
// Команда запроса возврата средств
bot.hears("Запросить возврат", checkRegistration, async (ctx) => {
  const telegramId = ctx.message.from.id;
  const user = await prisma.user.findUnique({ where: { telegramId } });
  const userId = user.id;

  // Ищем платёж в базе данных с помощью Prisma
  const payment = await prisma.payment.findFirst({
    where: { userId: userId, status: "paid" }, // Проверяем, что пользователь уже оплатил
  });

  if (!payment) {
    return ctx.reply("Вы ещё не совершали оплату.");
  }

  try {
    // Отправляем запрос на возврат средств через Telegram API
    const response = await axios.post(
      `https://api.telegram.org/bot${botToken}/refundStarPayment`,
      {
        user_id: telegramId,
        telegram_payment_charge_id: payment.telegramPaymentChargeId, // Используем paymentChargeId из базы данных
      }
    );

    if (response.data.ok) {
      // Обновляем статус платежа на "возвращено" или удаляем его
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "refunded" }, // Обновляем статус или используем delete(), если хотите удалить
      });
      await prisma.user.update({
        where: { telegramId },
        data: { coins: { decrement: payment.amount } },
      });
      // Отправляем сообщение пользователю о возврате
      ctx.reply("Возврат средств выполнен успешно.");

      // Отправляем сообщение админу о возврате
      const adminId = 502773482; // ID администратора
      await bot.telegram.sendMessage(
        adminId,
        `Пользователь с ID ${userId} запросил возврат средств. Платёж был возвращён.`
      );
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
      const progressData = await prisma.progress.createMany({
        data: [
          {
            userId: newUser.id,
            progress: 0,
            courseId: 1, // Course 1
          },
          {
            userId: newUser.id,
            progress: 0,
            courseId: 2, // Course 2 (you can add more courses here)
          },
          {
            userId: newUser.id,
            progress: 0,
            courseId: 3, // Course 3 (you can add more courses here)
          },
          {
            userId: newUser.id,
            progress: 0,
            courseId: 4, // Course 4 (you can add more courses here)
          },
        ],
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
      payload: JSON.stringify({ telegramId, coins: amount }), // хз что это, надо разбираться
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
  // Проверяем, отвечает ли администратор пользователю
  if (userState[telegramId]?.isReplyingTo) {
    const userId = userState[telegramId].isReplyingTo;

    try {
      // Отправляем сообщение пользователю
      try {
        // Проходим по всем ID админов
        const _message = ` Ответ от пользователя ${telegramId}:\n${message}`;
        // Отправляем сообщение каждому администратору
        await axios.post(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            chat_id: userId,
            text: _message,
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: "Ответить", // Текст на кнопке
                    callback_data: `reply_to_${telegramId}`, // Данные, которые вернутся боту при нажатии
                  },
                ],
              ],
            },
          }
        );
      } catch (error) {
        console.error("Error sending message to Telegram:", error);
        throw new Error("Failed to send message to Telegram");
      }

      // Уведомляем администратора об успешной отправке
      await ctx.reply("Сообщение успешно отправлено!");

      // Очищаем состояние администратора
      delete userState[telegramId].isReplyingTo;
    } catch (error) {
      console.error("Error replying to user:", error);
      await ctx.reply("Произошла ошибка при отправке сообщения.");
    }

    return;
  }
  if (userState[telegramId]?.isSendingTo) {
    const userId = userState[telegramId].isSendingTo;

    try {
      // Отправляем сообщение выбранному пользователю
      const _message = ` Ответ от пользователя ${telegramId}:\n${message}`;
      // Отправляем сообщение каждому администратору
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: userId,
        text: _message,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Ответить", // Текст на кнопке
                callback_data: `reply_to_${telegramId}`, // Данные, которые вернутся боту при нажатии
              },
            ],
          ],
        },
      });

      // Уведомляем администратора об успешной отправке
      await ctx.reply("Сообщение успешно отправлено!");

      // Очищаем состояние
      delete userState[telegramId].isSendingTo;
    } catch (error) {
      console.error("Ошибка отправки сообщения:", error);
      await ctx.reply("Произошла ошибка при отправке сообщения.");
    }

    return;
  }
  ctx.reply("Выберите команду с помощью кнопок.");
});
// хз зачем, но пусть будет
bot.on("pre_checkout_query", (ctx) => {
  ctx.answerPreCheckoutQuery(true);
});
bot.on("message", async (ctx) => {
  if (ctx.update.message.successful_payment != undefined) {
    ctx.reply("Thanks for the purchase!");

    // Получаем данные о платеже
    const telegramId = ctx.from.id; // Извлекаем Telegram ID из ctx.from.id
    const chargeId = ctx.message.successful_payment.telegram_payment_charge_id;
    const invoicePayload = ctx.message.successful_payment.invoice_payload;
    const payload = JSON.parse(invoicePayload);
    const coins = payload.coins;

    try {
      // Проверяем, существует ли пользователь
      const user = await prisma.user.findUnique({ where: { telegramId } });

      if (!user) {
        return ctx.reply("Пользователь не найден. Свяжитесь с поддержкой.");
      }

      // Сохраняем информацию о платеже в базе данных
      await prisma.payment.create({
        data: {
          telegramPaymentChargeId: chargeId,
          userId: user.id,
          amount: coins,
          status: "paid", // Статус платежа "paid"
        },
      });

      // Обновляем количество монет пользователя
      await prisma.user.update({
        where: { telegramId },
        data: { coins: user.coins + coins },
      });

      ctx.reply(
        `Оплата прошла успешно! Ваш баланс пополнен на ${coins} монет.`
      );

      // Отправка сообщения администратору
      const adminId = 502773482; // ID администратора
      await bot.telegram.sendMessage(
        adminId,
        `Пользователь с ID ${telegramId} только что оплатил ${coins} монет.`
      );
    } catch (error) {
      console.error("Ошибка обработки успешного платежа:", error);
      ctx.reply("Произошла ошибка. Свяжитесь с поддержкой.");
    }
  }
});

// Старт сервера
app.listen(3001, () => {
  console.log("Server running on port 3001");
});

// Запуск бота
bot.launch();
