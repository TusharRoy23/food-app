import { CartItem } from "src/modules/cart/entity/cart-item.entity";
import { Item } from "src/modules/item/entity/item.entity";
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