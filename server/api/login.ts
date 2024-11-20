import prisma from "../prisma";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const { telegramId, password, type, tguser, method } = await readBody(event);

  if (type === "password") {
    console.warn("Password login is not implemented yet");
    const user = await prisma.user.findUnique({
      where: { telegramId: Number(telegramId) },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError({ statusCode: 401, message: "Invalid credentials" });
    }

    return { message: "Login successful", user };
  } else if (type === "telegram" && method === "register") {
    const existingUser = await prisma.user.findUnique({
      where: { telegramId: Number(telegramId) },
    });

    if (existingUser) {
      return { message: "User already exists" };
    }

    const newUser = await prisma.user.create({
      data: {
        telegramId,
        username: tguser.username || "",
        firstName: tguser.first_name || "",
        lastName: tguser.last_name || "",
        password: password ? await bcrypt.hash(password, 10) : "",
        subscription: {
          create: {
            type: 1, // Тип подписки
            end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Годовая подписка
          },
        },
      },
    });

    return { message: "Login successful", user: newUser };
  } else if (type === "reload") {
    // Получаем пользователя и его подписку
    const user = await prisma.user.findUnique({
      where: { telegramId: Number(telegramId) },
      include: { subscription: true }, // Включаем информацию о подписке
    });

    if (!user) {
      throw createError({ statusCode: 404, message: "User not found" });
    }

    // Если подписки нет, создаём новую подписку
    const subscriptionData = user.subscription?.[0] || {
      type: 1,
      end: new Date(new Date().setFullYear(new Date().getFullYear() + 1)), // Если подписки нет, создаём на 1 год
    };

    // Обновляем данные пользователя
    const updatedUser = await prisma.user.update({
      where: { telegramId: Number(telegramId) },
      data: {
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "", // Если добавляете номер телефона
        coins: user.coins || 0, // Обновление количества монет
        mana: user.mana || 0, // Обновление манны
        lives: user.lives || 3, // Обновление количества жизней
        // Можно добавить другие поля по аналогии, например, дату окончания подписки

        // Обновление подписки
      },
    });

    return { message: "Login successful", user: updatedUser };
  }

  throw createError({ statusCode: 400, message: "Invalid request type" });
});
