const { gql } = require('apollo-server-express');

const typeDefs = gql`
  enum PaymentStatus {
    pending
    completed
    failed
  }

  type Product {
    id: Int!
    name: String!
    description: String!
    image: String!
  }

  type PaymentHistory {
    id: Int!
    order_id: Int
    user_id: Int
    amount: Float
    payment_method: String
    payment_status: PaymentStatus
    created_at: String
    products: [Product!]!
  }

  type Query {
    paymentHistories: [PaymentHistory!]!
    paymentHistory(id: Int!): PaymentHistory
    userPaymentHistory(userId: Int!): [PaymentHistory!]!
  }

  input CreatePaymentHistoryInput {
    orderId: Int!
    userId: Int!
    amount: Float!
    paymentMethod: String!
    paymentStatus: PaymentStatus!
  }

  type Mutation {
    createPaymentHistory(input: CreatePaymentHistoryInput!): PaymentHistory!
    updatePaymentStatus(id: Int!, status: PaymentStatus!): PaymentHistory!
  }
`;

module.exports = typeDefs;