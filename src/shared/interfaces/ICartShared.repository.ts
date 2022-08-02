import { CartItem } from "../../modules/cart/entity/cart-item.entity";
import { Cart } from "../../modules/cart/entity/cart.entity";

export interface ICartSharedRepo {
    cartInfo(uuid: string, userUuid: string): Promise<Cart>;
    cartItemInfo(cartUuid: string, itemUuid: string): Promise<CartItem>;
    cartItemsInfo(cartId: number): Promise<CartItem[]>;
}