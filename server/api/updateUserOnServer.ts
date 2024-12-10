import prisma from "../prisma";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const { userId, userData, subscriptionData, isPassword } = await readBody(
    event
  );

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    const subscription = await prisma.subscription.findUnique({
      where: { id: Number(userId) },
    });
    if (!user || !subscription) {
      throw createError({ statusCode: 401, message: "Invalid credentials" });
    }

    // Обновление данных пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: user.username || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        coins: user.coins || 0,
        mana: user.mana || 0,
        password: user.password || "",
        lives: user.lives || 0,
        gift:
          user.gift ||
          new Date(new Date().setUTCHours(new Date().getUTCHours() - 24)),
      },
    });

    const updatedSubscription = await prisma.subscription.update({
      where: { id: userId },
      data: {
        type: subscription.type || 1,
        end:
          subscription.end ||
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    });

    return {
      message: "Login successful",
      user: updatedUser,
      subscription: updatedSubscription,
    };
  } catch (error) {
    console.warn("Error updating user data", error);
    return { error: "Error updating user data" };
  }
});
