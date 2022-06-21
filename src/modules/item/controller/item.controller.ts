import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPatch, httpPost, requestBody, requestParam } from "inversify-express-utils";
import { User } from "../../user/entity/user.entity";
import { TYPES } from "../../../core/type.core";
import { CreateItemDto, UpdateItemDto } from "../dto/index.dto";
import { IItemService } from "../interfaces/IItem.service";
import { DtoValidationMiddleware } from "../../../middlewares/dto-validation.middleware";
import { RoleMiddleware } from "../../../middlewares/role.middleware";

@controller('/item', TYPES.AuthenticationMiddleware, RoleMiddleware('owner'))
export class ItemController {
    constructor(
        @inject(TYPES.IItemService) private readonly itemService: IItemService
    ) { }

    @httpPost('/', DtoValidationMiddleware(CreateItemDto))
    public async create(
        @requestBody() body: CreateItemDto, req: Request & { user: User }, res: Response
    ) {
        const msg = await this.itemService.create(body, req.user.restaurent);
        return res.status(201).json({
            'message': msg
        });
    }

    @httpGet('/')
    public async retrive(req: Request & { user: User }, res: Response) {
        const results = await this.itemService.retrive(req.user.restaurent);
        return res.status(200).json({
            'results': results
        });
    }

    @httpPatch('/:uuid', DtoValidationMiddleware(UpdateItemDto))
    public async update(
        @requestBody() body: UpdateItemDto,
        @requestParam('uuid') uuid: string,
        req: Request & { user: User },
        res: Response
    ) {
        const result = await this.itemService.update(body, uuid, req.user.restaurent);
        return res.status(202).json({
            'results': result
        });
    }

    @httpDelete('/:uuid')
    public async delete(
        @requestParam('uuid') uuid: string, req: Request & { user: User }, res: Response
    ) {
        await this.itemService.delete(uuid, req.user.restaurent);
        return res.sendStatus(204);
    }
}