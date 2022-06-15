import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpPost, requestBody } from "inversify-express-utils";
import { TYPES } from "../../../core/type.core";
import { RegisterDto } from "../dto/index.dto";
import { IRestaurentService } from "../interfaces/IRestaurent.service";
import { DtoValidationMiddleware } from "../../../middlewares/dto-validation.middleware";

@controller('/restaurent')
export class RestaurentController {
    constructor(
        @inject(TYPES.IRestaurentService) private readonly restaurentService: IRestaurentService
    ) { }

    @httpPost('/register', DtoValidationMiddleware(RegisterDto))
    public async register(
        @requestBody() body: RegisterDto, req: Request, res: Response
    ) {
        const msg = await this.restaurentService.register(body);
        return res.status(201).json({
            'message': msg
        });
    }
}