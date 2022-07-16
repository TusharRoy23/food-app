import { inject, injectable } from "inversify";
import { CartReponse } from "../../../shared/utils/response.utils";
import { TYPES } from "../../../core/type.core";
import { CartDto } from "../dto/cart.dto";
import { Cart } from "../entity/cart.entity";
import { ICartRepository } from "../interfaces/ICart.repository";
import { ICartService } from "../interfaces/ICart.service";

@injectable()
export class CartService implements ICartService {
    constructor(
        @inject(TYPES.ICartRepository) private readonly cartRepo: ICartRepository
    ) { }

    async create(cartDto: CartDto, userId: number, restaurentUuid: string): Promise<CartReponse> {
        return await this.cartRepo.create(cartDto, userId, restaurentUuid);
    }
    retrive(): Promise<Cart> {
        throw new Error("Method not implemented.");
    }
    update(): Promise<string> {
        throw new Error("Method not implemented.");
    }
    delete(): Promise<string> {
        throw new Error("Method not implemented.");
    }

}