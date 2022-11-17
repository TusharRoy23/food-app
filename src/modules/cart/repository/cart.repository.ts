import { inject, injectable } from "inversify";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { TYPES } from "../../../core/type.core";
import { IDatabaseService } from "../../../core/interface/IDatabase.service";
import { ICartRepository } from "../interfaces/ICart.repository";
import { BadRequestException, throwException, NotFoundException } from "../../../shared/errors/all.exception";
import { Item } from "../../item/entity/item.entity";
import { CartItem, Cart } from "../entity/index.entity";
import { CartItemResponse, CartReponse } from "../../../shared/utils/response.utils";
import { CartItemDto } from "../dto/cart-item.dto";
import { IItemSharedRepository, IRestaurentSharedRepo, IUserSharedRepo, ICartSharedRepo } from "../../../shared/interfaces/IIndexShared.repository";
import { Restaurent } from "../../../modules/restaurent/entity/restaurent.entity";
import { CurrentStatus } from "../../../shared/utils/enum";

@injectable()
export class CartRepository implements ICartRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
        @inject(TYPES.ICartSharedRepo) private readonly sharedCartRepo: ICartSharedRepo,
        @inject(TYPES.IRestaurentSharedRepo) private readonly sharedResRepo: IRestaurentSharedRepo,
        @inject(TYPES.IUserSharedRepo) private readonly sharedUserRepo: IUserSharedRepo,
        @inject(TYPES.IItemSharedRepo) private readonly sharedItemRepo: IItemSharedRepository,
    ) { }

    async create(cartItemDto: CartItemDto, userUuid: string, restaurentUuid: string): Promise<CartReponse> {
        try {
            const restaurentInfo = await this.getRestaurentInfo(restaurentUuid);
            const itemInfo: Item = await this.sharedItemRepo.restaurentItemInfo(cartItemDto.uuid, restaurentUuid);
            const cartRepo = await this.database.getRepository(Cart);

            if (
                (typeof itemInfo.max_order_qty === 'number' && itemInfo.max_order_qty < cartItemDto.qty) ||
                (typeof itemInfo.min_order_qty === 'number' && itemInfo.min_order_qty > cartItemDto.qty)
            ) {
                throw new BadRequestException(`order qty should be between ${itemInfo.min_order_qty} To ${itemInfo.max_order_qty}`);
            }

            const cartItemRepo = await this.database.getRepository(CartItem);
            const userInfo = await this.sharedUserRepo.userInfo(userUuid);

            const cart = new Cart();
            cart.uuid = uuidv4();
            cart.restaurent = restaurentInfo;
            cart.user = userInfo;
            cart.rebate_amount = 0.0;

            let discountRate = itemInfo.discount_rate > 0 ? itemInfo.discount_rate / 100 : 1;
            let cartAmount = cartItemDto.qty * itemInfo.price;
            let itemTotalAmount = cartItemDto.qty * (itemInfo.price * discountRate);
            cart.total_amount = itemTotalAmount;

            const discountInfo = await this.sharedResRepo.restaurentOrderDiscount(restaurentUuid);
            if (discountInfo.discount_rate > 0 && cart.total_amount <= discountInfo.max_amount && cart.total_amount >= discountInfo.min_amount) {
                cart.rebate_amount = cart.total_amount * discountInfo.discount_rate;
                cart.total_amount = cart.total_amount - cart.rebate_amount;
                cart.order_discount = discountInfo;
            }

            cart.cart_amount = cartAmount;
            cart.cart_date = moment().format('YYYY-MM-DD HH:mm:ss');

            const cart_info: Cart = await cartRepo.save(cart);

            const result: CartReponse = {
                uuid: cart_info.uuid,
                cart_amount: cart_info.cart_amount,
                total_amount: cart_info.total_amount,
                rebate_amount: cart_info.rebate_amount,
                cart_date: cart_info.cart_date,
                cart_status: cart_info.cart_status,
                cart_item: []
            };

            const cartItem: CartItem = await cartItemRepo.save({
                uuid: uuidv4(),
                item: itemInfo,
                qty: cartItemDto.qty,
                amount: cartAmount,
                total_amount: itemTotalAmount,
                cart: cart_info
            });
            result['cart_item'].push({
                uuid: cartItem.uuid,
                qty: cartItem.qty,
                amount: cartItem.amount,
                total_amount: cartItem.total_amount,
                item: cartItem.item,
            });

            return result as CartReponse;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async retrieve(cartUuid: string, userUuid: string): Promise<CartReponse> {
        try {
            const cartInfo = await this.sharedCartRepo.cartInfo(cartUuid, userUuid);
            const cartItemInfo = await this.sharedCartRepo.cartItemsInfo(cartInfo.id);

            const result: CartReponse = {
                uuid: cartInfo.uuid,
                cart_amount: cartInfo.cart_amount,
                total_amount: cartInfo.total_amount,
                rebate_amount: cartInfo.rebate_amount,
                cart_date: cartInfo.cart_date,
                cart_status: cartInfo.cart_status,
                cart_item: []
            };

            for (const item of cartItemInfo) {
                result.cart_item.push({
                    uuid: item.uuid,
                    amount: item.amount,
                    total_amount: item.total_amount,
                    qty: item.qty,
                    item: item.item
                });
            }

            return result as CartReponse;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async update(cartItemDto: CartItemDto, userUuid: string, cartUuid: string): Promise<CartReponse> {
        try {
            const cartInfo: Cart = await this.sharedCartRepo.cartInfo(cartUuid, userUuid);
            const itemInfo: Item = await this.sharedItemRepo.restaurentItemInfo(cartItemDto.uuid, cartInfo.restaurent.uuid);
            if (
                (typeof itemInfo.max_order_qty === 'number' && itemInfo.max_order_qty < cartItemDto.qty) ||
                (typeof itemInfo.min_order_qty === 'number' && itemInfo.min_order_qty > cartItemDto.qty)
            ) {
                throw new BadRequestException(`order qty should be between ${itemInfo.min_order_qty} To ${itemInfo.max_order_qty}`);
            }
            const cartItemRepo = await this.database.getRepository(CartItem);
            const cartItemInfo = await this.sharedCartRepo.cartItemInfo(cartUuid, cartItemDto.uuid);
            const discountRate = itemInfo.discount_rate > 0 ? itemInfo.discount_rate / 100 : 1;
            const itemTotalAmount = cartItemDto.qty * (itemInfo.price * discountRate);
            const itemAmount = cartItemDto.qty * itemInfo.price;

            if (cartItemInfo && Object.keys(cartItemInfo).length) {
                await cartItemRepo.createQueryBuilder().update(CartItem).set({
                    qty: cartItemDto.qty,
                    amount: itemAmount,
                    total_amount: itemTotalAmount
                })
                    .where("id = :id", { id: cartItemInfo.id })
                    .output(['amount']).execute();
            } else {
                await cartItemRepo.save({
                    uuid: uuidv4(),
                    item: itemInfo,
                    qty: cartItemDto.qty,
                    amount: itemAmount,
                    total_amount: itemTotalAmount,
                    cart: cartInfo
                });
            }

            return this.getCartResponse(cartInfo);
        } catch (error: any) {
            return throwException(error);
        }
    }

    async delete(itemUuid: string, cartUuid: string, userUuid: string): Promise<CartReponse> {
        try {
            const cartInfo: Cart = await this.sharedCartRepo.cartInfo(cartUuid, userUuid);
            const cartItemInfo = await this.sharedCartRepo.cartItemInfo(cartUuid, itemUuid);
            if (cartItemInfo && Object.keys(cartItemInfo).length) {
                const repo = await this.database.getRepository(CartItem);
                repo.createQueryBuilder("cart_item").delete().where("id = :id", { id: cartItemInfo.id }).execute();
                return await this.getCartResponse(cartInfo);
            }
            throw new NotFoundException('Item not found');
        } catch (error: any) {
            return throwException(error);
        }
    }

    private async getCartResponse(cartInfo: Cart): Promise<CartReponse> {
        try {
            const cartItemsInfo = await this.sharedCartRepo.cartItemsInfo(cartInfo.id);
            const cartItemResponse: CartItemResponse[] = [];
            let cartAmount = 0;
            let totalAmount = 0;

            cartItemsInfo.forEach(ele => {
                cartAmount += ele.amount;
                totalAmount += ele.total_amount;
                cartItemResponse.push({
                    uuid: ele.uuid,
                    qty: ele.qty,
                    amount: ele.amount,
                    total_amount: ele.total_amount,
                    item: ele.item
                });
            });
            let rebate_amount = 0;

            const discountInfo = await this.sharedResRepo.restaurentOrderDiscount(cartInfo.restaurent.uuid);
            if (discountInfo.discount_rate > 0 && totalAmount <= discountInfo.max_amount && totalAmount >= discountInfo.min_amount) {
                rebate_amount = totalAmount * discountInfo.discount_rate;
                totalAmount = totalAmount - rebate_amount;
            }

            const payload: any = {
                cart_amount: cartAmount,
                rebate_amount: rebate_amount,
                total_amount: totalAmount,
                order_discount: null,
            };

            if (rebate_amount > 0) {
                payload['order_discount'] = discountInfo;
            }

            const cartRepo = await this.database.getRepository(Cart);
            const updatedCart = await cartRepo.createQueryBuilder().update(Cart)
                .set(payload)
                .where("id = :id", { id: cartInfo.id })
                .output([
                    'uuid', 'cart_amount', 'total_amount', 'rebate_amount',
                ])
                .execute();

            const cart = updatedCart.raw[0] as Cart;

            const result: CartReponse = {
                uuid: cartInfo.uuid,
                cart_amount: cart.cart_amount,
                total_amount: cart.total_amount,
                rebate_amount: cart.rebate_amount,
                cart_date: cartInfo.cart_date,
                cart_status: cartInfo.cart_status,
                cart_item: cartItemResponse
            };
            return result as CartReponse;
        } catch (error) {
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