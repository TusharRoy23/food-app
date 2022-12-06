import { gql } from "apollo-server-express";

export const ORDER_LIST = gql`
    query OrderList {
        orders {
            uuid
            total_amount
            serial_number
            restaurent {
                uuid
                name,
                address
            }
            order_item {
                uuid
                item {
                    uuid
                    name
                }
            }
        }
    }
`;

export const CREATE_ORDER = gql`
    mutation createOrder($input: OrderInput!) {
        createOrder(input: $input) {
            uuid
            total_amount
            serial_number
        }
    }
`;

export const ERROR_CREATE_ORDER = gql`
    mutation createOrder($input: OrderInput!) {
        createOrder(input: $input) {
            uuid
            total_amount
            serial_number
            test
        }
    }
`;
