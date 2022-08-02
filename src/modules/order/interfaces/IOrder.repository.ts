import { OrderResponse } from "../../../shared/utils/response.utils";
import { OrderDto } from "../dto/order.dto";

export interface IOrderRepository {
    submitOrder(orderDto: OrderDto, userUuid: string): Promise<OrderResponse>;
}