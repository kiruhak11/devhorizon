import { toast } from "~/utils/toast";
import prisma from "../prisma";
import bcrypt from "bcrypt";

export default defineEventHandler(async (event) => {
  const { userId, userData, subscriptionData, isPassword } = await readBody(
    event
  );

  try {
    if (isPassword) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Обновление данных пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username: userData.username || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phone: userData.phone || "",
        coins: userData.coins || 0,
        mana: userData.mana || 0,
        password: userData.password || "",
        lives: userData.lives || 0,
        gift:
          userData.gift ||
          new Date(new Date().setUTCHours(new Date().getUTCHours() - 24)),
      },
    });

    const updatedSubscription = await prisma.subscription.update({
      where: { id: userId },
      data: {
        type: subscriptionData.type || 1,
        end:
          subscriptionData.end ||
          new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    });

    return {
      message: "Login successful",
      user: updatedUser,
      subscription: updatedSubscription,
    };
  } catch (error) {
    console.warn("Error updating user data", error);
    return { error: "Error updating user data" };
  }
});
