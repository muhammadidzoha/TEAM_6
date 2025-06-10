export const typeDefs = `#graphql

  type Role {
    id: ID!
    name: String!
  }

  type User {
    id: ID!
    name: String!
    username: String!
    password: String
    roleId: ID!
  }

  type Address {
    id: ID!
    userId: ID!
    street: String!
    BuildingNumber: String!
    RT: String!
    RW: String!
    subDistrict: String
    village: String
    district: String!
    city: String
    regency: String
    province: String!
    postalCode: String!
  }

  type Account {
    id: ID!
    name: String!
    username: String!
    password: String
    role: Role
    addresses: [Address!]!
  }

  type Query {
    users: [Account!]!
  }

  type LoginResponse {
    message: String!
  }

  type RegisterResponse {
    user: User!
    message: String!
  }

  type createAddressResponse {
    account: Account!
    message: String!
  }

  type updateAddressResponse {
    account: Account!
    message: String!
  }

  input RegisterUser {
    name: String!
    username: String!
    password: String!
    roleId: ID!
  }

  input LoginUser {
    username: String!
    password: String!
  }

  input AddressInputOnUser {
    street: String!
    BuildingNumber: String!
    RT: Int!
    RW: Int!
    subDistrict: String
    village: String
    district: String!
    city: String
    regency: String
    province: String!
    postalCode: String!
  }

  input AddressUpdateOnUser {
    street: String
    BuildingNumber: String
    RT: Int
    RW: Int
    subDistrict: String
    village: String
    district: String
    city: String
    regency: String
    province: String
    postalCode: String
  }


  type Mutation {
    loginUser(data: LoginUser!): LoginResponse!
    registerUser(data: RegisterUser!): RegisterResponse!
    createUserAddress(id: ID!, data: AddressInputOnUser!): createAddressResponse!
    updateUserAddress(id: ID!, addressId: ID!, data: AddressUpdateOnUser!): updateAddressResponse!
  }

`;
