import { Item } from "src/modules/item/entity/item.entity";

export interface IItemSharedRepository {
    restaurentItemInfo(uuid: string, restaurentUuid: string): Promise<Item>;
}