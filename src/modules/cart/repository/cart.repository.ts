import { inject, injectable } from "inversify";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { TYPES } from "../../../core/type.core";
import { IDatabaseService } from "../../../core/interface/IDatabase.service";
import { Cart } from "../entity/cart.entity";
import { ICartRepository } from "../interfaces/ICart.repository";
import { CartDto } from "../dto/cart.dto";
import { InternalServerErrorException, NotFoundException } from "../../../shared/errors/all.exception";
import { User } from "../../user/entity/user.entity";
import { Restaurent } from "../../restaurent/entity/restaurent.entity";
import { Item } from "../../item/entity/item.entity";
import { CartItem } from "../entity/cart-item.entity";
import { CartItemResponse, CartReponse } from "../../../shared/utils/response.utils";

@injectable()
export class CartRepository implements ICartRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService
    ) { }

    async create(cartDto: CartDto, userId: number, restaurentUuid: string): Promise<CartReponse> {
        try {
            const itemArr: { item: Item, qty: number }[] = [];
            let cartAmount = 0;

            await Promise.all(
                cartDto.cart_item.map(async (ele) => {
                    const item = await this.itemInfo(ele.uuid);
                    cartAmount += item.price * ele.qty;
                    itemArr.push({
                        item: item,
                        qty: ele.qty
                    });
                })
            );

            const cartRepo = await this.database.getRepository(Cart);
            const cartItemRepo = await this.database.getRepository(CartItem);
            const userInfo = await this.userInfo(userId);
            const restaurentInfo = await this.restaurentInfo(restaurentUuid);

            const cart = new Cart();
            cart.uuid = uuidv4();
            cart.restaurent = restaurentInfo;
            cart.user = userInfo;
            cart.cart_amount = cartAmount;
            cart.cart_date = moment().format('YYYY-MM-DD HH:mm:ss');

            const cart_info: Cart = await cartRepo.save(cart);

            const result: CartReponse = {
                uuid: cart_info.uuid,
                cart_amount: cart_info.cart_amount,
                cart_date: cart_info.cart_date,
                cart_status: cart_info.cart_status,
                cart_item: []
            };

            await Promise.all(
                itemArr.map(async (ele) => {
                    const value: CartItem = await cartItemRepo.save({
                        uuid: uuidv4(),
                        item: ele.item,
                        qty: ele.qty,
                        amount: ele.qty * ele.item.price,
                        cart: cart_info
                    });
                    delete value.item.restaurent;

                    result['cart_item'].push({
                        uuid: value.uuid,
                        qty: value.qty,
                        amount: value.amount,
                        item: value.item
                    });
                })
            );
            return result as CartReponse;
        } catch (error: any) {
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    retrive(): Promise<Cart> {
        throw new Error("Method not implemented.");
    }

    async update(): Promise<CartReponse> {
        throw new Error("Method not implemented.");
    }

    async itemUpdate(): Promise<CartReponse> {
        throw new Error("Method not implemented.");
    }

    delete(): Promise<string> {
        throw new Error("Method not implemented.");
    }

    private async userInfo(userId: number) {
        try {
            const repo = await this.database.getRepository(User);
            const user: User = await repo.findOne({ where: { id: userId } });

            if (Object.keys(user).length) {
                return user as User;
            }
            throw new NotFoundException('User not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException('User not found');
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    private async restaurentInfo(uuid: string) {
        try {
            const repo = await this.database.getRepository(Restaurent);
            const restaurent: Restaurent = await repo.findOne({ where: { uuid: uuid } });
            if (Object.keys(restaurent).length) {
                return restaurent as Restaurent;
            }
            throw new NotFoundException('Restaurent not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException('Restaurent not found');
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    private async itemInfo(uuid: string) {
        try {
            const repo = await this.database.getRepository(Item);
            const item: Item = await repo.findOne({ where: { uuid: uuid, item_status: 'active' } });
            if (item && Object.keys(item).length) {
                return item as Item;
            }
            throw new NotFoundException('Item not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException('Item not found');
            throw new InternalServerErrorException(`${error.message}`);
        }
    }
}