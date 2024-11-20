// server/api/updateUser.ts

import prisma from "../prisma"; // Подключаем Prisma

export default defineEventHandler(async (event) => {
  const { userId, userData } = await readBody(event); // Получаем данные из запроса

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
        lives: userData.lives || 3,
      },
    });

    // Возвращаем обновленные данные пользователя
    return updatedUser;
  } catch (error) {
    console.error("Error updating user data", error);
    return { error: "Error updating user data" };
  }
});
