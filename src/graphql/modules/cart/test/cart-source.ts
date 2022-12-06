import { gql } from "apollo-server-express";

export const CREATE_CART = gql`
    mutation createCart($input: CartCreateInput!) {
        createCart(input: $input) {
            uuid
            total_amount
        }
    }
`;

export const UPDATE_CART = gql`
    mutation updateCart($input: CartUpdateInput!) {
        updateCart(input: $input) {
            uuid
            total_amount
        }
    }
`;

export const DELETE_CART = gql`
    mutation deleteCart($input: CartDeleteInput!) {
        deleteCart(input: $input) {
            uuid
            total_amount
        }
    }
`;

export const GET_CART_INFO = gql`
    query Query ($input: CartUuid!){
        cartInfo(input: $input) {
            uuid
            total_amount
        }
    }
`;