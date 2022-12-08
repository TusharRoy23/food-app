import { Item } from "../entity/item.entity";
import { CreateItemDto, UpdateItemDto } from "../dto/index.dto";
import { Restaurent } from "../../restaurent/entity/restaurent.entity";

export interface IItemRepository {
    create(payload: CreateItemDto, restaurent: Restaurent): Promise<string>;
    retrive(restaurentUuid: string): Promise<Item[]>;
    update(payload: UpdateItemDto, uuid: string, restaurent: Restaurent): Promise<Item>;
    delete(uuid: string, restaurent: Restaurent): Promise<string>;
}