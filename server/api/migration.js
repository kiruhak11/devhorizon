import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function migrateData() {
  try {
    // Чтение данных из data.json
    const data = JSON.parse(fs.readFileSync("data.json", "utf-8"));

    // Перенос данных пользователей в базу с использованием upsert
    for (const user of data.User) {
      await prisma.user.upsert({
        where: {
          telegramId: user.telegramId,
        },
        update: {
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          coins: user.coins,
          mana: user.mana,
          lives: user.lives,
          password: user.password,
          createdAt: new Date(user.createdAt),
        },
        create: {
          telegramId: user.telegramId,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          coins: user.coins,
          mana: user.mana,
          lives: user.lives,
          password: user.password,
          createdAt: new Date(user.createdAt),
        },
      });
    }

    // Перенос подписок в базу
    for (const subscription of data.Subscription) {
      await prisma.subscription.create({
        data: {
          type: subscription.type,
          end: new Date(subscription.end),
          userId: subscription.userId,
        },
      });
    }

    // Перенос курсов в базу
    for (const course of data.Course) {
      await prisma.course.create({
        data: {
          title: course.title,
          price: course.price,
          description: course.description,
          theme: course.theme,
          createdAt: new Date(course.createdAt),
        },
      });
    }

    console.log("Data successfully migrated!");
  } catch (error) {
    console.error("Error migrating data:", error);
  } finally {
    // Отключение клиента Prisma
    await prisma.$disconnect();
  }
}

// Запуск функции миграции данных
migrateData();
