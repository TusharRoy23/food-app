import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, requestParam } from "inversify-express-utils";
import { TYPES } from "../../../core/type.core";
import { RoleMiddleware } from "../../../middlewares/role.middleware";
import { User } from "../../user/entity/user.entity";
import { IRestaurentService } from "../interfaces/IRestaurent.service";
@controller('/restaurent', TYPES.AuthenticationMiddleware, RoleMiddleware('owner'))
export class RestaurentController {
    constructor(
        @inject(TYPES.IRestaurentService) private readonly restaurentService: IRestaurentService
    ) { }

    @httpGet('/order-list/:status')
    public async getOrderList(
        @requestParam('status') orderStatus: string,
        req: Request & { user: User },
        res: Response,
    ) { // Get order list with all status

    }
}