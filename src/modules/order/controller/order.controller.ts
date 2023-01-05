import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost, requestBody, queryParam } from "inversify-express-utils";
import { DtoValidationMiddleware } from "../../../middlewares/dto-validation.middleware";
import { User } from "../../../modules/user/entity/user.entity";
import { TYPES } from "../../../core/type.core";
import { OrderDto } from "../dto/order.dto";
import { IOrderService } from "../interfaces/IOrder.service";
import { pagination } from "../../../shared/utils/pagination.utils";
import { successResponse } from "../../../shared/utils/success.utils";

@controller('/order', TYPES.AuthenticationMiddleware)
export class OrderController {
    constructor(
        @inject(TYPES.IOrderService) private readonly orderService: IOrderService
    ) { }

    @httpPost('/', DtoValidationMiddleware(OrderDto))
    public async createOrder(
        @requestBody() orderDto: OrderDto,
        req: Request & { user: User },
        res: Response
    ) {
        const result = await this.orderService.submitOrder(orderDto, req.user.uuid);
        return res.status(201).json({
            'results': result
        });
    }

    @httpGet('/')
    public async getOrdersByUser(
        @queryParam("page") page: number,
        @queryParam("page_size") pageSize: number,
        req: Request & { user: User },
        res: Response
    ) {

        const result = await this.orderService.getOrdersByUser(req.user.uuid, pagination({ page, size: pageSize }));
        successResponse({ status: 200, result, res });
    }
}