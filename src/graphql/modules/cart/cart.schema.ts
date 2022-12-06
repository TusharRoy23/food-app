import { gql } from "apollo-server-express";

export default gql`
    type Cart {
        uuid: ID!
        cart_amount: Float!
        total_amount: Float!
        rebate_amount: Float!
        cart_date: String!
        cart_status: String!
        cart_item: [CartItem!]
    }

    type CartItem {
        uuid: ID!
        qty: Int!
        amount: Float!
        total_amount: Float!
        item: Item!
    }

    input CartCreateInput {
        uuid: String! @constraint(format: "uuid")
        qty: Int! @constraint(min: 1)
        restaurent_uuid: String! @constraint(format: "uuid")
    }

    input CartUpdateInput {
        uuid: String! @constraint(format: "uuid")
        qty: Int! @constraint(min: 1)
        cart_uuid: String! @constraint(format: "uuid")
    }

    input CartDeleteInput {
        cart_uuid: String! @constraint(format: "uuid")
        item_uuid: String! @constraint(format: "uuid")
    }

    input CartUuid {
        uuid: String! @constraint(format: "uuid")
    }

    extend type Query {
        cartInfo(input: CartUuid!): Cart!
    }

    extend type Mutation {
        createCart(input: CartCreateInput!): Cart
        updateCart(input: CartUpdateInput!): Cart
        deleteCart(input: CartDeleteInput!): Cart
    }
`