const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const resolvers = {
  Query: {
    products: async () => await prisma.product.findMany(),
    product: async (_, args) => await prisma.product.findUnique({ where: { id: args.id } })
  }
};

module.exports = resolvers;