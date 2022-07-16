import { CartReponse } from "../../../shared/utils/response.utils";
import { CartDto } from "../dto/cart.dto";
import { Cart } from "../entity/cart.entity";

export interface ICartRepository {
    create(cartDto: CartDto, userId: number, restaurentUuid: string): Promise<CartReponse>;
    retrive(): Promise<Cart>;
    update(): Promise<CartReponse>;
    itemUpdate(): Promise<CartReponse>;
    delete(): Promise<string>;
}