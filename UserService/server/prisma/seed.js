import { PrismaClient } from "@prisma/client";
import { seedRoles } from "./seeders/RoleSeeder.js";
import { seedUsers } from "./seeders/UserSeeder.js";
const prisma = new PrismaClient();

async function main() {
  console.log("Starting seeding process...");

  await seedRoles();
  await seedUsers();
}

main().finally(() => prisma.$disconnect());
