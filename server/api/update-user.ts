import prisma from "../prisma";

export default defineEventHandler(async (event) => {
  const { telegramId, updatedUserData } = await readBody(event);

  const updatedUser = await prisma.user.update({
    where: { telegramId: Number(telegramId) },
    data: updatedUserData,
  });

  return { message: "User updated successfully", user: updatedUser };
});
