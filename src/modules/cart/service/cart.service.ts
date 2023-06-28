import { inject, injectable } from "inversify";
import { CartReponse } from "../../../shared/utils/response.utils";
import { TYPES } from "../../../core/type.core";
import { CartDto } from "../dto/cart.dto";
import { Cart } from "../entity/cart.entity";
import { ICartRepository } from "../interfaces/ICart.repository";
import { ICartService } from "../interfaces/ICart.service";
import { CartItemDto } from "../dto/cart-item.dto";

@injectable()
export class CartService implements ICartService {
    constructor(
        @inject(TYPES.ICartRepository) private readonly cartRepo: ICartRepository
    ) { }

    async create(cartItemDto: CartItemDto, userUuid: string, restaurentUuid: string): Promise<CartReponse> {
        return await this.cartRepo.create(cartItemDto, userUuid, restaurentUuid);
    }

    async retrieve(cartUuid: string, userUuid: string): Promise<CartReponse> {
        return await this.cartRepo.retrieve(cartUuid, userUuid);
    }

    async update(cartItemDto: CartItemDto, userUuid: string, cartUuid: string): Promise<CartReponse> {
        return await this.cartRepo.update(cartItemDto, userUuid, cartUuid);
    }

    async delete(itemUuid: string, cartUuid: string, userUuid: string): Promise<CartReponse> {
        return await this.cartRepo.delete(itemUuid, cartUuid, userUuid);
    }

}