import { defineEventHandler, readBody } from "h3";
import axios from "axios";
import prisma from "../prisma";

const botToken = "7696869877:AAHYLtyjbqbSSjhWrFBVLeLMis6kWtwaIK8";
// Пример функции для получения администраторов
let adminsTgId: number[] = [];
const getAdmins = async () => {
  try {
    const admins = await prisma.user.findMany({
      where: {
        isAdmin: true,
      },
    });
    adminsTgId = admins.map((admin) => admin.telegramId);
  } catch (error) {
    // Логируем ошибку в случае неудачи
    console.error("Ошибка при получении пользователей:", error);
    throw new Error("Ошибка при получении администраторов.");
  }
};

// Вызов
getAdmins();
// Функция для отправки сообщения в Telegram
const sendMessageToTelegram = async (text: string, userId: number) => {
  try {
    // Проходим по всем ID админов
    for (const telegramId of adminsTgId) {
      // Отправляем сообщение каждому администратору
      await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        chat_id: telegramId,
        text: text,
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Ответить", // Текст на кнопке
                callback_data: `reply_to_${userId}`, // Данные, которые вернутся боту при нажатии
              },
            ],
          ],
        },
      });
      console.log(`Message sent to admin with ID: ${telegramId}`);
    }
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    throw new Error("Failed to send message to Telegram");
  }
};
const sendMessageToUserTelegram = async (
  text: string,
  toSandId: number,
  userId: number
) => {
  try {
    // Проходим по всем ID админов

    // Отправляем сообщение каждому администратору
    await axios.post(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      chat_id: toSandId,
      text: text,
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Ответить", // Текст на кнопке
              callback_data: `reply_to_${userId}`, // Данные, которые вернутся боту при нажатии
            },
          ],
        ],
      },
    });
    console.log(`Message sent to admin with ID: ${toSandId}`);
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    throw new Error("Failed to send message to Telegram");
  }
};
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { name, email, message, tgId, Id, type, toSandId } = body;
    if (type === "admin") {
      if (!name || !email || !message) {
        return {
          statusCode: 400,
          body: { error: "All fields are required." },
        };
      }

      const formattedMessage = `Сообщение от ${name} (${email}):\n\n${message} \n\nДанные пользователя: \ntgId: ${tgId}, \nId: ${Id}`;

      // Отправляем сообщение админу через Telegram
      await sendMessageToTelegram(formattedMessage, tgId);

      return {
        statusCode: 200,
        body: { success: "Message successfully sent to the admin." },
      };
    } else if (type === "user") {
      if (!message) {
        return {
          statusCode: 400,
          body: { error: "All fields are required." },
        };
      }

      const formattedMessage = `Сообщение от ${name} :\n\n${message} \n\nДанные пользователя: \ntgId: ${tgId}, \nId: ${Id}`;

      await sendMessageToUserTelegram(formattedMessage, toSandId, tgId);

      return {
        statusCode: 200,
        body: { success: "Message successfully sent to the user." },
      };
    }
  } catch (error) {
    console.error("Error in /api/sendMessage endpoint:", error);
    return {
      statusCode: 500,
      body: { error: "Failed to send message. Please try again later." },
    };
  }
});
