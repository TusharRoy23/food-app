import { CartDto } from "../dto/cart.dto";
import { Cart } from "../entity/cart.entity";

export interface ICartService {
    create(cartDto: CartDto, userId: number, restaurentUuid: string): Promise<string>;
    retrive(): Promise<Cart>;
    update(): Promise<string>;
    delete(): Promise<string>;
}