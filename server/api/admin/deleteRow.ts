// /api/deleteRow.ts
import prisma from "../../prisma";

export default defineEventHandler(async (event) => {
  const { table, id } = getQuery(event);

  if (!table || !id) {
    throw createError({
      statusCode: 400,
      message: "Не указано имя таблицы или id записи",
    });
  }

  try {
    let data;
    switch (table) {
      case "User":
        // Удаляем зависимости перед удалением пользователя
        await prisma.subscription.deleteMany({
          where: { userId: Number(id) }, // если есть зависимость в других таблицах
        });
        await prisma.payment.deleteMany({
          where: { userId: Number(id) },
        });
        data = await prisma.user.delete({
          where: { id: Number(id) },
        });
        break;
      case "Subscription":
        data = await prisma.subscription.delete({
          where: { id: Number(id) },
        });
        break;
      case "Course":
        data = await prisma.course.delete({
          where: { id: Number(id) },
        });
        break;
      case "Payment":
        data = await prisma.payment.delete({
          where: { id: Number(id) },
        });
        break;
      default:
        throw createError({
          statusCode: 400,
          message: "Некорректное имя таблицы",
        });
    }
    return { success: true };
  } catch (error) {
    console.error("Ошибка при удалении записи:", error);
    throw createError({
      statusCode: 500,
      message: "Ошибка сервера",
    });
  }
});
