import { gql } from "apollo-server-express";

export const GET_RESTAURENTS = gql`
    query {
        restaurents {
            uuid
            name
            address
            current_status
        }
    }
`;
