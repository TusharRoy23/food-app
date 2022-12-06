import { gql } from "apollo-server-express";
import CartSchema from "./modules/cart/cart.schema";
import OrderSchema from "./modules/order/order.schema";
import ItemSchema from "./modules/item/item.schema";
import RestaurentSchema from "./modules/restaurent/restaurent.schema";

const BaseSchema = gql`
    type Query {
        _:Boolean
    }

    type Mutation {
        _:Boolean
    }
`;

export default [BaseSchema, CartSchema, OrderSchema, ItemSchema, RestaurentSchema];