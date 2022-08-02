import { CartItem } from "src/modules/cart/entity/cart-item.entity";
import { Item } from "src/modules/item/entity/item.entity";
import { Restaurent } from "src/modules/restaurent/entity/restaurent.entity";
import { User } from "../../modules/user/entity/user.entity";
import { OrderStatus, PaidBy } from "./enum";

export class UserResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export class TokenResponse {
    accessToken: string;
    refreshToken: string;
}

export class CartReponse {
    uuid: string;
    cart_amount: number;
    cart_date: string;
    cart_status: string;
    cart_item: CartItemResponse[]
}

export class CartItemResponse {
    uuid: string;
    qty: number;
    amount: number;
    item: Item;
}

export class OrderResponse {
    uuid: string;
    order_amount: number;
    restaurent: Restaurent;
    serial_number: string;
    rebate_amount: number;
    order_date: string;
    order_status: string;
    paid_by: string;
    order_item: OrderItemResponse[]
}

export class OrderItemResponse {
    uuid: string;
    qty: number;
    amount: number;
    deduction_rate: number;
    item: Item;
}