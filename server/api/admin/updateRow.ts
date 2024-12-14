import prisma from "../../prisma";

export default defineEventHandler(async (event) => {
  const { table } = getQuery(event);
  const body = await readBody(event);

  console.log("Полученные данные на сервере для обновления:", body);

  const { id, ...dataToUpdate } = body;

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Не указан ID записи для обновления",
    });
  }

  if (!table) {
    throw createError({
      statusCode: 400,
      message: "Не указано имя таблицы",
    });
  }

  // Преобразуем ID в число
  const numericId = parseInt(id, 10);

  // Преобразуем данные, если требуется
  if (dataToUpdate.price) {
    dataToUpdate.price = parseInt(dataToUpdate.price, 10);
  }

  // Проверяем, существует ли запись
  const existingRecord = await prisma.course.findUnique({
    where: { id: numericId },
  });

  if (!existingRecord) {
    try {
      let updatedData;
      switch (table) {
        case "Course":
          updatedData = await prisma.course.create({
            data: dataToUpdate,
          });
          break;
        case "User":
          updatedData = await prisma.user.create({
            data: dataToUpdate,
          });
          break;
        case "Subscription":
          updatedData = await prisma.subscription.create({
            data: dataToUpdate,
          });
          break;
        case "Payment":
          updatedData = await prisma.payment.create({
            data: dataToUpdate,
          });
          break;
        default:
          throw createError({
            statusCode: 400,
            message: `Таблица с именем ${table} не поддерживается для обновления`,
          });
      }

      console.log("Успешное обновление данных:", updatedData);
      return updatedData;
    } catch (error) {
      console.error("Ошибка при обновлении записи:", error);
      throw createError({
        statusCode: 500,
        message: "Ошибка сервера при обновлении записи",
      });
    }
  }

  try {
    let updatedData;
    switch (table) {
      case "Course":
        updatedData = await prisma.course.update({
          where: { id: numericId },
          data: dataToUpdate,
        });
        break;
      case "User":
        updatedData = await prisma.user.update({
          where: { id: numericId },
          data: dataToUpdate,
        });
        break;
      case "Subscription":
        updatedData = await prisma.subscription.update({
          where: { id: numericId },
          data: dataToUpdate,
        });
        break;
      case "Payment":
        updatedData = await prisma.payment.update({
          where: { id: numericId },
          data: dataToUpdate,
        });
        break;
      default:
        throw createError({
          statusCode: 400,
          message: `Таблица с именем ${table} не поддерживается для обновления`,
        });
    }

    console.log("Успешное обновление данных:", updatedData);
    return updatedData;
  } catch (error) {
    console.error("Ошибка при обновлении записи:", error);
    throw createError({
      statusCode: 500,
      message: "Ошибка сервера при обновлении записи",
    });
  }
});
