export const typeDefs = `#graphql
  type Product {
    id: ID!
    userId: ID!
    name: String!
    description: String
    stock: Int!
    price: Float!
    imageUrl: String!
  }

  type ProductResponse {
    products: [Product!]!
    message: String!
  }

  type Query {
    products: ProductResponse!
    productById(id: ID!): ProductResponse!
  }
`;
