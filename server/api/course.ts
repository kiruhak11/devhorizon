import prisma from "../prisma";

export default defineEventHandler(async () => {
  try {
    const courses = await prisma.course.findMany();
    return courses;
  } catch (error) {
    console.error("Ошибка при получении курсов:", error);
    throw createError({ statusCode: 500, message: "Ошибка базы данных" });
  }
});
