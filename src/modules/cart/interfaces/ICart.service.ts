import { CartReponse } from "../../../shared/utils/response.utils";
import { CartItemDto } from "../dto/cart-item.dto";
import { CartDto } from "../dto/cart.dto";
import { Cart } from "../entity/cart.entity";

export interface ICartService {
    create(cartItemDto: CartItemDto, userUuid: string, restaurentUuid: string): Promise<CartReponse>;
    retrieve(cartUuid: string, userUuid: string): Promise<CartReponse>;
    update(cartItemDto: CartItemDto, userUuid: string, cartUuid: string): Promise<CartReponse>;
    delete(itemUuid: string, cartUuid: string, userUuid: string): Promise<CartReponse>;
}