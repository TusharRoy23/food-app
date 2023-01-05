
import { Item } from "../../modules/item/entity/item.entity";
import { OrderDiscount } from "../../modules/order/entity/order-discount.entity";
import { Restaurent } from "../../modules/restaurent/entity/restaurent.entity";
import { User } from "../../modules/user/entity/user.entity";

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
    total_amount: number;
    rebate_amount: number;
    cart_date: string;
    cart_status: string;
    cart_item: CartItemResponse[]
}

export class CartItemResponse {
    uuid: string;
    qty: number;
    amount: number;
    total_amount: number;
    item?: Item;
}

export class OrderResponse {
    uuid: string;
    order_amount: number;
    total_amount: number;
    restaurent?: Restaurent;
    serial_number: string;
    rebate_amount: number;
    order_date: string;
    order_status: string;
    paid_by: string;
    order_item: OrderItemResponse[];
    order_discount?: OrderDiscount;
    user?: User;
}

export class OrderItemResponse {
    uuid: string;
    qty: number;
    amount: number;
    total_amount: number;
    item: Item;
}

export class PaginatedOrderResponse {
    orders: OrderResponse[];
    count: number;
    currentPage: number;
    totalPages: number;
    nextPage: number;
}

export class PaginationPayload {
    limit: number;
    offset: number;
    currentPage: number;
}
export class PaginationDataResponse {
    count: number;
    currentPage: number;
    totalPages: number;
    nextPage: number;
}