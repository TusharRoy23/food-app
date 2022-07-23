import { inject, injectable } from "inversify";
import { TYPES } from "../../../core/type.core";
import { CreateItemDto, UpdateItemDto } from "../dto/index.dto";
import { Item } from "../entity/item.entity";
import { IItemRepository } from "../interfaces/IItem.repository";
import { Restaurent } from "../../restaurent/entity/restaurent.entity";

@injectable()
export class ItemService implements IItemRepository {
    constructor(
        @inject(TYPES.IItemRepository) private readonly itemRepo: IItemRepository
    ) { }

    create(payload: CreateItemDto, restaurent: Restaurent): Promise<string> {
        return this.itemRepo.create(payload, restaurent);
    }
    retrive(restaurentUuid: string): Promise<Item[]> {
        return this.itemRepo.retrive(restaurentUuid);
    }
    update(payload: UpdateItemDto, uuid: string, restaurent: Restaurent): Promise<Item> {
        return this.itemRepo.update(payload, uuid, restaurent);
    }
    delete(uuid: string, restaurent: Restaurent): Promise<string> {
        return this.itemRepo.delete(uuid, restaurent);
    }
}