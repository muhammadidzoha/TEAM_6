const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Product {
    id: Int!
    name: String!
    description: String!
    price: Float!
    stock: Int!
    sellerName: String!
    userId: Int!
    image: String!
  }

  type Query {
    products: [Product!]!
    product(id: Int!): Product
  }
`;

module.exports = typeDefs;