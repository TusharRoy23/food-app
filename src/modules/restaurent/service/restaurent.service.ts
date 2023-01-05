import { inject, injectable } from "inversify";
import { OrderDiscount } from "../../../modules/order/entity/order-discount.entity";
import { User } from "../../../modules/user/entity/user.entity";
import { TYPES } from "../../../core/type.core";
import { CreateOrderDiscountDto } from "../dto/create-order-discount.dto";
import { RegisterDto } from "../dto/register.dto";
import { UpdateOrderDiscountDto } from "../dto/update-order-discount.dto";
import { Restaurent } from "../entity/restaurent.entity";
import { IRestaurentRepository } from "../interfaces/IRestaurent.repository";
import { IRestaurentService } from "../interfaces/IRestaurent.service";
import { OrderResponse, PaginatedOrderResponse, PaginationPayload } from "../../../shared/utils/response.utils";
import { RatingDto } from "../dto/rating.dto";

@injectable()
export class RestaurentService implements IRestaurentService {
    constructor(
        @inject(TYPES.IRestaurentRepository) private restaurentRepo: IRestaurentRepository
    ) { }

    async getRestaurentList(): Promise<Restaurent[]> {
        return await this.restaurentRepo.getRestaurentList();
    }

    async getOrderList(user: User, pagination: PaginationPayload): Promise<PaginatedOrderResponse> {
        return await this.restaurentRepo.getOrderList(user, pagination);
    }

    async releaseOrder(orderUuid: String, user: User): Promise<String> {
        return await this.restaurentRepo.releaseOrder(orderUuid, user);
    }

    async completeOrder(orderUuid: String, user: User): Promise<String> {
        return await this.restaurentRepo.completeOrder(orderUuid, user);
    }

    async register(registerDto: RegisterDto): Promise<string> {
        return await this.restaurentRepo.register(registerDto);
    }

    async getOrderDiscount(user: User): Promise<OrderDiscount[]> {
        return await this.restaurentRepo.getOrderDiscount(user);
    }

    async createOrderDiscount(orderDiscountDto: CreateOrderDiscountDto, user: User): Promise<OrderDiscount> {
        return await this.restaurentRepo.createOrderDiscount(orderDiscountDto, user);
    }

    async updateOrderDiscount(orderDiscountDto: UpdateOrderDiscountDto, user: User, uuid: string): Promise<OrderDiscount> {
        return await this.restaurentRepo.updateOrderDiscount(orderDiscountDto, user, uuid);
    }

    async deleteOrderDiscount(user: User, uuid: string): Promise<boolean> {
        return await this.restaurentRepo.deleteOrderDiscount(user, uuid);
    }

    async giveRating(user: User, ratingDto: RatingDto): Promise<String> {
        return await this.restaurentRepo.giveRating(user, ratingDto);
    }

    async searchRestaurant(keyword: string): Promise<Restaurent[]> {
        return await this.restaurentRepo.searchRestaurant(keyword);
    }
}