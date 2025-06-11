export const typeDefs = `#graphql

  type Order {
    id: ID!
    userId: ID!
    totalPrice: Float!
  }

  type OrderResponse {
    order: [Order!]!
    message: String!
  }

  type OrderItem {
    id: ID!
    orderId: ID!
    productId: ID!
    quantity: Int!
    price: Float!
  }

  type OrderItemResponse {
    orderItem: [OrderItem!]!
    message: String!
  }

  type Query {
    orders: OrderResponse!
    orderByUserId(userId: ID!): OrderResponse!
    orderItems: OrderItemResponse!
    orderItemByOrderId(orderId: ID!): OrderItemResponse!
  }

  input createOrder {
    userId: ID!
    totalPrice: Float!
  }

  type createOrderResponse {
    data: Order!
    message: String!
  }

  input createOrderItem {
    orderId: ID!
    productId: ID!
    quantity: Int!
    price: Float!
  }

  type createOrderItemResponse {
    data: OrderItem!
    message: String!
  }

  type Mutation {
    createOrder(data: createOrder!): createOrderResponse!
    createOrderItem(data: createOrderItem!): createOrderItemResponse!
  }
`;
