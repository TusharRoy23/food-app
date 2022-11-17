import { inject, injectable } from "inversify";
import { IDatabaseService } from "../../core/interface/IDatabase.service";
import { TYPES } from "../../core/type.core";
import { OrderItem } from "../../modules/order/entity/order-item.entity";
import { throwException } from "../errors/all.exception";
import { IOrderSharedRepository } from "../interfaces/IOrderShared.repository";

@injectable()
export class OrderSharedRepository implements IOrderSharedRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
    ) { }

    async getOrderItemInfo(orderUuid: string): Promise<OrderItem[]> {
        try {
            const repo = await this.database.getRepository(OrderItem);
            return await repo.createQueryBuilder('order_item')
                .innerJoinAndSelect("order_item.order", "order")
                .innerJoinAndSelect("order_item.item", 'item')
                .where("order.uuid = :uuid", { uuid: orderUuid })
                .getMany();
        } catch (error: any) {
            return throwException(error);
        }
    }

}