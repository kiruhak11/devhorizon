import { data } from "autoprefixer";
import prisma from "../prisma";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const { userId, userData, subscriptionData, progressData, isPassword } =
    await readBody(event);
  try {
    if (isPassword) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Обновление данных пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: userData.username || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        coins: userData.coins || 0,
        mana: userData.mana || 0,
        password: userData.password || "",
        lives: userData.lives || 0,
        isAdmin: userData.isAdmin || false,
        hasReceivedBonus: userData.hasReceivedBonus || false,
        gift:
          userData.gift ||
          new Date(new Date().setUTCHours(new Date().getUTCHours() - 24)),
      },
    });
    const updatedProgress = [];
    for (const item of progressData) {
      await prisma.progress.updateMany({
        where: {
          userId: userId,
          courseId: item.courseId,
        },
        data: {
          progress: item.progress || 0, // если progress не задан, то будет 0
        },
      });

      // Добавляем информацию о прогрессе
      updatedProgress.push({
        courseId: item.courseId,
        progress: item.progress || 0,
      });
    }
    const updatedSubscription = await prisma.subscription.update({
      where: { id: userId },
      data: {
        type: subscriptionData.type || 1,
        end:
          subscriptionData.end ||
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    });

    return {
      message: "Login successful",
      user: updatedUser,
      subscription: updatedSubscription,
      progress: updatedProgress,
    };
  } catch (error) {
    console.warn("Error updating user data", error);
    return { error: "Error updating user data" };
  }
});
