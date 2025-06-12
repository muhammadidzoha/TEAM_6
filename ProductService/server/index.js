import express from "express";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import http from "http";
import { typeDefs } from "./graphql/schema.js";
import { resolvers } from "./graphql/resolvers.js";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

(async () => {
  await server.start();
  server.applyMiddleware({ app });

  httpServer.listen({ port: 5002 }, () => {
    console.log(
      `🚀 Server ready at http://localhost:5002${server.graphqlPath}`
    );
  });
})();
