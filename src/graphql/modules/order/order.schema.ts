import { gql } from "apollo-server-express";

export default gql`
    type Order {
        uuid: ID!
        order_amount: Float!
        rebate_amount: Float!
        total_amount: Float!
        order_date: String!
        order_status: String!
        paid_by: String!
        serial_number: String!
        order_item: [OrderItem!]
        restaurent: Restaurent
        order_discount: OrderDiscount
    }

    type OrderItem {
        uuid: ID!
        qty: Int!
        amount: Float!
        total_amount: Float!
        item: Item!
    }

    type OrderDiscount {
        uuid: ID!
        max_amount: Float!
        min_amount: Float!
        discount_rate: Float!
        start_date: String!
        end_date: String!
    }

    input OrderInput {
        cart_uuid: String! @constraint(format: "uuid")
    }

    extend type Query {
        orders: [Order!]
    }

    extend type Mutation {
        createOrder(input: OrderInput!): Order
    }
` 