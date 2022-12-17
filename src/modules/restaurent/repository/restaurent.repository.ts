import { injectable, inject } from "inversify";
import moment from "moment";
import { ILike } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { IDatabaseService } from "../../../core/interface/IDatabase.service";
import { TYPES } from "../../../core/type.core";
import { CreateOrderDiscountDto, RatingDto, RegisterDto, UpdateOrderDiscountDto } from "../dto/index.dto";
import { IRestaurentRepository } from "../interfaces/IRestaurent.repository";
import { UserInfo, User } from "../../../modules/user/entity/index.entity";
import { CurrentStatus, OrderStatus, UserRole, UserType } from "../../../shared/utils/enum";
import { Restaurent } from "../entity/restaurent.entity";
import { BadRequestException, ForbiddenException, NotFoundException, throwException } from "../../../shared/errors/all.exception";
import { Order, OrderDiscount, OrderItem } from "../../../modules/order/entity/index.entity";
import { IElasticsearchService, IOrderSharedRepository, IRestaurentSharedRepo, IUserSharedRepo } from "../../../shared/interfaces/IIndexShared.repository";
import { OrderResponse } from "../../../shared/utils/response.utils";
import { RestaurentRating, RestaurentItem } from "../entity/index.entity";

@injectable()
export class RestaurentRepository implements IRestaurentRepository {
    constructor(
        @inject(TYPES.IDatabaseService) private readonly database: IDatabaseService,
        @inject(TYPES.IRestaurentSharedRepo) private readonly restaurentSharedRepo: IRestaurentSharedRepo,
        @inject(TYPES.IOrderSharedRepository) private readonly orderSharedRepo: IOrderSharedRepository,
        @inject(TYPES.IUserSharedRepo) private readonly userSharedRepo: IUserSharedRepo,
        @inject(TYPES.IElasticsearchService) private readonly elasticsearchService: IElasticsearchService,
    ) { }

    async releaseOrder(orderUuid: String, user: User): Promise<String> {
        try {
            const repo = await this.database.getRepository(Order);
            const updatedRow = await repo.createQueryBuilder().update(Order).set({
                order_status: OrderStatus.RELEASED,
            }).where("uuid = :uuid", { uuid: orderUuid })
                .andWhere("order_status = :orderStatus", { orderStatus: OrderStatus.PENDING })
                .output(['uuid']).execute();

            if (!updatedRow.raw[0].uuid) {
                throw new NotFoundException('Order not found');
            }

            return 'Order Released';
        } catch (error: any) {
            return throwException(error);
        }
    }

    async completeOrder(orderUuid: string, user: User): Promise<String> {
        try {
            const repo = await this.database.getRepository(Order);
            const updatedRow = await repo.createQueryBuilder().update(Order).set({
                order_status: OrderStatus.PAID,
            })
                .where("uuid = :uuid", { uuid: orderUuid })
                .andWhere("order_status = :orderStatus", { orderStatus: OrderStatus.RELEASED })
                .output(['uuid']).execute();

            if (updatedRow.raw.length == 0) {
                throw new NotFoundException('Order not found');
            }

            const resItemRepo = await this.database.getRepository(RestaurentItem);
            const orderItems: OrderItem[] = await this.orderSharedRepo.getOrderItemInfo(orderUuid);

            for (let index = 0; index < orderItems.length; index++) {
                const orderItem = orderItems[index];
                const restaurentItem: RestaurentItem = await this.getRestaurentItem(user, orderItem.uuid);

                if (restaurentItem && Object.keys(restaurentItem).length) {
                    // update count
                    await resItemRepo.createQueryBuilder().update(RestaurentItem)
                        .set({
                            sell_count: orderItem.qty + restaurentItem.sell_count
                        })
                        .where("restaurent_item.uuid = :uuid", { uuid: restaurentItem.uuid })
                        .output(['uuid']).execute();
                } else {
                    // create row
                    const payload = new RestaurentItem();
                    payload.restaurent = user.restaurent;
                    payload.sell_count = orderItem.qty;
                    payload.item = orderItem.item;
                    payload.uuid = uuidv4();

                    await resItemRepo.save(payload);
                }
            }

            return 'Order Complete';
        } catch (error: any) {
            return throwException(error);
        }
    }

