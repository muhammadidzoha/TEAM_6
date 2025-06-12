import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const seedRoles = async () => {
  try {
    const existingRoles = await prisma.role.findMany({
      where: {
        OR: [{ name: "SELLER" }, { name: "USER" }],
      },
    });

    if (existingUsers.length > 0) {
      console.log("roles already exist");
      return;
    }

    await prisma.role.createMany({
      data: [{ name: "SELLER" }, { name: "USER" }],
    });
  } catch (error) {
    console.error(error);
  }
};
