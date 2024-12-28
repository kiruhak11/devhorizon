import prisma from "../prisma";

export default defineEventHandler(async () => {
  try {
    const subscription = await prisma.subscription.findMany();
    return subscription;
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    throw createError({ statusCode: 500, message: "Ошибка базы данных" });
  }
});
