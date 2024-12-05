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
    if (!telegramId || isNaN(Number(telegramId))) {
      throw new Error("Invalid Telegram ID");
    }

    const existingUser = await prisma.user.findUnique({
      where: { telegramId: Number(telegramId) },
    });

    if (existingUser) {
      return { message: "User already exists" };
    }

    const username = tguser.username || "";
    const firstName = tguser.first_name || "";
    const lastName = tguser.last_name || "";
    const hashedPassword = password ? await bcrypt.hash(password, 10) : "";
    const gift = new Date(
      new Date().setUTCHours(new Date().getUTCHours() - 24)
    );

    const newUser = await prisma.user.create({
      data: {
        telegramId: Number(telegramId),
        username,
        firstName,
        lastName,
        password: hashedPassword,
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

    return {
      message: "Login successful",
      user: newUser,
      subscription: newSubscription,
    };
  }

  throw createError({ statusCode: 400, message: "Invalid request type" });
});
