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
import { CartReponse } from "../../../shared/utils/response.utils";
import { CartItemDto } from "../dto/cart-item.dto";

@injectable()
export class CartRepository implements ICartRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService
    ) { }

    async create(cartDto: CartDto, userUuid: string, restaurentUuid: string): Promise<CartReponse> {
        try {
            const itemArr: { item: Item, qty: number }[] = [];
            let cartAmount = 0;

            const uniqueItem: CartItemDto[] = [...new Map(cartDto.cart_item.map(item => [item.uuid, item])).values()];

            await Promise.all(
                uniqueItem.map(async (ele) => {
                    const item = await this.itemInfo(ele.uuid, restaurentUuid);
                    cartAmount += item.price * ele.qty;
                    itemArr.push({
                        item: item,
                        qty: ele.qty
                    });
                })
            );

            const cartRepo = await this.database.getRepository(Cart);
            const cartItemRepo = await this.database.getRepository(CartItem);
            const userInfo = await this.userInfo(userUuid);
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

    async retrieve(cartUuid: string, userUuid: string): Promise<CartReponse> {
        try {
            const cartInfo = await this.cartInfo(cartUuid, userUuid);
            const cartItemInfo = await this.cartItemsInfo(cartInfo.id);

            const result: CartReponse = {
                uuid: cartInfo.uuid,
                cart_amount: cartInfo.cart_amount,
                cart_date: cartInfo.cart_date,
                cart_status: cartInfo.cart_status,
                cart_item: []
            };

            for (const item of cartItemInfo) {
                result.cart_item.push({
                    uuid: item.uuid,
                    amount: item.amount,
                    qty: item.qty,
                    item: item.item
                });
            }

            return result as CartReponse;
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException(`${error.message}`);
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    async update(cartItemDto: CartItemDto, userUuid: string, cartUuid: string): Promise<CartReponse> {
        try {
            const cartInfo: Cart = await this.cartInfo(cartUuid, userUuid);
            const itemInfo: Item = await this.itemInfo(cartItemDto.uuid, cartInfo.restaurent.uuid);
            const cartItemRepo = await this.database.getRepository(CartItem);
            let cartItem: CartItem;
            const cartItemInfo = await this.cartItemInfo(cartUuid, cartItemDto.uuid);

            if (cartItemInfo && Object.keys(cartItemInfo).length) {
                const value = await cartItemRepo.createQueryBuilder().update(CartItem).set({
                    qty: cartItemDto.qty,
                    amount: cartItemDto.qty * itemInfo.price,
                })
                    .where("id = :id", { id: cartItemInfo.id })
                    .output(['amount']).execute();

                cartItem = value.raw[0] as CartItem;
            } else {
                cartItem = await cartItemRepo.save({
                    uuid: uuidv4(),
                    item: itemInfo,
                    qty: cartItemDto.qty,
                    amount: cartItemDto.qty * itemInfo.price,
                    cart: cartInfo
                });
            }


            const cartRepo = await this.database.getRepository(Cart);
            const updatedCart = await cartRepo.createQueryBuilder().update(Cart)
                .set({
                    cart_amount: cartInfo.cart_amount + cartItem.amount
                })
                .where("id = :id", { id: cartInfo.id })
                .output([
                    'uuid', 'cart_amount'
                ])
                .execute();

            const result: CartReponse = {
                uuid: cartInfo.uuid,
                cart_amount: updatedCart.raw[0].cart_amount,
                cart_date: cartInfo.cart_date,
                cart_status: cartInfo.cart_status,
                cart_item: []
            };

            const cartItemsInfo = await this.cartItemsInfo(cartInfo.id);
            cartItemsInfo.forEach(ele => {
                result['cart_item'].push({
                    uuid: ele.uuid,
                    qty: ele.qty,
                    amount: ele.amount,
                    item: ele.item
                });
            });

            return result as CartReponse;
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException(`${error.message}`);
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    private async cartItemsInfo(cartId: number): Promise<CartItem[]> {
        try {
            const repo = await this.database.getRepository(CartItem);
            const cartItem: CartItem[] = await repo.createQueryBuilder("cart_item")
                .innerJoinAndSelect("cart_item.cart", "cart")
                .innerJoinAndSelect("cart_item.item", "item")
                .where("cart.id = :id", { id: cartId })
                .getMany();

            if (cartItem && Object.keys(cartItem).length) {
                return cartItem as CartItem[];
            }
            throw new NotFoundException('Cart not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException('Cart not found');
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    async delete(itemUuid: string, cartUuid: string, userUuid: string): Promise<boolean> {
        try {
            await this.cartInfo(cartUuid, userUuid);
            const cartItemInfo = await this.cartItemInfo(cartUuid, itemUuid);
            if (cartItemInfo && Object.keys(cartItemInfo).length) {
                const repo = await this.database.getRepository(CartItem);
                repo.createQueryBuilder("cart_item").delete().where("id = :id", { id: cartItemInfo.id }).execute();
                return Promise.resolve(true);
            }
            throw new NotFoundException('Item not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException(`${error.message}`);
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    private async userInfo(userUuid: string) {
        try {
            const repo = await this.database.getRepository(User);
            const user: User = await repo.findOne({ where: { uuid: userUuid } });

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

    private async itemInfo(uuid: string, restaurentUuid: string) {
        try {
            const repo = await this.database.getRepository(Item);
            const item: Item = await repo.createQueryBuilder('item')
                .innerJoinAndSelect("item.restaurent", "restaurent")
                .where("item.uuid = :uuid", { uuid: uuid })
                .andWhere("item.item_status = :item_status", { item_status: 'active' })
                .andWhere("restaurent.uuid = :restaurentUuid", { restaurentUuid: restaurentUuid })
                .getOne();

            if (item && Object.keys(item).length) {
                return item as Item;
            }
            throw new NotFoundException('Item not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException('Item not found');
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    private async cartInfo(uuid: string, userUuid: string): Promise<Cart> {
        try {
            const repo = await this.database.getRepository(Cart);
            const cart: Cart = await repo.createQueryBuilder("cart")
                .innerJoinAndSelect("cart.user", "user")
                .innerJoinAndSelect("cart.restaurent", "restaurent")
                .where("cart.uuid = :uuid", { uuid: uuid })
                .andWhere("user.uuid = :userUuid", { userUuid: userUuid })
                .getOne();

            if (cart && Object.keys(cart).length) {
                return cart as Cart;
            }
            throw new NotFoundException('Cart not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException(`${error.message}`);
            throw new InternalServerErrorException(`${error.message}`);
        }
    }

    private async cartItemInfo(cartUuid: string, itemUuid: string): Promise<CartItem> {
        try {
            const repo = await this.database.getRepository(CartItem);
            const cartItem: CartItem = await repo.createQueryBuilder("cart_item")
                .innerJoinAndSelect("cart_item.cart", "cart")
                .innerJoinAndSelect("cart_item.item", "item")
                .where("cart.uuid = :uuid", { uuid: cartUuid })
                .andWhere("item.uuid = :itemUuid", { itemUuid: itemUuid })
                .getOne();

            return cartItem as CartItem;
        } catch (error: any) {
            if (error instanceof NotFoundException) throw new NotFoundException(`${error.message}`);
            throw new InternalServerErrorException(`${error.message}`);
        }
    }
}