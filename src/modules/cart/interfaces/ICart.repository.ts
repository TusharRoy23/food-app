import { Cart } from "../entity/cart.entity";

export interface ICartRepository {
    create(): Promise<string>;
    retrive(): Promise<Cart>;
    update(): Promise<string>;
    delete(): Promise<string>;
}