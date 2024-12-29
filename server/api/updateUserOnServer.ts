import prisma from "../prisma";

export default defineEventHandler(async (event) => {
  const { userId, userData, subscriptionData, isPassword } = await readBody(
    event
  );

  try {
    // Получение пользователя
    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    // Получение подписки
    const subscription = await prisma.subscription.findUnique({
      where: { id: Number(userId) },
    });

    // Получение всех прогрессов для пользователя
    const userProgresses = await prisma.progress.findMany({
      where: { userId: Number(userId) },
    });

    if (!user || !subscription || userProgresses.length === 0) {
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
        isAdmin: user.isAdmin || false,
        hasReceivedBonus: user.hasReceivedBonus || false,
        gift:
          user.gift ||
          new Date(new Date().setUTCHours(new Date().getUTCHours() - 24)),
      },
    });

    // Обновление прогресса для каждого курса
    const updatedProgresses = await Promise.all(
      userProgresses.map(async (progress) => {
        return await prisma.progress.update({
          where: { id: progress.id },
          data: {
            progress: progress.progress, // Прогресс из объекта обновлений
            courseId: progress.courseId,
          },
        });
      })
    );
    // Обновление подписки
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
      progress: updatedProgresses,
    };
  } catch (error) {
    console.warn("Error updating user data", error);
    return { error: "Error updating user data" };
  }
});
