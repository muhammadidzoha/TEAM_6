require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const typeDefs = require('./graphql/schema');
const resolvers = require('./graphql/resolvers');

async function startServer() {
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  const PORT = 5002;
  app.listen(PORT, () => {
    console.log(`🚀 ProductService ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();