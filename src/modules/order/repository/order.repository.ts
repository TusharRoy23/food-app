import { inject, injectable } from "inversify";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { IDatabaseService } from "../../../core/interface/IDatabase.service";
import { TYPES } from "../../../core/type.core";
import { CartItem } from "../../../modules/cart/entity/cart-item.entity";
import { Cart } from "../../../modules/cart/entity/cart.entity";
import { BadRequestException, throwException } from "../../../shared/errors/all.exception";
import { ICartSharedRepo } from "../../../shared/interfaces/ICartShared.repository";
import { Order } from "../entity/order.entity";
import { IOrderRepository } from "../interfaces/IOrder.repository";
import { OrderItemResponse, OrderResponse, PaginatedOrderResponse, PaginationPayload } from "../../../shared/utils/response.utils";
import { OrderItem } from "../entity/order-item.entity";
import { CartStatus, CurrentStatus } from "../../../shared/utils/enum";
import { OrderDto } from "../dto/order.dto";
import { IRestaurentSharedRepo, IItemSharedRepository, IOrderSharedRepository } from "../../../shared/interfaces/IIndexShared.repository";
import { Item } from "../../../modules/item/entity/item.entity";
import { Restaurent } from "../../../modules/restaurent/entity/restaurent.entity";
import { getPaginationData } from "../../../shared/utils/pagination.utils";

