import { inject, injectable } from "inversify";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { IDatabaseService } from "../../../core/interface/IDatabase.service";
import { TYPES } from "../../../core/type.core";
import { CartItem } from "../../../modules/cart/entity/cart-item.entity";
import { Cart } from "../../../modules/cart/entity/cart.entity";
import { InternalServerErrorException, NotFoundException } from "../../../shared/errors/all.exception";
import { ICartSharedRepo } from "../../../shared/interfaces/ICartShared.repository";
import { Order } from "../entity/order.entity";
import { IOrderRepository } from "../interfaces/IOrder.repository";
import { OrderItemResponse, OrderResponse } from "../../../shared/utils/response.utils";
import { OrderItem } from "../entity/order-item.entity";
import { CartStatus } from "../../../shared/utils/enum";
import { OrderDto } from "../dto/order.dto";

@injectable()
export class OrderRepository implements IOrderRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
        @inject(TYPES.ICartSharedRepo) private readonly cartSharedRepo: ICartSharedRepo,
    ) { }

    async submitOrder(orderDto: OrderDto, userUuid: string): Promise<OrderResponse> {
        try {
            // step-1: check for valid cart & get all value from cart & cart item
            const cart: Cart = await this.cartSharedRepo.cartInfo(orderDto.uuid, userUuid);
            const cartItem: CartItem[] = await this.cartSharedRepo.cartItemsInfo(cart.id);

            const orderRepo = await this.database.getRepository(Order);

            // step-2: create the order first
            const order = new Order();
            order.uuid = uuidv4();
            order.user = cart.user;
            order.order_amount = cart.cart_amount;
            order.order_date = moment().format('YYYY-MM-DD HH:mm:ss');
            order.restaurent = cart.restaurent;
            order.serial_number = `F-${Date.now()}`;

            const orderInfo: Order = await orderRepo.save(order);
            const result: OrderResponse = {
                uuid: orderInfo.uuid,
                order_amount: orderInfo.order_amount,
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
                cartItem.map(async (ele) => {
                    const value: OrderItem = await orderItemRepo.save({
                        uuid: uuidv4(),
                        item: ele.item,
                        order: orderInfo,
                        qty: ele.qty,
                        amount: ele.amount,
                        deduction_rate: 0.0
                    });

                    delete value.item.restaurent;

                    result['order_item'].push({
                        uuid: value.uuid,
                        qty: value.qty,
                        amount: value.amount,
                        item: value.item,
                        deduction_rate: value.deduction_rate,
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
            if (error instanceof NotFoundException) throw new NotFoundException(`${error.message}`);
            throw new InternalServerErrorException(`${error.message}`);
        }
    }
}