    async getRestaurentList(): Promise<Restaurent[]> {
        try {
            const restaurentRepo = await this.database.getRepository(Restaurent);
            return await restaurentRepo.findBy({ current_status: 'active' })
        } catch (error: any) {
            return throwException(error);
        }
    }

    async getOrderList(user: User): Promise<OrderResponse[]> {
        try {
            const restaurent: Restaurent = await this.getRestaurentInfo(user.restaurent.uuid);
            const repo = await this.database.getRepository(Order);
            const orders = await repo.createQueryBuilder('order')
                .innerJoinAndSelect('order.restaurent', 'restaurent')
                .leftJoinAndSelect('order.order_discount', 'order_discount')
                .innerJoinAndSelect('order.user', 'user')
                .where('restaurent.id = :id', { id: restaurent.id })
                .getMany();

            const orderResponseList: OrderResponse[] = [];

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

                orderResponseList.push(
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

            return orderResponseList;
        } catch (error: any) {
            return throwException(error);
        }
    }

    async register(registerDto: RegisterDto): Promise<string> {
        try {
            const userRepo = await this.database.getRepository(User);
            const user = new User();
            user.email = registerDto.email;
            user.uuid = uuidv4();
            user.password = await user.doPasswordhashing(registerDto.password);
            user.user_type = UserType.RESTAURANT_USER;
            user.role = UserRole.OWNER;

            // Create User
            const createdUser = await userRepo.save(user);

            const userInfoRepo = await this.database.getRepository(UserInfo);
            const userInfo = new UserInfo();
            userInfo.uuid = uuidv4();
            userInfo.name = registerDto.name;

            // Create User Info
            const user_info = await userInfoRepo.save(userInfo);

            // create restaurent
            const restaurentRepo = await this.database.getRepository(Restaurent);
            const restaurent = new Restaurent();
            restaurent.uuid = uuidv4();
            restaurent.name = registerDto.name;
            restaurent.address = registerDto.address;
            restaurent.opening_time = registerDto.opening_time;
            restaurent.closing_time = registerDto.closing_time;

            const createdRestaurent = await restaurentRepo.save(restaurent);

            userRepo.update({ id: createdUser.id }, {
                user_info: user_info,
                restaurent: createdRestaurent
            });

            await this.elasticsearchService.indexing({ index: 'restaurants', body: restaurent });
            return 'Restaurent Successfully Created!';
        } catch (error: any) {
            if (error.code == 23505) throw new BadRequestException('Email Already Exists!');
            return throwException(error);
        }
    }

    async getOrderDiscount(user: User): Promise<OrderDiscount[]> {
        try {
            const restaurent: Restaurent = await this.restaurentSharedRepo.restaurentInfo(user.restaurent.uuid);
            if (Object.keys(restaurent.id) && restaurent.current_status == CurrentStatus.ACTIVE) {
                const repo = await this.database.getRepository(OrderDiscount);
                return repo.createQueryBuilder('order_discount')
                    .innerJoinAndSelect('order_discount.restaurent', 'restaurent')
                    .where('restaurent.id = :id', { id: restaurent.id })
                    .getMany();
            }
            throw new BadRequestException('Not allowed');
        } catch (error: any) {
            return throwException(error);
        }
    }

    async createOrderDiscount(orderDiscountDto: CreateOrderDiscountDto, user: User): Promise<OrderDiscount> {
        try {
            const restaurent: Restaurent = await this.restaurentSharedRepo.restaurentInfo(user.restaurent.uuid);
            if (Object.keys(restaurent).length && restaurent.current_status == CurrentStatus.ACTIVE) {
                const repo = await this.database.getRepository(OrderDiscount);

                const existingResult: OrderDiscount = await repo.createQueryBuilder('order_discount')
                    .where((qb) => {
                        const subQuery = qb
                            .subQuery()
                            .select('restaurent.id')
                            .from(Restaurent, "restaurent")
                            .where("restaurent.id = :restaurentId")
                            .getQuery()

                        return "order_discount.restaurentId = " + subQuery
                    })
                    .setParameter("restaurentId", restaurent.id)
                    .where('order_discount.start_date <= :start_date', { start_date: orderDiscountDto.start_date })
                    .andWhere('order_discount.end_date >= :end_date', { end_date: orderDiscountDto.end_date })
                    .getOne();

                if (existingResult && Object.keys(existingResult).length) {
                    throw new BadRequestException('Already exists.');
                }

                const orderDiscount = new OrderDiscount();
                orderDiscount.uuid = uuidv4();
                orderDiscount.restaurent = restaurent;
                orderDiscount.discount_rate = orderDiscountDto.discount_rate;
                orderDiscount.max_amount = orderDiscountDto.max_amount;
                orderDiscount.min_amount = orderDiscountDto.min_amount;
                orderDiscount.start_date = orderDiscountDto.start_date;
                orderDiscount.end_date = orderDiscountDto.end_date;
                orderDiscount.created_date = moment().format('YYYY-MM-DD HH:mm:ss');

                const result: OrderDiscount = await repo.save(orderDiscount);
                return result;
            }
            throw new BadRequestException('Not allowed');
        } catch (error: any) {
            return throwException(error);
        }
    }

    async updateOrderDiscount(orderDiscountDto: UpdateOrderDiscountDto, user: User, uuid: string): Promise<OrderDiscount> {
        try {
            const restaurent: Restaurent = await this.restaurentSharedRepo.restaurentInfo(user.restaurent.uuid);
            if (Object.keys(restaurent).length && restaurent.current_status == CurrentStatus.ACTIVE) {
                const orderDiscount: OrderDiscount = await this.getAOrderDiscount(uuid, user);
                const repo = await this.database.getRepository(OrderDiscount);
                const updatedDiscount = await repo.createQueryBuilder('order_discount')
                    .update(OrderDiscount)
                    .set(orderDiscountDto)
                    .where("order_discount.id = :id", { id: orderDiscount.id })
                    .output([
                        'uuid', 'name', 'max_amount', 'min_amount', 'discount_rate',
                        'start_date', 'end_date', 'created_date'
                    ])
                    .execute();
                if (updatedDiscount.raw[0] && Object.keys(updatedDiscount.raw[0])) {
                    return {
                        uuid: uuid,
                        max_amount: updatedDiscount.raw[0].max_amount,
                        min_amount: updatedDiscount.raw[0].min_amount,
                        discount_rate: updatedDiscount.raw[0].discount_rate,
                        start_date: updatedDiscount.raw[0].start_date,
                        end_date: updatedDiscount.raw[0].end_date,
                        restaurent: restaurent,
                    } as OrderDiscount;
                }
                throw new BadRequestException('Nothing Updated');
            }
            throw new BadRequestException('Not allowed');
        } catch (error: any) {
            return throwException(error);
        }
    }

    async deleteOrderDiscount(user: User, uuid: string): Promise<boolean> {
        try {
            const restaurent: Restaurent = await this.restaurentSharedRepo.restaurentInfo(user.restaurent.uuid);
            if (Object.keys(restaurent).length && restaurent.current_status == CurrentStatus.ACTIVE) {
                await this.getAOrderDiscount(uuid, user);
                const repo = await this.database.getRepository(OrderDiscount);
                await repo.createQueryBuilder()
                    .delete()
                    .from(OrderDiscount)
                    .where("order_discount.uuid = :uuid", { uuid: uuid })
                    .execute();
                return true;
            }
            throw new BadRequestException('Not allowed');
        } catch (error: any) {
            return throwException(error);
        }
    }

    async giveRating(user: User, ratingDto: RatingDto): Promise<String> {
        try {
            const restaurentInfo: Restaurent = await this.getRestaurentInfo(ratingDto.restaurent_uuid);
            if (user.user_type !== UserType.VISITOR) {
                throw new ForbiddenException('Not allowed');
            }
            const repo = await this.database.getRepository(RestaurentRating);
            const ratings: RestaurentRating = await repo.createQueryBuilder('restaurent_rating')
                .innerJoinAndSelect("restaurent_rating.restaurent", "restaurent")
                .innerJoinAndSelect("restaurent_rating.user", "user")
                .where("restaurent.current_status = :status", { status: CurrentStatus.ACTIVE })
                .andWhere("user.uuid = :uuid", { uuid: user.uuid })
                .getOne();

            if (ratings != null && Object.keys(ratings).length) {
                await repo.createQueryBuilder()
                    .update(RestaurentRating)
                    .set({ star: ratingDto.star })
                    .where("restaurent_rating.uuid = :uuid", { uuid: ratings.uuid })
                    .output(['uuid'])
                    .execute();
            } else {
                const restaurentRating = new RestaurentRating();
                restaurentRating.uuid = uuidv4();
                restaurentRating.user = await this.getUserInfo(user.uuid);
                restaurentRating.star = ratingDto.star;
                restaurentRating.restaurent = restaurentInfo;
                restaurentRating.rating_date = moment().format('YYYY-MM-DD HH:mm:ss');
                await repo.save(restaurentRating);
            }
            return 'Thanks for your feedback';
        } catch (error: any) {
            return throwException(error);
        }
    }

    async searchRestaurant(keyword: string): Promise<Restaurent[]> {
        try {
            return await this.elasticsearchService.search({
                index: 'restaurants',
                queryObj: {
                    bool: {
                        must: [
                            {
                                term: {
                                    'current_status.keyword': {
                                        "value": "active"
                                    }
                                }
                            }
                        ],
                        should: [
                            {
                                query_string: {
                                    fields: ["name", "address"],
                                    query: `${keyword}*`
                                }
                            }
                        ],
                        "minimum_should_match": 1
                    },
                }
            });
        } catch (error: any) {
            return throwException(error);
        }
    }

    private async getAOrderDiscount(uuid: String, user: User): Promise<OrderDiscount> {
        try {
            const repo = await this.database.getRepository(OrderDiscount);
            const orderDiscount: OrderDiscount = await repo.createQueryBuilder('order_discount')
                .innerJoinAndSelect('order_discount.restaurent', 'restaurent')
                .where((qb) => {
                    const subQuery = qb
                        .subQuery()
                        .select('restaurent.id')
                        .from(Restaurent, "restaurent")
                        .where("restaurent.id = :restaurentId")
                        .getQuery()

                    return "order_discount.restaurentId = " + subQuery
                })
                .setParameter("restaurentId", user.restaurent.id)
                .where('order_discount.uuid = :uuid', { uuid: uuid })
                .getOne();

            if (orderDiscount && Object.keys(orderDiscount)) {
                return orderDiscount;
            }
            throw new NotFoundException('Not Found.');
        } catch (error: any) {
            return throwException(error);
        }
    }

    private async getRestaurentInfo(uuid: string): Promise<Restaurent> {
        const restaurent: Restaurent = await this.restaurentSharedRepo.restaurentInfo(uuid);
        if (Object.keys(restaurent.id) && restaurent.current_status == CurrentStatus.ACTIVE) {
            return restaurent;
        }
        throw new BadRequestException('Not allowed');
    }

    private async getRestaurentItem(user: User, itemUuid: string): Promise<RestaurentItem> {
        const repo = await this.database.getRepository(RestaurentItem);
        return await repo.createQueryBuilder('restaurent_item')
            .innerJoinAndSelect("restaurent_item.restaurent", "restaurent")
            .innerJoinAndSelect("restaurent_item.item", "item")
            .where('restaurent.uuid = :uuid', { uuid: user.restaurent.uuid })
            .andWhere('item.uuid = :uuid', { uuid: itemUuid })
            .getOne();
    }

    private async getUserInfo(userUuid: string): Promise<User> {
        const user: User = await this.userSharedRepo.userInfo(userUuid);
        if (user != null && Object.keys(user.id)) {
            return user;
        }
        throw new BadRequestException('Not found');
    }
}