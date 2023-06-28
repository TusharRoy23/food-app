import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, httpPost, requestBody } from "inversify-express-utils";
import { TYPES } from "../../../core/type.core";
import { RegisterDto } from "../dto/index.dto";
import { IRestaurentService } from "../interfaces/IRestaurent.service";
import { DtoValidationMiddleware } from "../../../middlewares/dto-validation.middleware";
import { RatingDto } from "../dto/index.dto";
import { User } from "../../../modules/user/entity/index.entity";

@controller('/public/restaurent')
export class PublicRestaurentController {
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

    @httpGet('/list')
    public async list(req: Request, res: Response) {
        const list = await this.restaurentService.getRestaurentList();
        return res.status(200).json({
            'results': list
        });
    }

    @httpPost('/rating', TYPES.AuthenticationMiddleware, DtoValidationMiddleware(RatingDto))
    public async giveRating(
        @requestBody() body: RatingDto,
        req: Request & { user: User }, res: Response
    ) {
        const result = await this.restaurentService.giveRating(req.user, body);
        return res.status(201).json({
            'message': result
        });
    }
}