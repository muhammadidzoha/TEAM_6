import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    orders: async () => {
      try {
        const orders = await prisma.order.findMany();
        return {
          order: orders ?? [],
          message: "Orders fetched successfully",
        };
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error("Failed to fetch orders");
      }
    },
    orderByUserId: async (_, { userId }) => {
      try {
        const data = await prisma.order.findMany({
          where: {
            userId,
          },
        });
        return {
          order: data ?? [],
          message: `success fetch order ${userId}`,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed fetch order by user id");
      }
    },
    orderItems: async () => {
      try {
        const orderItems = await prisma.orderItem.findMany();
        return {
          orderItem: orderItems ?? [],
          message: "success fetch order items",
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed fetch order items");
      }
    },
    orderItemByOrderId: async (_, { orderId }) => {
      try {
        const item = await prisma.orderItem.findMany({
          where: {
            orderId,
          },
        });
        return {
          orderItem: item ?? [],
          message: `Success fetch order ${orderId}`,
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch order item");
      }
    },
  },
  Mutation: {
    createOrder: async (_, { data }) => {
      try {
        const { userId, totalPrice } = data;

        const newOrder = await prisma.order.create({
          data: {
            userId,
            totalPrice,
          },
        });
        return {
          data: newOrder,
          message: "Success create order",
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed create order");
      }
    },
    createOrderItem: async (_, { data }) => {
      try {
        const { orderId, productId, quantity, price } = data;
        const newOrderItem = await prisma.orderItem.create({
          data: {
            orderId,
            productId,
            quantity,
            price,
          },
        });
        return {
          data: newOrderItem,
          message: "Success create order item",
        };
      } catch (error) {
        console.error(error);
        throw new Error("Failed create order item");
      }
    },
  },
};
