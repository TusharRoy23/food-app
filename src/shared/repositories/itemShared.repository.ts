import { inject, injectable } from "inversify";
import { IDatabaseService } from "src/core/interface/IDatabase.service";
import { TYPES } from "../../core/type.core";
import { Item } from "../../modules/item/entity/item.entity";
import { InternalServerErrorException, NotFoundException } from "../errors/all.exception";
import { IItemSharedRepository } from "../interfaces/IItemShared.repository";

@injectable()
export class ItemSharedRepository implements IItemSharedRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
    ) { }

    async restaurentItemInfo(uuid: string, restaurentUuid: string): Promise<Item> {
        try {
            const repo = await this.database.getRepository(Item);
            const item: Item = await repo.createQueryBuilder('item')
                .innerJoinAndSelect("item.restaurent", "restaurent")
                .where("item.uuid = :uuid", { uuid: uuid })
                .andWhere("item.item_status = :item_status", { item_status: 'active' })
                .andWhere("restaurent.uuid = :restaurentUuid", { restaurentUuid: restaurentUuid })
                .getOne();

            if (item && Object.keys(item).length) {
                return item as Item;
            }
            throw new NotFoundException('Item not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException('Item not found');
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

}