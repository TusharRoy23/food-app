import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpPost, requestBody, requestParam } from "inversify-express-utils";
import { User } from "../../../modules/user/entity/user.entity";
import { TYPES } from "../../../core/type.core";
import { CartDto } from "../dto/cart.dto";
import { ICartService } from "../interfaces/ICart.service";
import { DtoValidationMiddleware } from "../../../middlewares/dto-validation.middleware";

@controller('/cart')
export class CartController {
    constructor(
        @inject(TYPES.ICartService) private readonly cartService: ICartService
    ) { }

    @httpPost('/:uuid', DtoValidationMiddleware(CartDto))
    public async create(
        @requestBody() cartDto: CartDto,
        @requestParam('uuid') uuid: string,
        req: Request & { user: User },
        res: Response
    ) {
        const result = await this.cartService.create(cartDto, req?.user?.id, uuid);
        return res.status(201).json({
            'message': result
        });
    }
}