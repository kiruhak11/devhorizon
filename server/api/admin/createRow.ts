import prisma from "../../prisma";

export default defineEventHandler(async (event) => {
  const { table } = getQuery(event); // Получаем параметр "table" из запроса
  const body = await readBody(event); // Читаем тело запроса

  // Проверка наличия таблицы
  if (!table) {
    throw createError({
      statusCode: 400,
      message: "Не указано имя таблицы",
    });
  }

  // Проверка наличия данных
  if (!body || Object.keys(body).length === 0) {
    throw createError({
      statusCode: 400,
      message: "Нет данных для создания записи",
    });
  }

  // Удаляем ID, если таблица имеет автоинкрементируемый ID
  if (table === "Course" && "id" in body) {
    delete body.id;
  }

  try {
    let newData;
    switch (table) {
      case "User":
        newData = await prisma.user.create({ data: body });
        break;
      case "Subscription":
        newData = await prisma.subscription.create({ data: body });
        break;
      case "Course":
        newData = await prisma.course.create({ data: body });
        break;
      case "Payment":
        newData = await prisma.payment.create({ data: body });
        break;
      default:
        throw createError({
          statusCode: 400,
          message: `Таблица с именем ${table} не поддерживается для создания`,
        });
    }

    return {
      status: "success",
      data: newData,
    };
  } catch (error) {
    console.error("Ошибка при создании записи:", error);
    throw createError({
      statusCode: 500,
      message: "Ошибка сервера при создании записи",
    });
  }
});
