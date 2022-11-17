import { OrderDiscount } from "../../modules/order/entity/order-discount.entity";
import { Restaurent } from "../../modules/restaurent/entity/restaurent.entity";

export interface IRestaurentSharedRepo {
    restaurentInfo(uuid: string): Promise<Restaurent>;
    restaurentOrderDiscount(uuid: string): Promise<OrderDiscount>;
}