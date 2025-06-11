const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Payment {
      id: ID!
      order_id: Int!
      amount: Float!
      payment_method: String!
      payment_status: String!
      created_at: String
    }

    type Query {
      getPaymentByOrderId(order_id: Int!): [Payment]
    }

    type Mutation {
      createPayment(order_id: Int!, amount: Float!, payment_method: String!): Payment
    }
`);

module.exports = schema;