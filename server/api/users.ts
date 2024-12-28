import prisma from "../prisma";

export default defineEventHandler(async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    throw createError({ statusCode: 500, message: "Ошибка базы данных" });
  }
});
