import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    users: async () => {
      try {
        return await prisma.user.findMany({
          include: {
            role: true,
            addresses: true,
          },
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error("Failed to fetch users");
      }
    },
  },
  Mutation: {
    loginUser: async (_, { data }) => {
      try {
        const { username, password } = data;
        const user = await prisma.user.findUnique({
          where: {
            username,
          },
        });

        if (!user || user.password !== password) {
          throw new Error("Invalid username or password");
        }

        return { message: "Login successful" };
      } catch (error) {
        console.error("Error logging in user:", error);
        throw new Error("Failed to login user");
      }
    },
    registerUser: async (_, { data }) => {
      try {
        const { name, username, password, roleId } = data;
        const user = await prisma.user.create({
          data: {
            name,
            username,
            password,
            roleId: parseInt(roleId, 10),
          },
        });
        return { user, message: "User registered successfully" };
      } catch (error) {
        console.error("Error registering user:", error);
        throw new Error("Failed to register user");
      }
    },
    createUserAddress: async (_, { id, data }) => {
      try {
        const {
          street,
          BuildingNumber,
          RT,
          RW,
          subDistrict,
          village,
          district,
          city,
          regency,
          province,
          postalCode,
        } = data;

        const newAddress = await prisma.user.update({
          where: { id },
          include: {
            addresses: true,
          },
          data: {
            addresses: {
              create: {
                street,
                BuildingNumber,
                RT: parseInt(RT, 10),
                RW: parseInt(RW, 10),
                subDistrict,
                village,
                district,
                city,
                regency,
                province,
                postalCode,
              },
            },
          },
        });
        return {
          account: newAddress,
          message: "User address registered successfully",
        };
      } catch (error) {
        console.error("Error registering user address:", error);
        throw new Error("Failed to register user address");
      }
    },
    updateUserAddress: async (_, { id, addressId, data }) => {
      try {
        const updateData = Object.fromEntries(
          Object.entries(data).filter(([_, v]) => v !== undefined)
        );

        if (updateData.RT !== undefined)
          updateData.RT = parseInt(updateData.RT, 10);
        if (updateData.RW !== undefined)
          updateData.RW = parseInt(updateData.RW, 10);

        const newAddress = await prisma.user.update({
          where: { id },
          include: {
            addresses: true,
          },
          data: {
            addresses: {
              update: {
                where: { id: addressId },
                data: updateData,
              },
            },
          },
        });
        return {
          account: newAddress,
          message: "User address updated successfully",
        };
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
      }
    },
  },
};
