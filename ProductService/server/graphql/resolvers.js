import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    products: async () => {
      try {
        const products = await prisma.product.findMany();
        return {
          products,
          message: "Products fetched successfully",
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch products");
      }
    },
    productById: async (_, { id }) => {
      try {
        const product = await prisma.product.findMany({
          where: {
            userId: id,
          },
        });

        if (!product || product.length === 0) {
          return {
            message: `Product not found`,
            products: [],
          };
        }

        return {
          products: product ?? [],
          message: `Product with id ${id} fetched successfully`,
        };
      } catch (error) {
        console.error(error);
        throw new Error(`Failed to fetch product by ${id}`);
      }
    },
  },
};