@injectable()
export class OrderRepository implements IOrderRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
        @inject(TYPES.ICartSharedRepo) private readonly cartSharedRepo: ICartSharedRepo,
        @inject(TYPES.IRestaurentSharedRepo) private readonly sharedResRepo: IRestaurentSharedRepo,
        @inject(TYPES.IItemSharedRepo) private readonly sharedItemRepo: IItemSharedRepository,
        @inject(TYPES.IOrderSharedRepository) private readonly orderSharedRepo: IOrderSharedRepository,
    ) { }

    async getOrdersByUser(userUuid: string, pagination: PaginationPayload): Promise<PaginatedOrderResponse> {
        try {
            const repo = await this.database.getRepository(Order);
            const query = repo.createQueryBuilder('order')
                .innerJoinAndSelect("order.restaurent", "restaurent")
                .innerJoinAndSelect("order.user", "user")
                .where("user.uuid = :uuid", { uuid: userUuid })


            const total = await query.limit(pagination.limit)
                .offset(pagination.offset).getCount();
            const paginationData = getPaginationData({ total, page: pagination.currentPage, limit: pagination.limit });

            const orders: Order[] = await query
                .limit(pagination.limit)
                .offset(pagination.offset)
                .getMany();
            const orderResponse: OrderResponse[] = [];

            for (let index = 0; index < orders.length; index++) {
                const order = orders[index] as Order;
                const orderItem: OrderItem[] = await this.orderSharedRepo.getOrderItemInfo(order.uuid);
                const newOrderItem = orderItem.map((data: OrderItem) => ({
                    uuid: data.uuid,
                    qty: data.qty,
                    amount: data.amount,
                    total_amount: data.total_amount,
                    item: data.item,
                }) as OrderItem);

                orderResponse.push(
                    {
                        uuid: order.uuid,
                        serial_number: order.serial_number,
                        order_amount: order.order_amount,
                        total_amount: order.total_amount,
                        rebate_amount: order.rebate_amount,
                        order_date: order.order_date,
                        order_status: order.order_status,
                        paid_by: order.paid_by,
                        order_discount: order.order_discount,
                        user: order.user,
                        order_item: newOrderItem,
                    }
                );
            }

            const response: PaginatedOrderResponse = {
                orders: orderResponse,
                count: total,
                currentPage: paginationData.currentPage,
                totalPages: paginationData.totalPages,
                nextPage: paginationData.nextPage
            };

            return response;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async submitOrder(orderDto: OrderDto, userUuid: string): Promise<OrderResponse> {
        try {
            // step-1: check for valid cart & get all value from cart & cart item
            const cart: Cart = await this.cartSharedRepo.cartInfo(orderDto.uuid, userUuid);
            const cartItem: CartItem[] = await this.cartSharedRepo.cartItemsInfo(cart.id);
            const tempCartItem: CartItem[] = [];
            let orderAmount = 0;

            for (let index = 0; index < cartItem.length; index++) {
                const item = cartItem[index] as CartItem;
                const itemInfo: Item = await this.sharedItemRepo.restaurentItemInfo(item.item!.uuid, cart.restaurent.uuid);
                const discountRate = itemInfo?.discount_rate! > 0 ? itemInfo?.discount_rate! / 100 : 1;
                const amount = item.qty * (itemInfo.price * discountRate);
                orderAmount += amount;
                tempCartItem.push({
                    amount: itemInfo.price * item.qty,
                    qty: item.qty,
                    total_amount: amount,
                    id: item.id,
                    uuid: item.uuid,
                    item: itemInfo,
                });
            }

            let rebate_amount = 0; let total_amount = orderAmount;

            const discountInfo = await this.sharedResRepo.restaurentOrderDiscount(cart.restaurent.uuid);
            if (discountInfo.discount_rate > 0 && orderAmount <= discountInfo.max_amount && orderAmount >= discountInfo.min_amount) {
                rebate_amount = orderAmount * discountInfo.discount_rate;
                total_amount = orderAmount - rebate_amount;
            }

            const orderRepo = await this.database.getRepository(Order);

            // step-2: create the order first
            const order = new Order();
            order.uuid = uuidv4();
            order.user = cart.user;
            order.order_amount = orderAmount;
            order.total_amount = total_amount;
            order.rebate_amount = rebate_amount;
            order.order_date = moment().format('YYYY-MM-DD HH:mm:ss');
            order.restaurent = cart.restaurent;
            order.serial_number = `F-${Date.now()}`;
            if (rebate_amount > 0) {
                order.order_discount = discountInfo;
            }

            const orderInfo: Order = await orderRepo.save(order);
            const result: OrderResponse = {
                uuid: orderInfo.uuid,
                order_amount: orderInfo.order_amount,
                total_amount: orderInfo.total_amount,
                restaurent: orderInfo.restaurent,
                serial_number: orderInfo.serial_number,
                rebate_amount: orderInfo.rebate_amount,
                order_date: orderInfo.order_date,
                order_status: orderInfo.order_status,
                paid_by: orderInfo.paid_by,
                order_item: []
            };

            // step-3: with the cart item add to order item accordingly
            const orderItemRepo = await this.database.getRepository(OrderItem);
            await Promise.all(
                tempCartItem.map(async (ele) => {
                    const value: OrderItem = await orderItemRepo.save({
                        uuid: uuidv4(),
                        total_amount: ele.total_amount,
                        item: ele.item,
                        order: orderInfo,
                        qty: ele.qty,
                        amount: ele.amount,
                    });

                    delete value.item.restaurent;

                    result.order_item.push({
                        uuid: value.uuid,
                        qty: value.qty,
                        amount: value.amount,
                        total_amount: ele.total_amount,
                        item: value.item as Item,
                    } as OrderItemResponse);
                })
            );

            // step-4: Update cart
            const cartRepo = await this.database.getRepository(Cart);
            await cartRepo.createQueryBuilder().update(Cart).set({
                cart_status: CartStatus.APPROVED
            }).where("uuid = :uuid", { uuid: orderDto.uuid }).execute();

            return result as OrderResponse;
        } catch (error: any) {
            return throwException(error);
        }
    }

    private async getRestaurentInfo(uuid: string): Promise<Restaurent> {
        const restaurent: Restaurent = await this.sharedResRepo.restaurentInfo(uuid);
        if (Object.keys(restaurent.id) && restaurent.current_status == CurrentStatus.ACTIVE) {
            return restaurent;
        }
        throw new BadRequestException('Not allowed');
    }
}