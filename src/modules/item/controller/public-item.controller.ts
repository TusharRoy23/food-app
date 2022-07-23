import { Request, Response } from "express";
import { inject } from "inversify";
import { controller, httpGet, requestParam } from "inversify-express-utils";
import { TYPES } from "../../../core/type.core";
import { IItemService } from "../interfaces/IItem.service";

@controller("/public/item")
export class PublicItemController {
    constructor(
        @inject(TYPES.IItemService) private readonly itemService: IItemService
    ) { }

    @httpGet("/:restaurentUuid")
    public async itemList(
        @requestParam("restaurentUuid") restaurentUuid: string,
        req: Request,
        res: Response
    ) {
        const results = await this.itemService.retrive(restaurentUuid);
        return res.status(200).json({
            'results': results
        });
    }
}