import prisma from "../prisma"; // Подключаем Prisma
import bcrypt from "bcrypt";
export default defineEventHandler(async (event) => {
  const { userId, userData, subscriptionData } = await readBody(event); // Получаем данные из запроса

  try {
    // Обновление данных пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId }, // Используем уникальный ID пользователя
      data: {
        username: userData.username || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        coins: userData.coins || 0,
        mana: userData.mana || 0,
        password: (await bcrypt.hash(userData.password, 10)) || "",
        lives: userData.lives || 3,
      },
    });
    const updateSubscribtion = await prisma.subscription.update({
      where: { id: userId },
      data: {
        type: subscriptionData.type || 1,
        end:
          subscriptionData.end ||
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    });
    // Возвращаем обновленные данные пользователя
    return {
      message: "Login successful",
      user: updatedUser,
      subscription: updateSubscribtion,
    };
  } catch (error) {
    console.warn("Error updating user data", error);
    return { error: "Error updating user data" };
  }
});
