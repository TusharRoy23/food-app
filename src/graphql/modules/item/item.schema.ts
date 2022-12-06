import { gql } from "apollo-server-express";

export default gql`
    type Item {
        uuid: ID!
        name: String!
        icon: String
        image: String
        item_type: String!
        meal_type: String!
        meal_state: String!
        meal_flavor: String!
        price: Float!
        max_order_qty: Int
        min_order_qty: Int
        item_status: String!
        created_date: String
    }
`