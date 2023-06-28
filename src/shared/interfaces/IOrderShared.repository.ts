import { OrderItem } from "../../modules/order/entity/order-item.entity";

export interface IOrderSharedRepository {
    getOrderItemInfo(orderUuid: string): Promise<OrderItem[]>;
}