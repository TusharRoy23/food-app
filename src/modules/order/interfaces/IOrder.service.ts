import { OrderResponse, PaginatedOrderResponse, PaginationPayload } from "../../../shared/utils/response.utils";
import { OrderDto } from "../dto/order.dto";

export interface IOrderService {
    submitOrder(orderDto: OrderDto, userUuid: string): Promise<OrderResponse>;
    getOrdersByUser(userUuid: string, pagination: PaginationPayload): Promise<PaginatedOrderResponse>;
}