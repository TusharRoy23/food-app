import { inject, injectable } from "inversify";
import { TYPES } from "../../../core/type.core";
import { v4 as uuidv4 } from 'uuid';
import { Item } from "../entity/item.entity";
import { IItemRepository } from "../interfaces/IItem.repository";
import { IDatabaseService } from "../../../core/interface/IDatabase.service";
import { InternalServerErrorException, NotFoundException } from "../../../shared/errors/all.exception";
import { CreateItemDto, UpdateItemDto } from "../dto/index.dto";
import { Restaurent } from "../../restaurent/entity/restaurent.entity";
import { ItemStatus } from "../../../shared/utils/enum";

@injectable()
export class ItemRepository implements IItemRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService
    ) { }

    async create(payload: CreateItemDto, restaurent: Restaurent): Promise<string> {
        try {
            const item = {
                ...payload,
                restaurent,
                uuid: uuidv4()
            };
            const itemRepo = await this.database.getRepository(Item);
            await itemRepo.save(item);

            return 'Item successfully created';
        } catch (error: any) {
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    async retrive(restaurent: Restaurent): Promise<Item[]> {
        try {
            const itemRepo = await this.database.getRepository(Item);
            const item: Item[] = await itemRepo.createQueryBuilder("item")
                .innerJoin("item.restaurent", "restaurent")
                .where("restaurent.id = :id", { id: restaurent.id })
                .getMany();

            return item as Item[];
        } catch (error: any) {
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    async update(payload: UpdateItemDto, uuid: string, restaurent: Restaurent): Promise<Item> {
        try {
            const item: Item = await this.getByUuid(uuid, restaurent.id);
            const repo = await this.database.getRepository(Item);

            const updatedItem = await repo.createQueryBuilder()
                .update(Item)
                .set(payload)
                .where("id = :id", { id: item.id })
                .output([
                    'uuid', 'name', 'icon', 'image', 'item_type',
                    'meal_type', 'meal_state', 'meal_flavor', 'price',
                    'discount_start_date', 'discount_end_date', 'discount_rate',
                    'item_status'
                ])
                .execute();

            return updatedItem.raw[0] as Item;
        } catch (error: any) {
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    async delete(uuid: string, restaurent: Restaurent): Promise<string> {
        try {
            const result: Item = await this.getByUuid(uuid, restaurent.id);
            const repo = await this.database.getRepository(Item);

            await repo.createQueryBuilder()
                .update(Item)
                .set({ item_status: ItemStatus.DELETED })
                .where("id = :id", { id: result.id })
                .execute();

            return 'Successfully deleted';
        } catch (error: any) {
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    private async getByUuid(uuid: string, restaurentId: number) {
        try {
            const repo = await this.database.getRepository(Item);
            const item: Item = await repo.createQueryBuilder("item")
                .innerJoinAndSelect("item.restaurent", "restaurent")
                .where("item.uuid = :uuid", { uuid: uuid })
                .andWhere("restaurent.id = :id", { id: restaurentId })
                .getOne();

            if (item && Object.keys(item)) {
                return item as Item;
            }
            throw new NotFoundException('Item Not Found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException('Item Not Found');
            throw new InternalServerErrorException(`${error.message}`);
        }
    }
}