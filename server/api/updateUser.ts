import prisma from "../prisma"; // Подключаем Prisma

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
        lives: userData.lives || 3,
      },
    });
    console.warn(subscriptionData);
    const updateSubscribtion = await prisma.subscription.update({
      where: { id: userId },
      data: {
        type: subscriptionData.type || 1,
        end:
          subscriptionData.end ||
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    });
    const updateCourses = await prisma.course.findMany();
    console.warn("Updated user data", updateSubscribtion, updatedUser);
    // Возвращаем обновленные данные пользователя
    return {
      message: "Login successful",
      user: updatedUser,
      subscription: updateSubscribtion,
      courses: updateCourses,
    };
  } catch (error) {
    console.error("Error updating user data", error);
    return { error: "Error updating user data" };
  }
});
