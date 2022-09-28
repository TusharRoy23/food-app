import { OrderStatus } from "../../../shared/utils/enum";
import { isValidEnum } from "../../../shared/dto/custom.validator";

export class OrderStatusDto {
    @isValidEnum('order_status', OrderStatus)
    order_status: string;
}