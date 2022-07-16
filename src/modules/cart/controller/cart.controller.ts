import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpPost, requestBody, requestParam } from "inversify-express-utils";
import { User } from "../../../modules/user/entity/user.entity";
import { TYPES } from "../../../core/type.core";
import { CartDto } from "../dto/cart.dto";
import { ICartService } from "../interfaces/ICart.service";
import { DtoValidationMiddleware } from "../../../middlewares/dto-validation.middleware";
import { CartItemDto } from "../dto/cart-item.dto";

@controller('/cart', TYPES.AuthenticationMiddleware)
export class CartController {
    constructor(
        @inject(TYPES.ICartService) private readonly cartService: ICartService
    ) { }

    @httpPost('/restaurent/:uuid', DtoValidationMiddleware(CartDto))
    public async create(
        @requestBody() cartDto: CartDto,
        @requestParam('uuid') restaurentUuid: string,
        req: Request & { user: User },
        res: Response
    ) {
        const result = await this.cartService.create(cartDto, req?.user?.id, restaurentUuid);
        return res.status(201).json({
            'result': result
        });
    }

    @httpPost('/:uuid/restaurent/:restaurentUuid', DtoValidationMiddleware(CartItemDto))
    public async update(
        @requestBody() cartItemDto: CartItemDto,
        @requestParam('uuid') cartUuid: string,
        @requestParam('restaurentUuid') restaurentUuid: string,
        req: Request & { user: User },
        res: Response
    ) {
        console.log('cartUuid: ', cartUuid);
        console.log('restaurentUuid: ', restaurentUuid);
        return res.status(201).json({
            'result': ''
        });
    }
}