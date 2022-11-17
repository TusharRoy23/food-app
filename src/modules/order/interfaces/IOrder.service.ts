import { OrderResponse } from "../../../shared/utils/response.utils";
import { OrderDto } from "../dto/order.dto";

export interface IOrderService {
    submitOrder(orderDto: OrderDto, userUuid: string): Promise<OrderResponse>;
    getOrdersByUser(userUuid: string): Promise<OrderResponse[]>;
}