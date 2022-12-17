import { User } from "../../user/entity/index.entity";
import { OrderDiscount } from "../../../modules/order/entity/order-discount.entity";
import { CreateOrderDiscountDto, RatingDto, RegisterDto, UpdateOrderDiscountDto } from "../dto/index.dto";
import { Restaurent } from "../entity/restaurent.entity";
import { OrderResponse } from "../../../shared/utils/response.utils";

export interface IRestaurentRepository {
    register(registerDto: RegisterDto): Promise<string>;
    getRestaurentList(): Promise<Restaurent[]>;
    getOrderList(user: User): Promise<OrderResponse[]>;
    releaseOrder(orderUuid: String, user: User): Promise<String>;
    completeOrder(orderUuid: String, user: User): Promise<String>;
    getOrderDiscount(user: User): Promise<OrderDiscount[]>;
    createOrderDiscount(orderDiscountDto: CreateOrderDiscountDto, user: User): Promise<OrderDiscount>;
    updateOrderDiscount(orderDiscountDto: UpdateOrderDiscountDto, user: User, uuid: string): Promise<OrderDiscount>;
    deleteOrderDiscount(user: User, uuid: string): Promise<boolean>;
    giveRating(user: User, ratingDto: RatingDto): Promise<String>;
    searchRestaurant(keyword: string): Promise<Restaurent[]>;
}