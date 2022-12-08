import { gql } from "apollo-server-express";

export default gql`
    type Restaurent {
        uuid: ID!
        name: String!
        address: String!
        current_status: String!
        profile_img: String!
        opening_time: String!
        closing_time: String!
    }

    extend type Query {
        restaurents: [Restaurent!]
    }
`