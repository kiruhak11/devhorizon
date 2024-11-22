import prisma from "../prisma";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const { telegramId, password, type, tguser, method } = await readBody(event);
  if (type === "password") {
    const user = await prisma.user.findUnique({
      where: { telegramId: Number(telegramId) },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw createError({ statusCode: 401, message: "Invalid credentials" });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: Number(user.id) },
    });

    return {
      message: "Login successful",
      user: user,
      subscription: subscription,
    };
  } else if (type === "telegram" && method === "login") {
    const user = await prisma.user.findUnique({
      where: { telegramId: Number(telegramId) },
    });

    if (!user) {
      throw createError({ statusCode: 401, message: "Invalid credentials" });
    }

    const subscription = await prisma.subscription.findUnique({
      where: { id: Number(user.id) },
    });
    return {
      message: "Login successful",
      user: user,
      subscription: subscription,
    };
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
  }

  throw createError({ statusCode: 400, message: "Invalid request type" });
});
