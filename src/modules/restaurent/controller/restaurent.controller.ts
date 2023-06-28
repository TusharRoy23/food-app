import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPatch, httpPost, requestBody, requestParam } from "inversify-express-utils";
import { DtoValidationMiddleware } from "../../../middlewares/dto-validation.middleware";
import { TYPES } from "../../../core/type.core";
import { RoleMiddleware } from "../../../middlewares/role.middleware";
import { User } from "../../user/entity/user.entity";
import { CreateOrderDiscountDto, UpdateOrderDiscountDto } from "../dto/index.dto";
import { IRestaurentService } from "../interfaces/IRestaurent.service";
@controller('/restaurent', TYPES.AuthenticationMiddleware, RoleMiddleware('owner'))
export class RestaurentController {
    constructor(
        @inject(TYPES.IRestaurentService) private readonly restaurentService: IRestaurentService
    ) { }

    @httpGet('/order-list/')
    public async getOrderList(
        req: Request & { user: User },
        res: Response,
    ) {
        const result = await this.restaurentService.getOrderList(req.user);
        return res.status(200).json({
            'result': result
        });
    }

    @httpPost('/release-order/:uuid')
    public async orderRelease(
        @requestParam('uuid') uuid: String,
        req: Request & { user: User },
        res: Response,
    ) {
        const result = await this.restaurentService.releaseOrder(uuid, req.user);
        return res.status(201).json({
            'result': result
        });
    }

    @httpPatch('/complete-order/:uuid')
    public async completeOrder(
        @requestParam('uuid') uuid: String,
        req: Request & { user: User },
        res: Response,
    ) {
        const result = await this.restaurentService.completeOrder(uuid, req.user);
        return res.status(201).json({
            'result': result
        });
    }

    @httpGet('/order-discount')
    public async getOrderDiscount(
        req: Request & { user: User },
        res: Response,
    ) {
        const result = await this.restaurentService.getOrderDiscount(req.user);
        return res.status(200).json({
            'result': result,
        });
    }

    @httpPost('/order-discount', DtoValidationMiddleware(CreateOrderDiscountDto))
    public async createOrderDiscount(
        @requestBody() orderDiscountDto: CreateOrderDiscountDto,
        req: Request & { user: User },
        res: Response,
    ) {
        const result = await this.restaurentService.createOrderDiscount(orderDiscountDto, req.user);
        return res.status(201).json({
            'result': result,
        });
    }

    @httpPatch('/order-discount/:uuid', DtoValidationMiddleware(UpdateOrderDiscountDto))
    public async updateOrderDiscount(
        @requestBody() orderDiscountDto: UpdateOrderDiscountDto,
        @requestParam('uuid') uuid: string,
        req: Request & { user: User },
        res: Response,
    ) {
        const result = await this.restaurentService.updateOrderDiscount(orderDiscountDto, req.user, uuid);
        return res.status(201).json({
            'result': result,
        });
    }

    @httpDelete('/order-discount/:uuid')
    public async deleteOrderDiscount(
        @requestParam('uuid') uuid: string,
        req: Request & { user: User },
        res: Response,
    ) {
        await this.restaurentService.deleteOrderDiscount(req.user, uuid);
        return res.statusCode = 204;
    }
}