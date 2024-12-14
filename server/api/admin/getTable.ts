import prisma from "../../prisma";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const tableName = query.table;

  try {
    if (!tableName) {
      throw createError({
        statusCode: 400,
        message: "Не указано имя таблицы",
      });
    }

    let data;
    switch (tableName) {
      case "User":
        data = await prisma.user.findMany();
        break;
      case "Subscription":
        data = await prisma.subscription.findMany();
        break;
      case "Course":
        data = await prisma.course.findMany();
        break;
      case "Payment":
        data = await prisma.payment.findMany();
        break;
      default:
        throw createError({
          statusCode: 400,
          message: "Некорректное имя таблицы",
        });
    }

    return data;
  } catch (error) {
    console.error("Ошибка при получении данных таблицы:", error);
    throw createError({
      statusCode: 500,
      message: "Ошибка сервера",
    });
  }
});
