import { inject, injectable } from "inversify";
import { TYPES } from "../../../core/type.core";
import { OrderResponse } from "../../../shared/utils/response.utils";
import { OrderDto } from "../dto/order.dto";
import { IOrderRepository } from "../interfaces/IOrder.repository";
import { IOrderService } from "../interfaces/IOrder.service";

@injectable()
export class OrderService implements IOrderService {
    constructor(
        @inject(TYPES.IOrderRepository) private readonly orderRepository: IOrderRepository
    ) { }

    async submitOrder(orderDto: OrderDto, userUuid: string): Promise<OrderResponse> {
        return await this.orderRepository.submitOrder(orderDto, userUuid);
    }
}