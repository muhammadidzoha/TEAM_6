import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    const existingRoles = await prisma.role.findMany({
      where: {
        OR: [{ name: "SELLER" }, { name: "USER" }],
      },
    });

    if (existingRoles.length > 0) {
      console.log("Roles already exist");
      return;
    }

    await prisma.role.createMany({
      data: [{ name: "SELLER" }, { name: "USER" }],
    });
    console.log("Roles created successfully");
  } catch (error) {
    console.error(error);
  }
}

main().finally(() => prisma.$disconnect());
