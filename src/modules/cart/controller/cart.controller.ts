import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPatch, httpPost, requestBody, requestParam } from "inversify-express-utils";
import { User } from "../../../modules/user/entity/user.entity";
import { TYPES } from "../../../core/type.core";
import { ICartService } from "../interfaces/ICart.service";
import { DtoValidationMiddleware } from "../../../middlewares/dto-validation.middleware";
import { CartItemDto } from "../dto/cart-item.dto";

@controller('/cart', TYPES.AuthenticationMiddleware)
export class CartController {
    constructor(
        @inject(TYPES.ICartService) private readonly cartService: ICartService
    ) { }

    @httpPost('/restaurent/:uuid', DtoValidationMiddleware(CartItemDto))
    public async create(
        @requestBody() cartItemDto: CartItemDto,
        @requestParam('uuid') restaurentUuid: string,
        req: Request & { user: User },
        res: Response
    ) {
        const result = await this.cartService.create(cartItemDto, req?.user?.uuid, restaurentUuid);
        return res.status(201).json({
            'result': result
        });
    }

    @httpPost('/:uuid', DtoValidationMiddleware(CartItemDto))
    public async update(
        @requestBody() cartItemDto: CartItemDto,
        @requestParam('uuid') cartUuid: string,
        req: Request & { user: User },
        res: Response
    ) {
        const result = await this.cartService.update(cartItemDto, req?.user?.uuid, cartUuid);
        return res.status(201).json({
            'result': result
        });
    }

    @httpDelete('/:uuid/:itemUuid')
    public async deleteCartItem(
        @requestParam('uuid') cartUuid: string,
        @requestParam('itemUuid') itemUuid: string,
        req: Request & { user: User },
        res: Response
    ) {
        const result = await this.cartService.delete(itemUuid, cartUuid, req?.user.uuid);
        return res.status(201).json({
            'result': result
        });
    }

    @httpGet("/:uuid")
    public async retriveCart(
        @requestParam('uuid') cartUuid: string,
        req: Request & { user: User },
        res: Response
    ) {
        const result = await this.cartService.retrieve(cartUuid, req?.user.uuid);
        return res.status(200).json({
            'result': result
        });
    }
}