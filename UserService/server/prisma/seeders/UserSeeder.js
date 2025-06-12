import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const seedUsers = async () => {
  try {
    const existingUsers = await prisma.user.findMany({
      where: {
        OR: [
          { username: "seller1", name: "seller1" },
          { username: "seller2", name: "seller2" },
        ],
      },
    });

    if (existingUsers.length > 0) {
      console.log("Users already exist");
      return;
    }

    await prisma.user.createMany({
      data: [
        {
          id: "71c56758-5163-4473-9adf-f348e78894a5",
          username: "seller1",
          name: "Seller1",
          password: "password1",
          roleId: 2,
        },
        {
          id: "68ab7757-88e5-4955-ab9e-efaa6eebb3d7",
          username: "seller2",
          name: "Seller2",
          password: "password2",
          roleId: 2,
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
};
